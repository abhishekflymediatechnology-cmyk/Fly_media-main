// require('dotenv').config(); // <-- add this FIRST
// let express = require('express');
// const router = require('./route/Router');
// const Connection = require('./connection/Connection')
// const cookieParser = require('cookie-parser');

// let app = express();

// // ✅ Load environment variables
// const PORT = process.env.PORT || 8000;

// // DB Connection
// Connection(process.env.MONGO_URL)
//   .then(() => console.log('✅ Database connection has been established'))
//   .catch((e) => console.log('❌ DB error:', e));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.static("./public"));

// // Routes
// app.use('/', router);

// // Server

// app.listen(PORT, () => console.log(`🚀 Server Started at Port ${PORT}`));




require('dotenv').config(); // MUST be first

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const router = require('./route/Router');
const Connection = require('./connection/Connection');

const app = express();

// ✅ Load environment variables
const PORT = process.env.PORT || 8000;

// ✅ Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://theenglishraj.com',
];

// ✅ CORS CONFIG (FIXED)
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('./public'));

// ✅ Routes
app.use('/', router);

// ✅ DB Connection
Connection(process.env.MONGO_URL)
  .then(() => console.log('✅ Database connection has been established'))
  .catch((e) => console.log('❌ DB error:', e));

// ✅ Server
app.listen(PORT, () =>
  console.log(`🚀 Server Started at Port ${PORT}`)
);
