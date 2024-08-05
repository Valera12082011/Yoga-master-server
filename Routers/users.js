const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Routers/models/User');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const check_sql_injection = require('../utils/check_sql_injection');

const users = express.Router();
const jwtSecret = 'your_jwt_secret_key_here'; // Замініть на ваш реальний секретний ключ

// Функція для хешування пароля
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Функція для перевірки вхідних даних
function validateRegistrationData({ name, email, password }) {
  if (!name || typeof name !== 'string' || check_sql_injection(name)) {
    return 'Invalid name';
  }
  if (!email || !email.includes('@') || check_sql_injection(email)) {
    return 'Invalid email';
  }
  if (!password || password.length < 6 || check_sql_injection(password)) {
    return 'Invalid password';
  }
  return null;
}

// Реєстрація користувача
users.post('/register', async (req, res) => {
  const { name, age, email, password, role, additionalInfo, avatar } = req.body;

  // Валідація даних
  const validationError = validateRegistrationData({ name, email, password });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    // Перевірка, чи вже існує користувач з таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Хешування пароля
    const hashedPassword = hashPassword(password);

    // Створення нового користувача
    const user = new User({
      id: uuidv4(),
      name,
      age: parseInt(age, 10) || null,
      email,
      password: hashedPassword,
      role,
      avatar, // Зберігається як Buffer
      additionalInfo,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:  'User already exists' });
  }
});

// Логін користувача
users.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@') || check_sql_injection(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  if (!password || password.length < 6 || check_sql_injection(password)) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Хешування пароля, введеного користувачем
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Створення токена з терміном дії 7 днів
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Захищений маршрут
users.post('/dashboard', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Перевірка і декодування токена
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const user = await User.findOne({ id: decoded.id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'Welcome to your dashboard',
        user: {
          id: user.id,
          name: user.name,
          age: user.age,
          email: user.email,
          role: user.role,
          additionalInfo: user.additionalInfo,
          avatar: user.avatar // Переконайтеся, що аватар доступний
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// Вихід з системи
users.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Завантаження аватара
users.get('/avatar/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ id: userId });

    if (!user || !user.avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    res.set('Content-Type', 'image/jpeg'); // Встановіть тип вмісту відповідно до типу вашого аватара
    res.send(user.avatar); // Відправляємо аватар як Buffer
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = users;
