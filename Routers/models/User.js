const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  name: { type: String},
  age: { type: Number },
  email: { type: String},
  password: { type: String },
  role: { type: String },
  avatar: { type: Buffer }, // Поле для зберігання аватара у вигляді буфера
  additionalInfo: { type: String } // Додаткова інформація про користувача
});


const User = mongoose.model('User', usersSchema);

module.exports = User;
