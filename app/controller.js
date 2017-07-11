const mongoose = require('mongoose');
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
    		let invoice = new Invoice(req.body)
        invoice.save((err) => {
        	if(err) console.log(err);
        	res.send({status : "success"});
        })
    },
    getInvoiceById: (req, res) => {
        Invoice.find({_id:req.params.id}, (err, data) => {
            console.log(data);
            res.send(data);
        })
    },
}

module.exports = Controller;
