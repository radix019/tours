const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');
const DBurl = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.PASSWORD,
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DBurl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((_) => {
    console.log('MongoDB connected! 🤩 ');
  })
  .catch((error) => {
    console.log({
      status: 'Error connecting to the Database! ⛓️‍💥 ',
      message: error.message,
    });
  });

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('App running on port 4000 || 3000...');
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection: ', err.name, err.message);
  console.log('Node shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
