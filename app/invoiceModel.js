const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const moment = require('moment');

const Item = {
  description    : String,
  cost    : Number,
  qty    : Number,
  hsncode    : String
};

const Customer = {
  name: String,
  web_link: String,
  address1: String,
  address2: String,
  postal: String,
  gstin: Number,
  ponumber: Number,
  whetherReverseTax: Boolean
}

const Tax = {
  sgst: Number,
  cgst: Number,
  igst: Number
}

const Company = {
  name: String,
  web_link: String,
  address1: String,
  address2: String,
  postal: String,
}

const InvoiceSchema = mongoose.Schema({
  company_info: Company,
  customer_info: Customer,
  invoice_number: {type: Number, index:{ unique: true}},
  tax: Tax,
  discount: Number,
  dispatch_date: Date,
  dispatch_mode: String,
  dispatch_time: String,
  vehicle_number: String,
  invoice_date: Date,
  items: [Item],
  subTotal: Number,
  totalAfterDiscount: Number,
  totalTax: Number,
  pf: Number,
  grandtotal: Number,
  createdAt:  {type:Date, default: Date.now()},
  updatedAt: {type:Date, default: Date.now()}
});

//Run this
//db.invoices.createIndex({invoice_number:1}, {unique:true})

InvoiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

InvoiceSchema.pre('validate', function(next) {
  this.dispatch_date = moment(req.body.dispatch_date, "DD/MM/YYYY").format('YYYY-MM-DDTHH:mm:ss');
  this.dispatch_time = moment(req.body.dispatch_time, "DD/MM/YYYY").format('YYYY-MM-DDTHH:mm:ss');
  this.invoice_date = moment(req.body.invoice_date, "DD/MM/YYYY").format('YYYY-MM-DDTHH:mm:ss');
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);;