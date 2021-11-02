const Product = require("../models/product");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");
const fileHelper = require("../util/file");
const product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Products",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationError: [],
    // isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        description: description,
        price: price,
      },
      errorMessage: "Attach file is not an image",
      validationError: [],
    });
  }
  const errors = validationResult(req);
  // console.log(imageUrl);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        description: description,
        price: price,
      },
      errorMessage: errors.array()[0].msg,
      validationError: errors.array(),
    });
  }
  const imageUrl = image.path;
  // console.log(imageUrl);
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user,
  });
  // Product.create({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description,
  //   //userId: req.user.id,
  // })
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // res.redirect("/500");
      // return res.status(422).render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     description: description,
      //     price: price,
      //   },
      //   errorMessage: "Database Opertaion fails",
      //   validationError: [],
      // });
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Products",
        path: "/admin/edit-product",
        editing: true,
        product: product,
        hasError: false,
        errorMessage: null,
        validationError: [],
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        description: updatedDesc,
        price: updatedPrice,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationError: errors.array(),
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }

      return product.save().then((result) => {
        console.log("Updated product");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found"));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log("PRODUCT DELETED");
      res.redirect("/");
    })
    .catch((e) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     res.redirect("/");
//   }
//   const prodId = req.params.productId;
//   req.user
//     .getProducts({ where: { id: prodId } })
//     // Product.findByPk(prodId)
//     .then((products) => {
//       const product = products[0];
//       if (!product) {
//         res.redirect("/");
//       }
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Products",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;
//   Product.findByPk(prodId)
//     .then((product) => {
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDesc;
//       product.imageUrl = updatedImageUrl;
//       return product.save();
//     })
//     .then((result) => {
//       console.log("Updated product");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   res.redirect("/admin/products");
// };

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .populate("userId")
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// exports.getProducts = (req, res, next) => {
//   //Product.findAll()
//   req.user
//     .getProducts()
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.destroy({
//     where: {
//       id: prodId,
//     },
//   });
//   // (or)
//   // Product.findByPk(prodId)
//   //   .then((product) => {
//   //     return product.destroy();
//   //   })
//   //   .then((res) => {
//   //     console.log("product deleted");
//   //   })
//   //   .catch((err) => {
//   //     console.log(err);
//   //   });
//   res.redirect("/");
// };

// // exports.postAddProduct = (req, res, next) => {
// //   const title = req.body.title;
// //   const imageUrl = req.body.imageUrl;
// //   const description = req.body.description;
// //   const price = req.body.price;
// //   const product = new Product(null, title, imageUrl, description, price);
// //   product
// //     .save()
// //     .then(() => res.redirect("/"))
// //     .catch((err) => console.log(err));
// // };

// // exports.getProducts = (req, res, next) => {
// //   Product.findAll((products) => {
// //     res.render("admin/products", {
// //       prods: products,
// //       pageTitle: "Admin Products",
// //       path: "/admin/products",
// //     });
// //   });
// // };

// // exports.getEditProduct = (req, res, next) => {
// //   const editMode = req.query.edit;
// //   if (!editMode) {
// //     res.redirect("/");
// //   }
// //   const prodId = req.params.productId;
// //   Product.findById(prodId, (product) => {
// //     if (!product) {
// //       return res.redirect("/");
// //     }
// //     res.render("admin/edit-product", {
// //       pageTitle: "Edit Products",
// //       path: "/admin/edit-product",
// //       editing: editMode,
// //       product: product,
// //     });
// //   });
// // };

// // exports.postEditProduct = (req, res, next) => {
// //   const prodId = req.body.productId;
// //   const updatedTitle = req.body.title;
// //   const updatedPrice = req.body.price;
// //   const updatedImageUrl = req.body.imageUrl;
// //   const updatedDesc = req.body.description;
// //   const updatedProduct = new Product(
// //     prodId,
// //     updatedTitle,
// //     updatedImageUrl,
// //     updatedDesc,
// //     updatedPrice
// //   );
// //   updatedProduct.save();
// //   res.redirect("/admin/products");
// // };

// // exports.postDeleteProduct = (req, res, next) => {
// //   const prodId = req.body.productId;
// //   Product.deleteProduct(prodId);
// //   res.redirect("/");
// // };
