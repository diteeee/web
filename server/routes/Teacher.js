const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { Teacher } = require("../models");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/permission");
const redisClient = require("../cache");
const logger = require("../config/logger");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     description: Get all teachers
 *     responses:
 *       200:
 *         description: A list of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   teacherID:
 *                     type: integer
 *                   emri:
 *                     type: string
 *                   mbiemri:
 *                     type: string
 *                   nrTel:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  const cacheKey = "teachers";

  try {
    if (!redisClient.isOpen) {
      logger.info("Redis client not connected, reconnecting...");
      await redisClient.connect();
    }

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      logger.info("Serving teachers from cache...");
      return res.json(JSON.parse(cachedData));
    }

    logger.info("Cache miss, fetching from database...");
    const all = await Teacher.findAll();

    if (all && all.length > 0) {
      logger.info("Storing teachers in Redis cache...");
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(all));
      res.json(all);
    } else {
      res.status(404).json({ error: "No teachers found" });
    }
  } catch (error) {
    logger.error("Error fetching teachers from Redis or database:", error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     descriptions: Add a teacher
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: First name of the teacher
 *               mbiemri:
 *                 type: string
 *                 description: Last name of the teacher
 *               nrTel:
 *                 type: string
 *                 description: Phone number of the teacher
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Image of the teacher
 *     responses:
 *       200:
 *         description: Teacher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teacherID:
 *                   type: integer
 *                 emri:
 *                   type: string
 *                 mbiemri:
 *                   type: string
 *                 nrTel:
 *                   type: string
 *                 img:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, checkRole(["admin"]), upload.single("imageUrl"), async (req, res) => {
    try {
      const { emri, mbiemri, nrTel } = req.body;
      const imageUrl = req.file ? req.file.path : "";

      const newTeacher = await Teacher.create({
        emri,
        mbiemri,
        nrTel,
        imageUrl,
      });

      redisClient.del("teachers");

      res.json(newTeacher);
    } catch (error) {
      res.status(500).json({ error: "Failed to create teacher" });
    }
  }
);


/**
 * @swagger
 * /teachers/{teacherID}:
 *   put:
 *     summary: Update an existing teacher's details
 *     tags: [Teachers]
 *     description: Update an existing teacher's details, including the option to update their profile image.
 *     parameters:
 *       - name: teacherID
 *         in: path
 *         required: true
 *         description: ID of the teacher to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: First name of the teacher
 *               mbiemri:
 *                 type: string
 *                 description: Last name of the teacher
 *               nrTel:
 *                 type: string
 *                 description: Phone number of the teacher
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Profile image of the teacher (optional)
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 teacher:
 *                   type: object
 *                   properties:
 *                     emri:
 *                       type: string
 *                     mbiemri:
 *                       type: string
 *                     nrTel:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                       description: URL of the teacher's profile image
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Failed to update teacher
 */
router.put("/:teacherID", auth, checkRole(["admin"]), upload.single("imageUrl"), async (req, res) => {
    try {
      const { emri, mbiemri, nrTel } = req.body;

      const teacherID = req.params.teacherID;

      const teacher = await Teacher.findOne({
        where: {
          teacherID,
        },
      });

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found!" });
      }

      const imageUrl = req.file ? req.file.path : teacher.imageUrl;

      await Teacher.update(
        { emri, mbiemri, nrTel, imageUrl },
        { where: { teacherID: teacherID } }
      );

      redisClient.del("teachers");

      res.status(200).json({ message: "Teacher updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update teacher" });
    }
  }
);

/**
 * @swagger
 * /teachers/{teacherID}:
 *   delete:
 *     summary: Delele an existing teacher
 *     tags: [Teachers]
 *     description: Delete a teacher by ID
 *     parameters:
 *       - in: path
 *         name: teacherID
 *         required: true
 *         description: ID of the teacher to delete
 *         type: integer
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:teacherID", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const teacherID = req.params.teacherID;

    const teacher = await Teacher.findOne({
      where: {
        teacherID: teacherID,
      },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found!" });
    }

    await teacher.destroy();

    redisClient.del("teachers");

    res.status(200).json({ message: "Teacher deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete teacher!" });
  }
});

module.exports = router;
