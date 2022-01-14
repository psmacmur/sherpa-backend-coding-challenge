const express = require('express');
const Sequelize = require('sequelize');

// const app = express();
// const port = 8001;

const connection = new Sequelize('db', 'user', 'pass', {
host: 'localhost',
dialect: 'sqlite',
storage: 'db.sqlite',
operatorsAliases: false
})

connection
.authenticate()
.then(() => {
console.log('Connection to database established successfully.');
})
.catch((err: any) => {
console.log('Unable to connect to the database: ', err);
})

const Event =
connection.define('Event', {
    name: Sequelize.STRING,
    isOutside: Sequelize.BOOLEAN,
    location: Sequelize.STRING,
    date: Sequelize.DATE,
    organizer: Organizer
});
// app.listen(port, () => {
// console.log('Running server on port ' + port);
// })
