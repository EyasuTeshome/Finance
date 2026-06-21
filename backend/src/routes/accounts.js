const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db/index');

router.get('/', requireAuth, async (req, res) => {
  try {
    res.json(await db.query('SELECT * FROM accounts ORDER BY name'));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, currency, balance } = req.body;
    const [row] = await db.query(
      'INSERT INTO accounts (name, currency, balance) VALUES ($1, $2, $3) RETURNING id',
      [name, currency || 'EUR', balance || 0]
    );
    res.json({ id: row.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { name, balance } = req.body;
    await db.query(
      'UPDATE accounts SET name = COALESCE($1, name), balance = COALESCE($2, balance), last_synced = NOW() WHERE id=$3',
      [name ?? null, balance ?? null, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM accounts WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
