const express = require("express");
const bcrypt = require("bcrypt");
const { User, Kid, Teacher, sequelize } = require("../models");
const router = express.Router();
const auth = require("../middleware/auth");
const checkRole = require("../middleware/permission");
const redisClient = require("../cache");
const logger = require("../config/logger");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Create a new user, with an optional kid creation if `kidData` is provided.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *               - emri
 *               - mbiemri
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *               role:
 *                 type: string
 *                 description: The role of the user (admin, user, etc.)
 *               emri:
 *                 type: string
 *                 description: First name of the user
 *               mbiemri:
 *                 type: string
 *                 description: Last name of the user
 *               kidData:
 *                 type: object
 *                 description: Optional kid data to be associated with the user
 *                 properties:
 *                   emri:
 *                     type: string
 *                     description: First name of the kid
 *                   mbiemri:
 *                     type: string
 *                     description: Last name of the kid
 *                   emriPrindit:
 *                     type: string
 *                     description: First name of the parent
 *                   emailPrindit:
 *                     type: string
 *                     description: Email address of the parent
 *                   nrKontaktues:
 *                     type: string
 *                     description: Contact number for the parent
 *     responses:
 *       201:
 *         description: User and optional kid created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  const { email, password, role, emri, mbiemri, kidData } = req.body;
  logger.info("Request received:", req.body);

  const transaction = await sequelize.transaction();
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logger.warn("User already exists with this email:", email);
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(
      {
        email,
        password: hashedPassword,
        emri,
        mbiemri,
        role,
      },
      { transaction }
    );

    const teacher = await Teacher.findOne({ where: { teacherID: kidData.kidTeacherID } });
    if (!teacher) {
      return res.status(400).json({ message: `Teacher with ID ${kidData.kidTeacherID} does not exist` });
    }

    if (kidData) {
      await Kid.create(
        {
          ...kidData,
          emailPrindit: email,
          userID: newUser.userID,
        },
        { transaction }
      );
    }

    redisClient.del("users");

    await transaction.commit();
    res.status(201).json({
      success: true,
      message: "User and Kid created successfully",
      user: newUser,
    });

  } catch (error) {
    logger.error("Error during user creation:", error);
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message:
        "An error occurred during user creation. Please try again later.",
    });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users. Accessible only by admins.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userID:
 *                     type: integer
 *                   emri:
 *                     type: string
 *                   mbiemri:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *       500:
 *         description: Failed to fetch users
 */
router.get("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const cacheData = await redisClient.get("users");
    if (cacheData) {
      logger.info("Serving users from cache...");
      return res.json(JSON.parse(cacheData));
    }

    const users = await User.findAll();
    const plainUsers = users.map(user => user.toJSON());
    
    redisClient.setEx("users", 3600, JSON.stringify(plainUsers));
    
    res.json(plainUsers);
    
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});


/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the profile of the current user
 *     tags: [Users]
 *     description: Retrieve the profile details of the currently authenticated user.
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   userID:
 *                     type: integer
 *                   emri:
 *                     type: string
 *                   mbiemri:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch profile
 */
router.get("/profile", auth, async (req, res) => {
  try {
    const userID = req.user.userID;
    logger.info("User ID from token:", userID);

    const cacheData = await redisClient.get(`user:${userID}`);
    if (cacheData) {
      logger.info("Serving profile from cache...");
      return res.status(200).json(JSON.parse(cacheData));
    }

    const user = await User.findOne({
      where: { userID: userID },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    redisClient.setEx(`user:${userID}`, 3600, JSON.stringify(user));

    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});


/**
 * @swagger
 * /users/{userID}:
 *   put:
 *     summary: Update an existing user's details
 *     tags: [Users]
 *     description: Update an existing user's details, including role and password.
 *     parameters:
 *       - name: userID
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: First name of the user
 *               mbiemri:
 *                 type: string
 *                 description: Last name of the user
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: New password for the user (optional)
 *               role:
 *                 type: string
 *                 description: Role of the user
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Email is already in use by another user
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update user
 */
router.put("/:userID", auth, checkRole(["admin", "user"]), async (req, res) => {
  try {
    const { emri, mbiemri, email, password, role } = req.body;
    const userID = req.params.userID;

    const user = await User.findOne({
      where: { userID },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (user.email !== email) {
      const userEmail = await User.findOne({
        where: { email },
      });

      if (userEmail) {
        return res.status(400).json({ error: "Email is already in use by another user." });
      }
    }

    const updatedData = { emri, mbiemri, email, role };

    if (password) {
      if (!isHashedPassword(password)) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
      } else {
        updatedData.password = user.password;
      }
    }

    await User.update(updatedData, { where: { userID } });

    if (user.email !== email || user.emri !== emri || user.mbiemri !== mbiemri) {
      await Kid.update(
        { emailPrindit: email, emriPrindit: emri, mbiemri: mbiemri },
        { where: { emailPrindit: user.email } }
      );
    }

    redisClient.del(`user:${userID}`);
    redisClient.del("users");

    res.status(200).json({ message: "User and associated kid updated successfully" });
  } catch (error) {
    logger.error("Error during user update:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});


const isHashedPassword = (password) => {
  return /^(\$2[aby]\$)/.test(password);
};

/**
 * @swagger
 * /users/{userID}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Delete a user and their associated kid (if any).
 *     parameters:
 *       - name: userID
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User and associated kid deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user and associated kid
 */
router.delete("/:userID", auth, checkRole(["admin", "user"]), async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userID = req.params.userID;

    const user = await User.findOne({
      where: { userID: userID },
      include: { model: Kid },
      transaction,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (user.Kid) {
      await user.Kid.destroy({ transaction });
    }

    await user.destroy({ transaction });

    await transaction.commit();

    redisClient.del(`user:${userID}`);
    redisClient.del("users");

    res.status(200).json({ message: "User and associated kid deleted successfully!" });
  } catch (error) {
    logger.error("Error during user deletion:", error);
    await transaction.rollback();
    res.status(500).json({ error: "Failed to delete user and associated kid!" });
  }
});


module.exports = router;