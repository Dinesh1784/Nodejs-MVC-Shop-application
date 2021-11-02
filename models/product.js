const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);

// // const { Sequelize, DataTypes } = require("sequelize");
// // const sequelize = require("../util/database");

// // const Product = sequelize.define("product", {
// //   id: {
// //     type: DataTypes.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true,
// //   },
// //   title: DataTypes.STRING,
// //   price: {
// //     type: DataTypes.DOUBLE,
// //     allowNull: false,
// //   },
// //   imageUrl: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// //   description: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// // });
// // module.exports = Product;

// // const db = require("../util/database");
// // const Cart = require("./cart");

// // module.exports = class Product {
// //   constructor(id, title, imageUrl, description, price) {
// //     this.id = id;
// //     this.title = title;
// //     this.imageUrl = imageUrl;
// //     this.description = description;
// //     this.price = price;
// //   }

// //   save() {
// //     return db.execute(
// //       "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
// //       [this.title, this.price, this.imageUrl, this.description]
// //     );
// //   }

// //   static deleteById(id) {}

// //   static fetchAll() {
// //     return db.execute("SELECT * FROM products");
// //   }
// //   static findById(id) {
// //     return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
// //   }
// // };
// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, imageUrl, description, price) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }
//   save() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .insertOne(this)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectID(prodId) })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Product;
