const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");
const stripe = require("stripe")(
  "sk_test_51JmdGMSBG4P2WYdgvCqz0ftZpCK4eKcUc0fE7GZ5rHJNPCGRmbXxOJRbWhZqrmdnyfyQWbd9OJdQ2G9wCa3aZPpa001mp2g6Dm"
);

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((products) => {
      Product.countDocuments()
        .then((totalProductsCount) => {
          const pagesCount = Math.ceil(totalProductsCount / ITEMS_PER_PAGE);
          return {
            totalPages: pagesCount,
            currPage: page,
            hasPrev: page > 1,
            hasNext: page < pagesCount,
          };
        })
        .then((pagingData) => {
          res.render("shop/product-list", {
            prods: products,
            pageTitle: "Shop",
            path: "/products",
            pagination: pagingData,
          });
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// Product.find()
//   .then((product) => {
//     res.render("shop/product-list", {
//       prods: product,
//       pageTitle: "Shop",
//       path: "/products",
//       // isAuthenticated: req.session.isLoggedIn,
//     });
//   })
//   .catch((err) => {
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   });
//};

// exports.getProducts = (req, res, next) => {
//   Product.fetchAll()
//     .then(([rows]) => {
//       res.render("shop/product-list", {
//         prods: rows,
//         pageTitle: "All Products",
//         path: "/products",
//       });
//     })
//     .catch((err) => {
//       console.log(err.toString());
//     });
// };

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product[0],
  //       pageTitle: product[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findById(prodId)
//     .then(([product]) => {
//       res.render("shop/product-detail", {
//         product: product[0],
//         pageTitle: product.title,
//         path: "/products",
//       });
//     })
//     .catch((err) => console.log(err));
// };
exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  // const page = req.query.page;
  // let totalItems;
  // Product.find()
  //   .countDocument()
  //   .then((numPorduct) => {
  //     totalItems = numPorduct;
  //     return Product.find()
  //       .skip((page - 1) * ITEMS_PER_PAGE)
  //       .limit(ITEMS_PER_PAGE);
  //   })
  //   .then((product) => {
  //     res.render("shop/index", {
  //       prods: product,
  //       pageTitle: "Shop",
  //       path: "/",
  //       currentpage: page,
  //       hasNextpage: ITEMS_PER_PAGE * page < totalItems,
  //       hasPrevioudPage: page > 1,
  //       nextPage: page + 1,
  //       previousPage: page - 1,
  //       lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
  //       // isAuthenticated: req.session.isLoggedIn,
  //       // csrfToken: req.csrfToken(),
  //     });
  //   })
  Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((products) => {
      Product.countDocuments()
        .then((totalProductsCount) => {
          const pagesCount = Math.ceil(totalProductsCount / ITEMS_PER_PAGE);
          return {
            totalPages: pagesCount,
            currPage: page,
            hasPrev: page > 1,
            hasNext: page < pagesCount,
          };
        })
        .then((pagingData) => {
          res.render("shop/index", {
            prods: products,
            pageTitle: "All Products",
            path: "/shop",
            pagination: pagingData,
          });
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// exports.getIndex = (req, res, next) => {
//   Product.fetchAll()
//     .then(([rows, fieldData]) => {
//       res.render("shop/index", {
//         prods: rows,
//         pageTitle: "Shop",
//         path: "/",
//       });
//     })
//     .catch((err) => {
//       console.log(err.toString());
//     });
// };

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// req.user
//   .getCart()
//   .then((cart) => {
//     return cart
//       .getProducts()
//       .then((products) => {
//         res.render("shop/cart", {
//           path: "/cart",
//           pageTitle: "Your Cart",
//           products: products,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
//   .catch((err) => console.log(err));
//};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    // let fetchedCart;
    // let newQuantity = 1;
    // req.session.user
    //   .getCart()
    //   .then((cart) => {
    //     fetchedCart = cart;
    //     return cart.getProducts({ where: { id: prodId } });
    //   })
    //   .then((products) => {
    //     let product;
    //     if (products.length > 0) {
    //       product = products[0];
    //     }

    //     if (product) {
    //       const oldQuantity = product.cartItem.quantity;
    //       newQuantity = oldQuantity + 1;
    //       return product;
    //     }
    //     return Product.findByPk(prodId);
    //   })
    //   .then((product) => {
    //     return fetchedCart.addProduct(product, {
    //       through: { quantity: newQuantity },
    //     });
    //   })
    //   .then(() => {
    //     res.redirect("/cart");
    //   })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders()
//     .then((orders) => {
//       res.render("shop/orders", {
//         path: "/orders",
//         pageTitle: "Your Orders",
//         orders: orders,
//       });
//     })
//     .catch((err) => console.log(err));
// };

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };

// exports.getOrders = (req, res, next) => {
//   res.render("shop/orders", {
//     path: "/orders",
//     pageTitle: "Your orders",
//   });
// };

// exports.getInvoice = (req, res, next) => {
//   const orderId = req.params.orderId;
//   const invoiceName = "invoice-" + orderId + ".pdf";
//   const invoicePath = path.join("data", "invoice", invoiceName);
//   fs.readFile(invoicePath, (err, data) => {
//     if (err) {
//       return next(err);
//     }
//     res.send(data);
//   });
// };
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No Order Found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      const doc = new PDFDocument();
      res.setHeader("Content-type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"' //inline shown in broswer 'attachment' will download automatically when we click the invoicw
      );
      doc.pipe(fs.createWriteStream(invoicePath));
      doc.pipe(res);

      doc.fontSize(26).text("Invoice", {
        underline: true,
      });
      doc.text("----------------------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        doc
          .fontSize(14)
          .text(
            prod.product.title +
              "-" +
              prod.quantity +
              "X" +
              "$" +
              prod.product.price
          );
      });
      doc.fontSize(26).text("----------------------------------------");
      doc.fontSize(20).text("Total Price: $" + totalPrice);
      doc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     console.log("error reading file", err);
      //     return next(err);
      //   }
      //   res.setHeader("Content-type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceName + '"' //inline shown in broswer 'attachment' will download automatically when we click the invoicw
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'inline; filename="' + invoiceName + '"' //inline shown in broswer 'attachment' will download automatically when we click the invoicw
      // );
      // file.pipe(res);
    })
    .catch((err) => next(err));
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      products = user.cart.items;
      total = 0;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: "INR",
            quantity: p.quantity,
          };
        }),
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success",
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
        products: products,
        totalSum: total,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
