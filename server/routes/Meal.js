const express = require('express');
const router = express.Router();
const { Meal } = require("../models");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/permission");
const redisClient = require("../cache");
const logger = require("../config/logger");


/**
 * @swagger
 * /v1/meals:
 *   get:
 *     summary: Get all meals
 *     tags: [Meals]
 *     responses:
 *       200:
 *         description: List of meals
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   mealID:
 *                     type: integer
 *                   emri:
 *                     type: string
 *                   pershkrim:
 *                     type: string
 *                   dita:
 *                     type: string
 *                   orari:
 *                     type: string
 *       500:
 *         description: Failed to fetch meals
 */
router.get("/", auth, checkRole(["admin", "user"]), async (req, res) => {
    try {
        const cacheData = await redisClient.get("meals");
        if (cacheData) {
            logger.info("Serving meals from cache...");
            return res.json(JSON.parse(cacheData));
        }

        const meals = await Meal.findAll();
        redisClient.setEx("meals", 3600, JSON.stringify(meals));
        res.json(meals);
    } catch (error) {
        logger.error("Error fetching meals:", error);
        res.status(500).json({ error: "Failed to fetch meals." });
    }
});

/**
 * @swagger
 * /v1/meals:
 *   post:
 *     summary: Create a new meal
 *     tags: [Meals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: Name of meal
 *               pershkrim:
 *                 type: string
 *                 description: Description of meal
 *               dita:
 *                 type: string
 *                 description: Weed Day of meal
 *               orari:
 *                 type: string
 *                 description: Time of meal
 *     responses:
 *       200:
 *         description: Meal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mealID:
 *                   type: integer
 *                 emri:
 *                   type: string
 *                 pershkrim:
 *                   type: string
 *                 dita:
 *                   type: string
 *                 orari:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, checkRole(["admin"]), async (req, res) => {
    try {
        const { emri, pershkrim, dita, orari } = req.body;

        const newMeal = await Meal.create({
            emri,
            pershkrim,
            dita,
            orari
        });

        redisClient.del("meals");

        res.status(201).json(newMeal);
    } catch (error) {
        logger.error("Error creating meal:", error);
        res.status(500).json({ error: "Failed to create meal." });
    }
});


/**
 * @swagger
 * /v1/meals/{mealID}:
 *   put:
 *     summary: Update an existing meal
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: mealID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the meal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *                 description: The name of the meal
 *               pershkrim:
 *                 type: string
 *                 description: The description of the meal
 *               dita:
 *                 type: string
 *                 description: The day the meal is available
 *               orari:
 *                 type: string
 *                 description: The time the meal is available
 *     responses:
 *       200:
 *         description: Meal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 meal:
 *                   $ref: '#/components/schemas/Meal'
 *       404:
 *         description: Meal does not exist
 *       500:
 *         description: Failed to update meal
 */
router.put("/:mealID", auth, checkRole(["admin"]), async (req, res) => {
    try {
        const { emri, pershkrim, dita, orari } = req.body;
        const mealID = req.params.mealID;

        const meal = await Meal.findOne({
            where: { mealID: mealID }
        });

        if (!meal) {
            return res.status(404).json({ error: "Meal does not exist!" });
        }

        await Meal.update(
            { emri, pershkrim, dita, orari },
            { where: { mealID: mealID } }
        );

        redisClient.del("meals");

        res.status(200).json({ message: "Meal updated successfully" });
    } catch (error) {
        logger.error("Error updating meal:", error);
        res.status(500).json({ error: "Failed to update meal." });
    }
});


/**
 * @swagger
 * /v1/meals/{mealID}:
 *   delete:
 *     summary: Delete a meal
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: mealID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the meal to delete
 *     responses:
 *       200:
 *         description: Meal deleted successfully
 *       404:
 *         description: Meal does not exist
 *       500:
 *         description: Failed to delete meal
 */
router.delete("/:mealID", auth, checkRole(["admin"]), async (req, res) => {
    try {
        const mealID = req.params.mealID;

        const meal = await Meal.findOne({
            where: { mealID: mealID }
        });

        if (!meal) {
            return res.status(404).json({ error: "Meal does not exist!" });
        }

        await meal.destroy();

        redisClient.del("meals");

        res.status(200).json({ message: "Meal deleted successfully!" });
    } catch (error) {
        logger.error("Error deleting meal:", error);
        res.status(500).json({ error: "Failed to delete meal." });
    }
});

module.exports = router;
