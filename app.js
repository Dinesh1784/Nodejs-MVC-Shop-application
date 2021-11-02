const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const csrf = require("csurf");
const flash = require("connect-flash");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
//sequlize
// const sequlize = require("./util/database");
// const Product = require("./models/product");
const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
//main settings
const MONGODB_URL =
  "mongodb+srv://admin:dinesh1784@cluster0.x8lve.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const app = express();

const store = MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

//csrf protection
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: "images",

  filename: (req, file, cb) => {
    cb(null, Math.round(Math.random() * 1000000000) + "-" + file.originalname);
  },
});

const fileFilters = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//const mongoConnect = require("./util/database").mongoConnect;
//view engine
app.set("views", "views");
app.set("view engine", "ejs");
//routes
const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
//controller
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilters }).single("image")
);
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
//middleware

//routes
app.use("/admin", adminRoutes);
app.use(shopRoute);
app.use(authRoute);
// render 404 page
app.get("/500", errorController.get500);
app.use(errorController.get404);

//global error handler if we use next(error) then this middleware execute or throw new Error(err)
app.use((error, req, res, next) => {
  res.redirect("/500");
});

//mongoose
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Dinesh",
    //       email: "example@test.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });
    console.log("connected to mongoose");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err.message);
  });
// mongoConnect(() => {
//   app.listen(5000);
// });

// Product.belongsTo(User, {
//   constraints: true,
//   onDelete: "CASCADE",
// });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// sequlize
//   //.sync({ force: true })
//   .sync()
//   .then((res) => {
//     return User.findByPk(1);
//     //console.log("table created");
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({
//         name: "Dinesh",
//         email: "test@test.com",
//       });
//     }
//     return user;
//   })
//   .then((user) => {
//     return user.createCart();
//   })
//   .then((cart) => {
//     console.log(cart);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//app.listen(5000);
