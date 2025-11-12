const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(express.json());

// allow your frontend
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: FRONTEND_URL }));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

app.get('/api/products', async(req, res) => {
    try {
        const result = await pool.query('SELECT id, name, price, description FROM products ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'DB error' });
    }
});

app.post('/api/orders', async(req, res) => {
    const { user_name, items, total } = req.body;
    try {
        const client = await pool.connect();
        await client.query('BEGIN');
        const order = await client.query(
            'INSERT INTO orders (user_name, total, created_at) VALUES ($1, $2, NOW()) RETURNING id', [user_name, total]
        );
        const orderId = order.rows[0].id;
        for (const it of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, qty) VALUES ($1, $2, $3)', [orderId, it.product_id, it.qty]
            );
        }
        await client.query('COMMIT');
        client.release();
        res.json({ orderId });
    } catch (e) {
        res.status(500).json({ error: 'DB error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));