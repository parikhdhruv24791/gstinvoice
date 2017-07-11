const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Item = {
  name    : String,
  value    : Number,
  quantity    : Number,
  discount     : Number,
  amount     : Number
};

const InvoiceSchema = mongoose.Schema({
  transaction: Number,
  items: [Item],
  total: Number,
  date: {type:Date, default: Date.now()},
  tax: Number,
  taxApplied: Number,
  createdAt:  {type:Date, default: Date.now()},
  updatedAt: {type:Date, default: Date.now()}
});

InvoiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);;