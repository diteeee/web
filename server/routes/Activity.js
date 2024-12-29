const express = require("express");
const router = express.Router();
const { Activity, Teacher } = require("../models");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/permission");
const redisClient = require("../cache");
const logger = require("../config/logger");

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Get all activities
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: List of activities
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   activityID:
 *                     type: integer
 *                   emri:
 *                     type: string
 *                   pershkrim:
 *                     type: string
 *       500:
 *         description: Failed to fetch activities
 */
router.get("/", async (req, res) => {
  try {
    // Check if activities are already cached
    const cachedActivities = await redisClient.get("activities");
    if (cachedActivities) {
      logger.info("Serving activities from cache...");
      return res.json(JSON.parse(cachedActivities));
    }

    // Fetch activities from the database
    const appoints = await Activity.findAll();

    // Cache the activities in Redis
    await redisClient.set("activities", JSON.stringify(appoints), {
      EX: 3600, // Cache expires in 1 hour
    });

    res.json(appoints);
  } catch (error) {
    logger.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});


/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: Name of activity
 *               pershkrim:
 *                 type: string
 *                 description: Description of activity
 *               activityTeacherID:
 *                 type: integer
 *                 description: ID of the teacher for the activity
 *     responses:
 *       201:
 *         description: Activity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activityID:
 *                   type: integer
 *                 emri:
 *                   type: string
 *                 pershkrim:
 *                   type: string
 *                 activityTeacherID:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { emri, pershkrim, activityTeacherID } = req.body;

    const teacher = await Teacher.findOne({
      where: {
        teacherID: activityTeacherID,
      },
    });

    if (!teacher) {
      return res.status(400).json({
        error: "Teacher not found!",
      });
    }

    const newActivity = await Activity.create(req.body);

    // Invalidate the cache for activities
    await redisClient.del("activities");

    res.json(newActivity);
  } catch (error) {
    logger.error("Error inserting activity:", error);
    res.status(500).json({ error: "Failed to insert activity" });
  }
});


/**
 * @swagger
 * /activities/{activityID}:
 *   put:
 *     summary: Update an existing activity
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: activityID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the activity to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: The name of the activity
 *               pershkrim:
 *                 type: string
 *                 description: The description of the activity
 *               activityTeacherID:
 *                 type: string
 *                 description: The ID of the teacher for the activity
 *     responses:
 *       200:
 *         description: Activity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 activity:
 *                   $ref: '#/components/schemas/Activity'
 *       404:
 *         description: Activity does not exist
 *       500:
 *         description: Failed to update activity
 */
router.put("/:activityID", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { emri, pershkrim } = req.body;
    const activityID = req.params.activityID;

    const act = await Activity.findOne({
      where: {
        activityID: activityID,
      },
    });

    if (!act) {
      return res.status(404).json({ error: "Activity does not exist!" });
    }

    await Activity.update(
      { emri, pershkrim },
      { where: { activityID: activityID } }
    );

    // Invalidate the cache for activities
    await redisClient.del("activities");

    res.status(200).json({ message: "Activity updated successfully" });
  } catch (error) {
    logger.error("Error updating activity:", error);
    res.status(500).json({ error: "Failed to update activity" });
  }
});


/**
 * @swagger
 * /activities/{activityID}:
 *   delete:
 *     summary: Delete an activity
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: activityID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the activity to delete
 *     responses:
 *       200:
 *         description: Activity deleted successfully
 *       404:
 *         description: Activity does not exist
 *       500:
 *         description: Failed to delete activity
 */
router.delete("/:activityID", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const activityID = req.params.activityID;

    const act = await Activity.findOne({
      where: {
        activityID: activityID,
      },
    });

    if (!act) {
      return res.status(404).json({ error: "Activity does not exist!" });
    }

    await act.destroy();

    // Invalidate the cache for activities
    await redisClient.del("activities");

    res.status(200).json({ message: "Activity deleted successfully!" });
  } catch (error) {
    logger.error("Error deleting activity:", error);
    res.status(500).json({ error: "Failed to delete activity!" });
  }
});

module.exports = router;
