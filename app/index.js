/**********************************************************
	Cluster module is used to fork child processes each
	running one copy of node and communicating with the
	parent/master via IPC.
**********************************************************/

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', () => {
		cluster.fork();
	});

} else {

	/**********************************************************
		Import after forking child processes to prevent the
		creation of an extra set of unused dependencies in the
		main process.
	**********************************************************/

	//Import and Configure MongoClient
  const { MongoClient, ObjectID } = require('mongodb');
  const uri = 'mongodb://20.47.77.102:27017';
  const client = new MongoClient(uri);

	//Import Express and Helmet
	const express = require( 'express' );
	const helmet = require( 'helmet' );
	const app = express();

	//Import authentication and validation utilities
	const { auto_validator } = require( './utilities/validation' );
	const { authenticate_user_request } = require( './utilities/authentication' );

	//Import public and private routes
	const public_routes = require( './routes/public' );
	const private_routes = require( './routes/private' );

	/**********************************************************
		The connection to MongoDB is established and persisted
		to reduce overhead on future requests because MongoDB
		will create a connection pool with a default of up to
		five concurrent connections and reuse these until the
		connection is terminated by an event or client.close().
	**********************************************************/

	//Establish connection to MongoDB
  client.connect( ( error ) => {

    if( error ) throw error;

		//Place the database instance in application scope
    app.locals.database = client.db( 'caffeine' );
		app.locals.ObjectID = ObjectID;

    app.use( helmet() );
    app.use( express.json() );

		//Public routes do not require authentication.
    app.use('/', public_routes);

		//Private routes require authentication.
		app.use('/', private_routes);

		//Global error handler
		app.use( (err, req, res, next) => {
			res.status(500).send({ success: false, error: err });
		});

    app.listen(3000);

  });

}
