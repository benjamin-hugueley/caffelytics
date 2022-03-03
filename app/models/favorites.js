module.exports = {

  add_favorite: async ( database, parameters, options ) => {

    await database.collection(
      'favorites'
    ).insertOne( parameters );

  },

  delete_favorite: async ( database, parameters, options ) => {

    await database.collection(
      'favorites'
    ).deleteOne( parameters );

  },

  get_favorites: async ( database, parameters, options ) => {

    const result = await database.collection(
      'favorites'
    ).find( parameters, options ).toArray();

    return result;

  }

}
