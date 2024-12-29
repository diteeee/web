const express = require("express");
const router = express.Router();
const { Kid, User } = require("../models");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/permission");
const redisClient = require("../cache");
const logger = require("../config/logger");

/**
 * @swagger
 * /kids:
 *   get:
 *     summary: Get all kids
 *     tags: [Kids]
 *     description: Get all teachers
 *     responses:
 *       200:
 *         description: Successfully fetched kids.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   kidID:
 *                     type: integer
 *                   emri:
 *                     type: string
 *                   mbiemri:
 *                     type: string
 *                   emriPrindit:
 *                     type: string
 *                   emailPrindit:
 *                     type: string
 *                   nrKontaktues:
 *                     type: string
 *                   kidTeacherID:
 *                     type: integer
 *       500:
 *         description: Internal server error.
 */
router.get("/", auth, checkRole(["admin", "user"]), async (req, res) => {
  try {
    const cacheData = await redisClient.get("kids");
    if (cacheData) {
      logger.info("Serving kids from cache...");
      return res.json(JSON.parse(cacheData));
    }

    const kids = await Kid.findAll();
    redisClient.setEx("kids", 3600, JSON.stringify(kids));
    res.json(kids);
  } catch (error) {
    logger.error("Error fetching kids:", error);
    res.status(500).json({ error: "Failed to fetch kids." });
  }
});


/**
* @swagger
* /kids/my-kid:
*   get:
*     summary: Get a kid by parent email
*     tags: [Kids]
*     description: Retrieve the kids details of the parent email.
*     parameters:
*       - in: query
*         name: email
*         required: true
*         schema:
*           type: string
*         description: Parent's email to fetch their kid.
*     responses:
*       200:
*         description: Successfully fetched the kid.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 kidID:
*                   type: integer
*                 emri:
*                   type: string
*                 mbiemri:
*                   type: string
*                 emriPrindit:
*                   type: string
*                 emailPrindit:
*                   type: string
*                 nrKontaktues:
*                   type: string
*       404:
*         description: Kid or User not found.
*       500:
*         description: Internal server error.
*/
router.get("/my-kid", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const cachedKid = await redisClient.get(`kid:${email}`);
    if (cachedKid) {
      logger.info("Serving kid from cache...");
      return res.json(JSON.parse(cachedKid));
    }

    const kid = await Kid.findOne({
      where: { emailPrindit: email },
    });

    if (!kid) {
      return res.status(404).json({ error: "No kid found for this user!" });
    }

    redisClient.setEx(`kid:${email}`, 3600, JSON.stringify(kid));
    res.json(kid);
  } catch (error) {
    logger.error("Error fetching kid:", error);
    res.status(500).json({ error: "Failed to fetch kid." });
  }
});


/**
 * @swagger
 * /kids:
 *   post:
 *     summary: Add a new kid
 *     tags: [Kids]
 *     description: Add a kid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: First name of the kid
 *               mbiemri:
 *                 type: string
 *                 description: Last name of the kid
 *               emriPrindit:
 *                 type: string
 *                 description: Parent of the kid
 *               emailPrindit:
 *                 type: string
 *                 description: Parent's email
 *               nrKontaktues:
 *                 type: string
 *                 description: Parent's number
 *               kidTeacherID:
 *                 type: integer
 *                 description: Teacher
 *     responses:
 *       201:
 *         description: Kid added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emri:
 *                   type: string
 *                 mbiemri:
 *                   type: string
 *                 emriPrindit:
 *                   type: integer
 *                 emailPrindit:
 *                   type: string
 *                 nrKontaktues:
 *                   type: string
 *                 kidTeacherID:
 *                   type: string
 *                 userID:
 *                   type: string
 *       500:
 *         description: Internal server error.
 */
router.post("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const kid = req.body;
    
    const newKid = await Kid.create(kid);

    redisClient.del("kids");

    res.status(201).json(newKid);
  } catch (error) {
    logger.error("Error creating kid:", error);
    res.status(500).json({ error: "Failed to create kid." });
  }
});


/**
 * @swagger
 * /kids/{kidID}:
 *   put:
 *     summary: Update kid details
 *     description: Update an existing kids's details
 *     tags: [Kids]
 *     parameters:
 *       - in: path
 *         name: kidID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the kid to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: First name of the kid
 *               mbiemri:
 *                 type: string
 *                 description: Last name of the kid
 *               emriPrindit:
 *                 type: string
 *                 description: Name of the parent
 *               emailPrindit:
 *                 type: string
 *                 description: Parent's email
 *               nrKontaktues:
 *                 type: string
 *                 description: Parent's number
 *               kidTeacherID:
 *                 type: integer
 *                 description: Teacher ID
 *     responses:
 *       200:
 *         description: Kid updated successfully.
 *       404:
 *         description: Kid not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:kidID", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { emri, mbiemri, emriPrindit, emailPrindit, nrKontaktues } = req.body;
    const kidID = req.params.kidID;

    const kid = await Kid.findOne({
      where: { kidID },
    });

    if (!kid) {
      return res.status(404).json({ error: "Kid does not exist!" });
    }

    await Kid.update(
      { emri, mbiemri, emriPrindit, emailPrindit, nrKontaktues },
      { where: { kidID } }
    );

    redisClient.del(`kid:${kid.emailPrindit}`);
    redisClient.del("kids");

    res.status(200).json({ message: "Kid updated successfully" });
  } catch (error) {
    logger.error("Error updating kid:", error);
    res.status(500).json({ error: "Failed to update kid." });
  }
});


/**
 * @swagger
 * /kids/{kidID}:
 *   delete:
 *     summary: Delete a kid
 *     tags: [Kids]
 *     parameters:
 *       - in: path
 *         name: kidID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the kid to delete
 *     responses:
 *       200:
 *         description: Kid deleted successfully.
 *       404:
 *         description: Kid not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:kidID", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const kidID = req.params.kidID;

    const kid = await Kid.findOne({
      where: { kidID },
    });

    if (!kid) {
      return res.status(404).json({ error: "Kid does not exist!" });
    }

    await kid.destroy();

    redisClient.del(`kid:${kid.emailPrindit}`);
    redisClient.del("kids");

    res.status(200).json({ message: "Kid deleted successfully!" });
  } catch (error) {
    logger.error("Error deleting kid:", error);
    res.status(500).json({ error: "Failed to delete kid." });
  }
});

module.exports = router;
