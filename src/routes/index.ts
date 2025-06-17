import { Router } from "express";
import { getCurrencyConversion } from "../controllers/currency-converter.controller";

const router = Router();


/**
 * @swagger
 * /transactions:
 *   get:
 *     tags:
 *       - Currency Conversion
 *     summary: Convert between currencies
 *     description: Converts an amount from one currency to another including tax calculation
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: fromCurrency
 *         required: true
 *         schema:
 *           type: string
 *           enum: [BRL, USD, EUR, JPY]
 *           example: BRL
 *       - in: query
 *         name: fromValue
 *         required: true
 *         schema:
 *           type: number
 *           minimum: 0.01
 *           example: 100
 *       - in: query
 *         name: toCurrency
 *         required: true
 *         schema:
 *           type: string
 *           enum: [BRL, USD, EUR, JPY]
 *           example: USD
 *     responses:
 *       200:
 *         description: Successful conversion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionId:
 *                   type: number
 *                 userId:
 *                   type: integer
 *                 fromCurrency:
 *                   type: string
 *                 toCurrency:
 *                   type: string
 *                 fromValue:
 *                   type: number
 *                 toValue:
 *                   type: number
 *                 rate:
 *                   type: number
 *                 transactionTimestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/transactions", getCurrencyConversion);

export default router;
