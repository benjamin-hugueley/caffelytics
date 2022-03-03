const drinks_model = require( '../models/drinks' );

module.exports = {

  get_drinks: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const user_id = ObjectID( request.params.user_id );

      const parameters = null;

      const options = null;

      const drinks = await drinks_model.get_drinks(
        database,
        parameters,
        options
      );

      const results = { success: true, drinks: drinks };

      response.send( results );

    } catch( error ) {

      next( error );

    }

  },

  get_drink: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const user_id = ObjectID( request.params.user_id );

      const drink_id = ObjectID( request.params.drink_id );

      const parameters = { _id: drink_id };

      const options = null;

      const drink = await drinks_model.get_drink(
        database,
        parameters,
        options
      );

      const results = { success: true, drink: drink };

      response.send( results );

    } catch( error ) {

      next( error );

    }

  }

};
