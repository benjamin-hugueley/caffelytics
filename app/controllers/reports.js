const reports_model = require( '../models/reports' );
const histoy_model = require( '../models/history' );
const favorites_model = require( '../models/favorites' );

module.exports = {

  add_report: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const user_id = ObjectID( request.params.user_id );

      const report_type = request.body.report_type;

      if( report_type === 'favorite_drinks' ) {

        //These parameters get the drinks consumed in the last 24 hours.
        const parameters = {
          _id: {
            $gt: ObjectID.createFromTime( Date.now() / 1000 - 24*60*60 )
          },
          user_id: user_id
        };

        const options = null;

        const drinks_last_24 = await histoy_model.get_history(
          database,
          parameters,
          options
        );

        let caffeine_last_24 = 0;

        for ( let i = 0; i < drinks_last_24.length; i++ ) {
          caffeine_last_24 += drinks_last_24[ i ].caffeine;
        }

        const maximum_caffeine = 500;

        const remaining_caffeine = maximum_caffeine - caffeine_last_24;

        const get_favorites_parameters = { user_id: user_id };

        const get_favorites_options = {
          sort: { caffeine: -1 }
        };

        const favorites = await favorites_model.get_favorites(
          database,
          get_favorites_parameters,
          get_favorites_options
        );

        const length = favorites.length;

        if( length > 0 ) {

          const caffeine_report = generate_favorite_drinks_report(
            remaining_caffeine,
            length,
            favorites
          );

          console.log(caffeine_report);

          const final_report = {
            labels: [],
            datasets: []
          };

          const backgroundColors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ];

          for( let i = 0; i < length; i++ ) {
            final_report.datasets.push({
              label: favorites[i].name,
              data: [],
              backgroundColor: backgroundColors[i]
            })
          }

          for( let i = 0; i < caffeine_report.length; i++ ) {
            final_report.labels.push('');
            for( let j = 0; j < length; j++ ) {
              final_report.datasets[j].data.push( caffeine_report[ i ][ j ] );
            }
          }

          const add_report_parameters = {
            user_id: user_id,
            type: report_type,
            report: final_report
          };

          const add_report_options = null;

          const add_report = await reports_model.add_report(
            database,
            add_report_parameters,
            add_report_options
          );

          const results = { success: true };

          response.send( results );

        } else {

          throw 'This report requires at least one favorite';

        }

      } else {

        throw 'Not a valid type of report';

      };

    } catch ( error ) {

      next( error );

    }

  },

  get_reports: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const user_id = ObjectID( request.params.user_id );

      const parameters = { user_id: user_id };

      const options = null;

      const reports = await reports_model.get_reports(
        database,
        parameters,
        options
      );

      const results = { success: true, reports: reports };

      response.send( results );

    } catch( error ) {

      next( error );

    }

  },

  get_report: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const report_id = ObjectID( request.params.report_id );

      const user_id = ObjectID( request.params.user_id );

      const parameters = { _id: report_id };

      const options = null;

      const report = await reports_model.get_report(
        database,
        parameters,
        options
      );

      const results = { success: true, report: report.report };

      response.send( results );

    } catch( error ) {

      next( error );

    }

  },

  delete_report: async ( request, response, next ) => {

    try {

      const database = request.app.locals.database;

      const ObjectID = request.app.locals.ObjectID;

      const report_id = ObjectID( request.params.report_id );

      const parameters = { _id: report_id };

      const options = null;

      await reports_model.delete_report(
        database,
        parameters,
        options
      );

      const results = { success: true };

      response.send( results );

    } catch ( error ) {

      next( error );

    }

  }

};

const generate_favorite_drinks_report = ( remaining_caffeine, length, favorites ) => {

  const initial_array = new Array(length);
  const caffeine_amounts = new Array(length);

  for ( let i = 0; i < length; i++ ) {
    initial_array[i] = 0;
    caffeine_amounts[i] = favorites[i].caffeine;
  }

  initial_array[0] = [[Math.floor( remaining_caffeine / favorites[0].caffeine )]];

  const caffeine_report = [];

  for ( let i = 0; i < length; i++ ) {

    let j = 0;

    while ( j < remaining_caffeine + 1 ) {

      initial_array[i]++;

      for ( let k = 0; k < length; k++ ) {

        j += initial_array[ k ] * caffeine_amounts[ k ];

      }

      if( j >= remaining_caffeine + 1 ) {

        initial_array[i]--;

      }

    }

  }

  console.log(remaining_caffeine);
  console.log(caffeine_amounts);
  console.log(initial_array);

  caffeine_report[ caffeine_report.length ] = initial_array.slice();

  for ( let i = 2; i <= length; i++ ) {

    while( initial_array[ length - i ] > 0 ) {

      initial_array[ length - i ]--;

      let j = 0;

      while( j < remaining_caffeine + 1 ) {

        initial_array[ length - i + 1 ]++;

        j = 0;

        for ( let k = 0; k < length; k++ ) {

          j += initial_array[ k ] * caffeine_amounts[ k ];

        }

        if( j >= remaining_caffeine + 1 ) {

          initial_array[ length - i + 1 ]--;

          if( i > 2 ) {

            i--;
            j = 0;

          } else {

            caffeine_report[
              caffeine_report.length
            ] = initial_array.slice();

            console.log(initial_array);

          }

        }

      }

    }

  }

  console.log(caffeine_report);

  return caffeine_report;

};
