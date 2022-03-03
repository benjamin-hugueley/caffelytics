const drinks_model = require( '../models/drinks' );
const favorites_model = require( '../models/favorites' );

module.exports = {

  add_favorite: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const user_id = ObjectID( request.params.user_id );

      const drink_id = ObjectID( request.body.drink_id );

      const parameters = { user_id: user_id };

      const options = null;

      const favorites = await favorites_model.get_favorites(
        database,
        parameters,
        options
      );

      if( favorites.length > 4 ) {

        const results = {
          success: false,
          error: "You cannot have more than 5 favorite beverages."
        };

        response.send( results );

      } else {

        const get_drink_parameters = { _id: drink_id };

        const get_drink_options = null;

        const drink = await drinks_model.get_drink(
          database,
          get_drink_parameters,
          get_drink_options
        );

        drink.user_id = user_id;
        drink.drink_id = drink_id;

        delete drink._id;

        const add_favorite_parameters = drink;

        const add_favorite_options = null;

        await favorites_model.add_favorite(
          database,
          add_favorite_parameters,
          add_favorite_options
        );

        const result = { success: true, drink: drink };

        response.send( result );

      }

    } catch ( error ) {

      next( error );

    }

  },

  delete_favorite: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const favorite_id = ObjectID( request.params.favorite_id );

      const parameters = { _id: favorite_id };

      const options = null;

      await favorites_model.delete_favorite(
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

  get_favorites: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const user_id = ObjectID( request.params.user_id );

      const parameters = { user_id: user_id };

      const options = null;

      const favorites = await favorites_model.get_favorites(
        database,
        parameters,
        options
      );

      const results = { success: true, favorites: favorites };

      response.send( results );

    } catch ( error ) {

      next( error );

    }

  }

}
