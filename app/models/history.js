module.exports = {

  add_history: async ( database, parameters, options ) => {

    await database.collection(
      'history'
    ).insertOne( parameters );

  },

  delete_history: async ( database, parameters, options ) => {

    await database.collection(
      'history'
    ).deleteOne( parameters );

  },

  get_history: async ( database, parameters, options ) => {

    const result = await database.collection(
      'history'
    ).find( parameters ).toArray();

    return result;

  }

}
