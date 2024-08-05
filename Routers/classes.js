const express = require('express');
const router = express.Router();
const Class = require('./models/classes');

// Create a new class
router.post('/classes', async (req, res) => {
  try {
    // Отримання даних з тіла запиту
    const { name, description, instructor, students, reviews, password } = req.body;

    // Перевірка наявності пароля
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Створення нового класу
    const newClass = new Class({
      name,
      description,
      instructor,
      students,
      reviews,
      password // Пароль буде зашифровано автоматично завдяки методу pre('save')
    });

    // Збереження нового класу в базі даних
    await newClass.save();

    // Відправка відповіді
    res.status(201).json(newClass);
  } catch (error) {
    // Обробка помилок
    res.status(400).json({ message: error.message });
  }
});

// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find(); // Популяція поля інструктора, якщо потрібно
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single class by ID
router.get('/classes/:id', async (req, res) => {
  try {
    const classItem = await Class.find({classesId :req.params.id});
    if (classItem) {
      res.status(200).json(classItem);
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a class by ID
router.put('/classes/:classesId', async (req, res) => {
  try {
    // Знайти і оновити клас за допомогою classesId
    const updatedClass = await Class.findOneAndUpdate(
      { classesId: req.params.classesId }, // Поле для пошуку
      req.body, // Дані для оновлення
      { new: true, runValidators: true } // Опції для оновлення
    );

    if (updatedClass) {
      res.status(200).json(updatedClass); // Успішне оновлення
    } else {
      res.status(404).json({ message: 'Class not found' }); // Клас не знайдено
    }
  } catch (error) {
    res.status(400).json({ message: error.message }); // Помилка запиту
  }
});

// Delete a class by ID
router.delete('/classes/:id', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (deletedClass) {
      res.status(200).json({ message: 'Class deleted successfully' });
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/classes/:id/reviews', async (req, res) => {
  try {
    const classItem = await Class.find({classesId:req.params.id});
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(classItem[0].reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/classes/:classId/students/:studentId', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    classItem.students.id(req.params.studentId).remove();
    await classItem.save();
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/classes/:classId/students/:studentId', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    const student = classItem.students.id(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    Object.assign(student, req.body);
    await classItem.save();
    res.status(200).json(classItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/classes/:id/students', async (req, res) => {
  try {
    const classItem = await Class.findOne({ classesId: req.params.id });

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json(classItem.students);
  } catch (error) {

    res.status(400).json({ message: error.message });
  }
});



module.exports = router;
