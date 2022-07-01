module.exports = {
	featuresPath: "./bdd/features",
	stepsPath: "./dist/bdd/steps",
	db: {
	  user: process.env.DB_USER,
	  passwd: process.env.DB_PASSWORD,
	  host: process.env.DB_HOST,
	  port: process.env.DB_PORT,
	  database: process.env.DB_BDD_PROJECTS,
	  },
	recordCases: false,
	envsPath: "",
	contextsPath: "./dist/bdd/contexts",
	threadsNumber: 1,
	bootstrapPath: "./bdd/DBBootstrap.config.js",
	reporters: [
		"default"
	]
  };
  