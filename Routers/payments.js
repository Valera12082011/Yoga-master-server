const express = require('express');
const Payment = require('./models/Payment'); // Шлях до моделі Payment
const router = express.Router();

// Створити новий платіж
router.post('/', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Отримати платіж за PaymentId
router.get('/:PaymentId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ PaymentId: req.params.PaymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Оновити статус платежу
router.put('/:PaymentId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { PaymentId: req.params.PaymentId },
      { status },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Видалити платіж
router.delete('/:PaymentId', async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({ PaymentId: req.params.PaymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Отримати всі платежі для конкретного користувача
router.get('/user/:userid', async (req, res) => {
  try {
    const payments = await Payment.find({ userid: req.params.userid });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Отримати останні кілька платежів (наприклад, останні 10)
router.get('/latest/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count, 10);
    const payments = await Payment.find().sort({ paymentdate: -1 }).limit(count);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userid/total', async (req, res) => {
  try {
    const totalAmount = await Payment.aggregate([
      { $match: { userid: req.params.userid } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json(totalAmount[0] ? totalAmount[0].total : 0);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
