const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
// Визначення схеми для класу
const classSchema = new Schema({
  password: {
    type: String,
    unique: true
  },
  classesId : {
    type: String, 
    required: true, 
    unique: true, 
    default: uuidv4
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'Instructor', // Вказує на модель інструктора, якщо є
    required: true
  },
  students: [{
    user_id: {
        type: String
    },
    name: {
        type: String
    }
  }],
  reviews: [{
    reviewer: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true // Додає поля createdAt і updatedAt
});

classSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    const hash = crypto.createHash('sha256').update(this.password).digest('hex');
    this.password = hash;
  }
  next();
});

// Метод для перевірки пароля
classSchema.methods.comparePassword = function(candidatePassword) {
  const hash = crypto.createHash('sha256').update(candidatePassword).digest('hex');
  return this.password === hash;
};


// Створення моделі з використанням схеми
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
