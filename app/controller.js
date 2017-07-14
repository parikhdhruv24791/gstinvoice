const mongoose = require('mongoose');
const moment = require('moment');
const config = require('./config');
const Invoice = require('./invoiceModel');

var promise = mongoose.connect(`${config.mongo}/${config.mongo_db}`, {
  useMongoClient: true,
   //other options 
});


promise.then(function(db) {
	 // we're connected!
    console.log("Connected to DB");
});


/*mongoose.connect(`${config.mongo}/${config.mongo_db}`).then(()=>{
	console.log("Connected to DB")
}, (err) => {
	console.log("error in connecting to DB")
});*/


var Controller = {
    getInvoice: (req, res) => {
        Invoice.find({}, (err, data) => {
        	console.log(data);
        	res.send(data);
        })
    },
    saveInvoice: (req, res) => {
        req.body.invoice_date = moment(req.body.invoice_date, "DD/MM/YYYY").format('YYYY-MM-DDTHH:mm:ss');
        let invoice = new Invoice(req.body)
        invoice.save((err) => {
        	if(err) return res.status(500).send(err);
        	res.send({status : "success"});
        })
    },
    getInvoiceById: (req, res) => {
        Invoice.find({invoice_number:req.params.id}, (err, data) => {
            console.log(data);
            res.send(data);
        })
    },
    saveInvoiceById: (req, res) => {
        console.log("req.params.id= ",req.params.id)
        var updateQuery = {$set: req.body};
        Invoice.update({invoice_number:req.params.id}, updateQuery, {upsert:true}, (err, invoice) => {
            console.log(invoice);
            res.send(invoice);
        })
    },
    getInvoiceCount: (req, res) => {
        Invoice.count({}, (err, data) => {
            console.log(data);
            res.json({count:data});
        })
    },
}

module.exports = Controller;
