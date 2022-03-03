module.exports = {

  add_user: async ( database, parameters, options ) => {

    await database.collection(
      'users'
    ).insertOne( parameters );

  },

  get_user: async ( database, parameters, options ) => {

    const result = await database.collection(
      'users'
    ).findOne( parameters, options );

    return result;

  },

  update_token: async ( database, parameters, options ) => {

    await database.collection(
      'users'
    ).updateOne( parameters, options );

  }

}
