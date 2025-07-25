const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../Model/toursModel');
const User = require('../../Model/userModel');
const Review = require('../../Model/reviewModel');

dotenv.config({ path: './config.env' });

const DBurl = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.PASSWORD,
);

mongoose
  .connect(DBurl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((_) => {
    console.log('MongoDB connected! 🤩🤩🤩🤩 ');
  })
  .catch((error) => {
    console.log({
      status: 'Error connecting to the Database! ⛓️‍💥 ',
      message: error.message,
    });
  });
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importTours = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data Imported Successfully!');
  } catch (error) {
    console.log('Data Import Failed!', error.message);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data Deleted!');
  } catch (error) {
    console.log('Data Deletion Failed!', error.message);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importTours();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
