module.exports = {

  //Auto validation based on a schema object
  auto_validator: (schema) => {

    return ( req, res, next ) => {

      try {

        const sources = ['headers','params','query','body','cookies'];

        for( let i = 0; i < sources.length; i++ ) {

          if( schema[ sources[i] ] !== undefined ) {

            const schema_params = Object.keys(
              schema[ sources[i] ]
            );

            for( let j = 0; j < schema_params.length; j++ ) {

              if( req[ sources[i] ][ schema_params[j] ] === undefined ) {

                throw schema_params[j] + ': is required';

              } else {

                validators[
                  schema[ sources[i] ][ schema_params[j] ][ "type" ]
                ](
                  schema_params[j],
                  req[ sources[i] ][ schema_params[j] ],
                  req.app.locals
                );

              }

            }

          }

        }

        next();

      } catch ( error ) {

        next( error );

      }

    }

  }

}

//Validator functions
const validators = {

  number: ( name, value, locals ) => {

    //Introspect value to get deep type
    const value_type = type(value, false);

    //Check value type against schema type
    const result = value_type === 'number';

    if( result !== true ) {

      throw name + ': is not a valid number.';

    }

  },

  string: ( name, value, locals ) => {

    //Introspect value to get deep type
    const value_type = type(value, false);

    //Check value type against schema type
    const result = value_type === 'string';

    if( result !== true ) {

      throw name + ': is not a valid string.';

    }

  },

  object: ( name, value, locals ) => {

    //Introspect value to get deep type
    const value_type = type(value, false);

    //Check value type against schema type
    const result = value_type === 'object';

    if( result !== true ) {

      throw name + ': is not a valid object.';

    }

  },

  array: ( name, value, locals ) => {

    //Introspect value to get deep type
    const value_type = type(value, false);

    //Check value type against schema type
    const result = value_type === 'array';

    if( result !== true ) {

      throw name + ': is not a valid array.';

    }

  },

  object_id: ( name, value, locals ) => {

    //Introspect value to get deep type
    const value_type = type( value, false );

    //Confirm that object_id is a string
    const is_string = value_type === 'string';

    if( is_string === true ) {

      const result = locals.ObjectID.isValid( value );

      if( result === false ) {

        throw name + ': is not a valid object_id.';

      } else {

        value = locals.ObjectID( value );

      }

    } else {

      throw name + ': is not a valid object_id.';

    }

  },

  email: ( name, value, locals ) => {

    //Introspect value to get deep type
    const value_type = type(value, false);

    //Confirm that email is a string
    const is_string = value_type === 'string';

    if( is_string === true ) {

      //Cofirm email has no obvious errors, but email still needs verification.
      const regex = new RegExp(
        /^[^@\s]{0,64}@[^@\s.]{0,63}(.[^@\s.]{0,63}){0,3}$/
      );

      const result = regex.test(value);

      if( result !== true ) {

        throw name + ': is not a valid email.';

      }

    } else {

      throw name + ': is not a valid email.';

    }

  },

  password: ( name, value, locals ) => {

    //Introspect value to get deep type
    const value_type = type(value, false);

    //Confirm that password is a string
    const is_string = value_type === 'string';

    if( is_string === true ) {

      //Confirm password only contains 12 to 64 ASCII characters.
      const regex = new RegExp(/^[ -~]{12,64}$/);
      const result = regex.test(value);

      if( result !== true ) {

        throw name + ': is not a valid password.';

      }

    } else {

      throw name + ': is not a valid password.';

    }

  },

  authorization_header: ( name, value, locals ) => {

    //Introspect value to get deep type
    const value_type = type(value, false);

    //Confirm that authorization header is a string
    const is_string = value_type === 'string';

    if( is_string === true ) {

      //Split Authorization header into authentication scheme and token
      const authorization_header = value.split( " " );

      //authorization_header array should have length == 2
      if( authorization_header.length === 2 ) {

        const authentication_scheme = authorization_header[0];

        /*******************************************************************
          Visit the URL for a list of possible authentication schemes:
          https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
        *******************************************************************/

        //Populate valid authentication schemes
        const valid_authentication_schemes = [ 'Bearer' ];

        //Confirm authorization token has valid prefix
        const valid_scheme = valid_authentication_schemes.includes(
          authentication_scheme
        );

        if( valid_scheme === true ) {

          //Extract token from string
          const token = authorization_header[1];

          //Confirm token is a 128 character hexadecimal string
          const regex = new RegExp(/^[0-9A-Fa-f]{128}$/);
          const result = regex.test(token);

          if( result !== true ) {

            throw name + ': is not a valid token.';

          }

        } else {

          throw name + ': is not a valid token.';

        }

      } else {

        throw name + ': is not a valid token.';

      }

    } else {

      throw name + ': is not a valid token.';

    }

  }

};


/*************************************************************************************
  typeof is very useful, but it's not as versatile as might be required. For example,
  typeof([]) , is 'object', as well as typeof(new Date()), typeof(/abc/), etc.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
*************************************************************************************/
function type(obj, showFullClass) {

  if (showFullClass && typeof obj === "object") {
    return Object.prototype.toString.call(obj);
  }

  if (obj == null) { return (obj + '').toLowerCase(); }
  var deepType = Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
  if (deepType === 'generatorfunction') { return 'function' }

  return deepType.match(
    /^(array|bigint|date|error|function|generator|regexp|symbol)$/
  ) ? deepType : (
    typeof obj === 'object' || typeof obj === 'function'
  ) ? 'object' : typeof obj;

}
