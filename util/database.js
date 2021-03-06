const mySql = require("mysql2");

const pool = mySql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "passowrd",
});

module.exports = pool.promise();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "password", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

//================================================//
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    MONGODURL
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
