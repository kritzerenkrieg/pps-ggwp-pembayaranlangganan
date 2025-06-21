const express = require('express');
const db = require('../db');
const router = express.Router();

/**
 * GET /v1/orders
 * Ambil semua pesanan
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, name, price, status
      FROM orders
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'FAIL', message: 'Database error' });
  }
});

/**
 * POST /v1/orders/:id/status
 * Update status pesanan
 */
router.post('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const update = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status, id]
    );

    if (update.rowCount === 0) {
      return res.status(404).json({ status: 'NOT_FOUND' });
    }

    res.json({ status: 'SUCCESS' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'FAIL', message: 'Database error' });
  }
});

module.exports = router;
