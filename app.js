require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require("path");

// Routes
const authenticateRoute = require("./routes/authentication");
const userRoute = require("./routes/user");
const bookingRoute = require("./routes/booking");
const invoiceRoute = require("./routes/invoice");
const stripeRoutes = require("./routes/stripePayment");
const conversationRoutes = require("./routes/conversation");
const postRoutes = require("./routes/post")

// PORT
 const port = process.env.PORT || 3000;
 

//DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB CONNECTED");
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    })
  }).catch((error)=>{
    console.log(error)
  });



// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin : "https://twinklebee.onrender.com",
  credentials: true, // <= Accept credentials (cookies) sent by the client
}));
app.use("/image", cors(),express.static(path.join(__dirname, '/uploads/images')))
app.use("/posts", cors(),express.static(path.join(__dirname, '/uploads/posts')))

// Routes
app.use("/api", authenticateRoute);
app.use("/api", userRoute);
app.use("/api", bookingRoute);
app.use("/api", invoiceRoute);
app.use("/api", stripeRoutes);
app.use("/api", conversationRoutes);
app.use("/api", postRoutes);



app.get('/', (req, res) => {
  res.send('Helloo');
})
