const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

let corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

if(process.env.ENV === 'Test') {
  console.log('This is Test')
  const db = mongoose.connect('mongodb://localhost/servisAPI_Test')
}
else {
  console.log('This is for real')
  const db = mongoose.connect('mongodb://localhost/servisAPI_Prod');
}


const port = process.env.PORT || 3000;

const AutoPart = require('./models/autoPartModel').AutoPartModel;
const stockRouter = require('./routes/stockRouter')(AutoPart);
const Invoice = require('./models/InvoiceModel');
const invoiceRouter = require('./routes/invoiceRouter')(Invoice, AutoPart);


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use('/api/stock', stockRouter)
app.use('/api/invoice', invoiceRouter)

app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API!');
});

app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;
