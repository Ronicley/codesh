const express = require('express');
const dbConfig = require('./config/development.config.js');
const mongoose = require('mongoose');
const cronJob = require("./config/cron.job")

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(() => {
   console.log("Successfully connected to the express-mongo-app database");
}).catch(err => {
   console.log('Could not connect to the database. Exiting now...', err);
   process.exit();
});

// define a simple route
app.get('/', (req, res) => {
   res.json({ "message": "Welcome to ExpressMongoApp application. Created by IT Jugadu" });
});

cronJob.job.start()

// listen for requests
app.listen(3000, () => {
   console.log("Server is listening on port 3000");
});