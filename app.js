const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 8888;

const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@yoga-master.5jorx9z.mongodb.net/yoga-master?retryWrites=true&w=majority`;

// Подключение к MongoDB с использованием Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// Обработчик событий подключения
db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
db.once('open', () => {
  console.log('Успешное подключение к MongoDB!');
});

app.use(express.json()); // Для обробки JSON
app.use(express.urlencoded({ extended: true })); // Для обробки URL-кодованих даних


// Импорт маршрутов
const userRouter = require('./Routers/users');
const classRouter = require('./Routers/classes');
const cartRouter = require('./Routers/cart');
const paymentRouter = require('./Routers/payments');
const enrollmentRouter = require('./Routers/enrolled');
app.use(bodyParser.raw({ type: 'image/png', limit: '10mb' })); // Змініть MIME тип та ліміт за потреби


app.use('/users', userRouter);
app.use('/classes', classRouter);
app.use('/cart', cartRouter);
app.use('/payments', paymentRouter);
app.use('/enrolled', enrollmentRouter)

app.post('/test',(req, res) => {
  console.log(req.body)
  res.send({"msg" : "ghb"})
})


app.listen(port, () => {
  console.log(`Приложение слушает порт ${port}`);
});
