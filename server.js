const express = require('express');
const connectDb = require('./config/db');
const app = express();
const PORT = process.env.port || 5000;

//connect db
connectDb();

//init middleware for bodyparsing
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API is working now! :)');
});

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
