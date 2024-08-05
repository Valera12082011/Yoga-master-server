const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  PaymentId: { type: String, default: uuidv4, unique: true },
  userid: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentdate: { type: Date, required: true },
  currency: { type: String },
  status: { type: String, default: 'pending' }, // Додано статус
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;