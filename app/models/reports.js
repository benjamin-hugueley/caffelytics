module.exports = {

  add_report: async ( database, parameters, options ) => {

    await database.collection(
      'reports'
    ).insertOne( parameters );

  },

  get_report: async ( database, parameters, options ) => {

    const result = await database.collection(
      'reports'
    ).findOne( parameters );

    return result;

  },

  delete_report: async ( database, parameters, options ) => {

    await database.collection(
      'reports'
    ).deleteOne( parameters );

  },

  get_reports: async ( database, parameters, options ) => {

    const result = await database.collection(
      'reports'
    ).find( parameters ).toArray();

    return result;

  }

}
