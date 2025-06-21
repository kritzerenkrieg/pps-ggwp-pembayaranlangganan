const express = require('express');
const cors = require('cors');
const path = require('path');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/v1/payment', paymentRoutes);
app.use('/v1/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
