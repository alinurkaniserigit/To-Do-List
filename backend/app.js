//express
require("dotenv").config();
const express = require("express");
const app = express();
const slowDown = require("express-slow-down");
const rateLimit = require("express-rate-limit");

//Graphql
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require("./schemas/schema");

//Database
const mongoose = require("mongoose");

//Security
const cors = require("cors");
const isAuth = require("./middlewares/is-auth");

const port = process.env.PORT;

app.use(cors({ origin: "*" }));

//30 saniyede 10 request geçilmesin, her 30 saniyede 1 kontrol et

const limiter = rateLimit({
  windowMs: 30 * 1000, //30 seconds
  max: 10, //limit each IP to make 10 request per windowMs
});

//if user does more than 3 requests in 3 seconds add a half second delay at each
const speedLimiter = slowDown({
  windowMs: 3 * 1000, //3 seconds
  delayAfter: 3, //allow 3 request per 3 seconds
  delayMs: 500, //add half second delay after each request limit
});

console.log(process.env.DB_CONNECTION)
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});


app.use(limiter); //use the limiter const to limit requests coming from IP
app.use(speedLimiter); //add delay if user passes requests per second

//app.use(isAuth);

//use graphql express
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

//connect mongodb
//mongoose.connect(process.env.DB_CONNECTION, {}, () => {
//    console.log("connected to db");
//})


app.listen(port, () => console.log(`listening port ${port}`));