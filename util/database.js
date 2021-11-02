const mySql = require("mysql2");

const pool = mySql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "dinesh1784",
});

module.exports = pool.promise();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "dinesh1784", {
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
    "mongodb+srv://admin:dinesh1784@cluster0.x8lve.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
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
