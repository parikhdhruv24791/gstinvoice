const controller = require('./controller');


module.exports = (app) => {
	app.get("/list", (req, res) => {
		console.log("List");
		controller.getInvoice(req, res);
	});
	app.post("/invoice", (req, res) => {
		console.log("Save ", req.body);
		controller.saveInvoice(req, res);
	});
	app.get("/invoice/:id", (req, res) => {
		console.log("Save ", req.body);
		controller.getInvoiceById(req, res);
	});
}