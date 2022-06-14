module.exports = {
	"featuresPath": "./bdd/features",
	"stepsPath": "./dist/bdd/steps",
	// "db": {
	// 	// database configuration for DB bootstrap
	// 	"user": "",
	// 	"passwd": "",
	// 	"host": "",
	// 	"port": 0
	// },
	"envsPath": "",
	"contextsPath": "./dist/bdd/contexts",
	"threadsNumber": 1,
	"bootstrapPath": "./bdd/DBBootstrap.config.js",
	"reporters": [
		"default"
	],
	"webapp": {
		"host": "",
		"port": 0
	},
	"recordCases": false,
}