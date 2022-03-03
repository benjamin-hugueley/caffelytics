const users_model = require( '../models/users' );

module.exports = {

  authenticate_user_request: () => {

    return async ( request, response, next ) => {

      try {

        //Extract token from header
        const token = request.headers.authorization.split( " " )[1];

        const user_id = request.params.user_id;

        const database = request.app.locals.database;

        const ObjectID = request.app.locals.ObjectID;

        const parameters = { _id: ObjectID(user_id), token: token };

        const options = null;

        //Authenticate token
        const user = await users_model.get_user(
          database,
          parameters,
          options
        );

        const result = user !== null;

        if( result !== true ) {

          throw 'unauthorized: could not authenticate request.';

        }

        next();

      } catch ( error ) {

        next( error );

      }

    }

  }

}
