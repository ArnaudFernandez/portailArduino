const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8081;
const server   = require('http').Server(app);
// pour les formulaires multiparts
var multer = require('multer');
var multerData = multer();

const mongoDBModule = require('./crud-mongo');

// Pour les formulaires standards
const bodyParser = require('body-parser');
// pour les formulaires multiparts
var multer = require('multer');
var multerData = multer();

// Cette ligne indique le répertoire qui contient
// les fichiers statiques: html, css, js, images etc.
app.use(express.static(__dirname));
// Paramètres standards du modyle bodyParser
// qui sert à récupérer des paramètres reçus
// par ex, par l'envoi d'un formulaire "standard"
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");

	next();
});

// Lance le serveur avec express
server.listen(port);
console.log("Serveur lancé sur le port : " + port);

//------------------
// ROUTES
//------------------
// Utile pour indiquer la home page, dans le cas
// ou il ne s'agit pas de public/index.html
app.get('/', function(req, res) {
	res.sendFile(__dirname + 'index.html');
});

app.get('/MyTableVue', function(req, res) {
	res.sendFile(__dirname + 'TableVue.html');
});

// Ici des routes en :
// http GET (pour récupérer des données)
// http POST : pour insérer des données
// http PUT pour modifier des données
// http DELETE pour supprimer des données

//----------------------------------------------
// Ces routes forment l'API de l'application !!
//----------------------------------------------

app.get('/api/connection', function(req, res) {
	mongoDBModule.connexionMongo(function(err, db) {
		let reponse;

		if(err) {
			console.log("erreur connexion");
			reponse = {
				msg: "erreur de connexion err=" + err
			}
		} else {
			reponse = {
				msg: "connexion établie" + db
			}
		}
		res.send(JSON.stringify(reponse));

	});
});

app.get('/api/countAllLines', function(req, res) {
	// Pour le moment on simule, mais après on devra
	// réellement se connecte à la base de données
	// et renvoyer une valeur pour dire si tout est ok
	let name = req.query.name || '';

	mongoDBModule.countAllLines(name, function(data) {
		var objdData = {
			msg:"Counted lines",
			data: data
		}
		res.send(JSON.stringify(objdData));
	});
});

app.get('/api/getLastUpdate', function(req, res) {

	let name = req.query.name || '';


	mongoDBModule.getLastUpdate(name, function(data) {

		let macAddressAlreadyIn = [];
		let arrayToBeTransformed = [];
		let arrayToBeSend = [];

		for(let i = 0; i < data.length; i++) {
			arrayToBeTransformed.push(data[i]);
		}



		for(let i = 0; i < arrayToBeTransformed.length; i++) {
			let isAlreadyIn = false;
			let infoFromOne = JSON.parse(JSON.stringify(arrayToBeTransformed[i]));

			// Checking if we didn't already added the device on the list
			for (let j = 0; j < macAddressAlreadyIn.length; j++) {
				if (infoFromOne.mac === macAddressAlreadyIn[j]) {
					isAlreadyIn = true;
				}
			}

			if (!isAlreadyIn) {

				let objdData = {
					"mac": infoFromOne.mac,
					"temperature": infoFromOne.temperature,
					"salle": infoFromOne.salle,
					"max": infoFromOne.max,
					"min": infoFromOne.min,
				};

			arrayToBeSend.push(objdData);
				macAddressAlreadyIn.push(infoFromOne.mac);
			}
		}
		res.send(arrayToBeSend);
	});
});

