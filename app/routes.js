const controller = require('./controller');


module.exports = (app) => {
	app.get("/count", (req, res) => {
		console.log("List");
		controller.getInvoiceCount(req, res);
	});
	app.get("/list", (req, res) => {
		console.log("List");
		controller.getInvoice(req, res);
	});
	app.post("/invoice", (req, res) => {
		console.log("Save ", req.body);
		controller.saveInvoice(req, res);
	});
	app.post("/invoice/:id", (req, res) => {
		console.log("Save By ID");
		controller.saveInvoiceById(req, res);
	});
	app.get("/invoice/:id", (req, res) => {
		console.log("Save ", req.body);
		controller.getInvoiceById(req, res);
	});
}