const express = require('express');
const config = require('./app/config');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./app/routes')(app);



app.listen(config.port, () => {
	console.log(`Listening on ${config.port}`);
})