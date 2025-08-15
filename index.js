const express = require("express");
const app= express();
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser.json())

const port = '3001';
const stu = require('./routes/home');
const User = require('./routes/user');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wap');
    console.log(' MongoDB Connected...');
  } catch (err) {
    console.error(' MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};


connectDB();
app.set('views','./views')
app.set('view engine','ejs')

console.log("RUNNING FILE:", __filename);
app.use(express.static((__dirname, 'public')));


app.use('/',stu);
app.use('/user',User);

app.listen(port);