const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// MOVE THIS ROUTE FIRST - before any parameterized routes
router.get('/all', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.order_id, p.file, o.status
      FROM payment p
      JOIN orders o ON p.order_id = o.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'FAIL', message: 'Database error' });
  }
});

/**
 * GET /v1/payment/:id/form
 * Ambil informasi pembayaran berdasarkan order_id
 */
router.get('/:id/form', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT p.*, o.price
       FROM payment p
       JOIN orders o ON p.order_id = o.id
       WHERE p.order_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'NOT_FOUND', message: 'Data pembayaran tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'FAIL', message: 'Database error' });
  }
});

/**
 * POST /v1/payment/:id/form
 * Upload bukti pembayaran berdasarkan order_id
 */
router.post('/:id/form', upload.single('file'), async (req, res) => {
  const { id } = req.params; // ORDER001, etc
  const filePath = req.file?.filename;

  if (!filePath) {
    return res.status(400).json({ status: 'FAIL', message: 'Missing file' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // update bukti pembayaran
    const paymentUpdate = await client.query(
      `UPDATE payment
       SET file = $1,
           status = 'PENDING',
           created_at = CURRENT_TIMESTAMP
       WHERE order_id = $2`,
      [filePath, id]
    );

    if (paymentUpdate.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'NOT_FOUND', message: 'Order tidak ditemukan' });
    }

    // update status order
    await client.query(
      `UPDATE orders SET status = 'Sedang Diverifikasi' WHERE id = $1`,
      [id]
    );

    await client.query('COMMIT');
    res.json({ status: 'SUCCESS' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ status: 'FAIL', message: 'Database error' });
  } finally {
    client.release();
  }
});

module.exports = router;