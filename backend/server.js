const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/product-routes");
const shopProductsRouter = require("./routes/shop/product-routes");
const shopCartRouter = require("./routes/shop/cart-routes");

mongoose
  .connect(
    "mongodb://aymensileshi:S0uQf6bXX4W4w9uS@ac-wc93l39-shard-00-00.x4d2gly.mongodb.net:27017,ac-wc93l39-shard-00-01.x4d2gly.mongodb.net:27017,ac-wc93l39-shard-00-02.x4d2gly.mongodb.net:27017/?replicaSet=atlas-l7gtrv-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on port ${PORT}`)
);
