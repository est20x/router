// Vercel Serverless Function. Змінні середовища: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const clean = v => String(v || '').replace(/[<>&]/g, '').slice(0, 200);
  const name = clean(b.name), phone = clean(b.phone);
  if (name.length < 2 || phone.replace(/\D/g, '').length < 10) return res.status(400).json({ ok: false });
  const text = `🛒 Нова заявка\nТовар: ${clean(b.product)}\nМодель: DC1018P\nЦіна: 1 849 грн\nІм'я: ${name}\nТелефон: ${phone}`;
  try {
    const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text })
    });
    if (!r.ok) throw new Error('tg');
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(502).json({ ok: false }); }
};
