const drinks_model = require( '../models/drinks' );
const history_model = require( '../models/history' );

module.exports = {

  add_history: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const user_id = ObjectID( request.params.user_id );

      const drink_id = ObjectID( request.body.drink_id );

      const parameters = { _id: drink_id };

      const options = null;

      const drink = await drinks_model.get_drink(
        database,
        parameters,
        options
      );

      drink.user_id = user_id;
      drink.drink_id = drink_id;

      delete drink._id;

      const add_history_parameters = drink;

      const add_history_options = null;

      await history_model.add_history(
        database,
        add_history_parameters,
        add_history_options
      );

      const result = { success: true, drink: drink };

      response.send( result );

    } catch ( error ) {

      next( error );

    }

  },

  delete_history: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const history_id = ObjectID( request.params.history_id );

      const parameters = { _id: history_id };

      const options = null;

      await history_model.delete_history(
        database,
        parameters,
        options
      );

      const results = { success: true };

      response.send( results );

    } catch ( error ) {

      next( error );

    }

  },

  get_history: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const user_id = ObjectID( request.params.user_id );

      const parameters = { user_id: user_id };

      const options = null;

      const history = await history_model.get_history(
        database,
        parameters,
        options
      );

      const results = { success: true, history: history };

      response.send( results );

    } catch ( error ) {

      next( error );

    }

  }

}
