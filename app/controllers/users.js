const {
  random_bytes,
  hash,
  password_based_key_derivation
} = require( '../utilities/cryptography' );
const users_model = require( '../models/users' );

module.exports = {

  sign_up_post: async ( request, response, error ) => {

    /************************************************************************
      Since this application will be publically available online and
      dietary information is protected by HIPAA and GDPR, no identifying
      information will be stored in a recoverable format. In other words,
      even the email will be hashed instead of stored in plain text.
    ************************************************************************/

    try {

      const database = request.app.locals.database;

      const email = hash( request.body.email );

      const password = request.body.password;

      const salt = random_bytes(64);

      const key = password_based_key_derivation( password, salt );

      const token = random_bytes(64);

      const parameters = {
        email: email,
        password: key,
        salt: salt,
        token: token,
        verification: true
      };

      await users_model.add_user( database, parameters );

      const user = await users_model.get_user(
        database,
        parameters
      );

      const result = {
        success: true,
        token: token,
        user_id: user._id
      };

      response.send( result );

    } catch ( error ) {

      next( error );

    }

  },

  sign_in_post: async (request, response, next) => {

    try {

      const database = request.app.locals.database;

      const email = hash(request.body.email);

      const parameters = { email: email };

      const user = await users_model.get_user( database, parameters );

      if( user !== null ) {

        const password = request.body.password;

        const salt = user.salt;

        const key = password_based_key_derivation( password, salt );

        if( key === user.password ) {

          const token = random_bytes(64);

          const update_token_parameters = { _id: user._id };

          const update_token_options = { $set: { token: token } };

          await users_model.update_token(
            database,
            update_token_parameters,
            update_token_options
          );

          const result = {
            success: true,
            token: token,
            user_id: user._id
          };

          response.send( result );

        } else {

          throw "incorrect password";

        }

      } else {

        throw "user does not exist";

      }

    } catch( error ) {

      next( error );

    }

  }

}
