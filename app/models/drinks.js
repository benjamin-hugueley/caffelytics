module.exports = {

  get_drink: async ( database, parameters, options ) => {

    const result = await database.collection(
      'drinks'
    ).findOne( parameters );

    return result;

  },

  get_drinks: async ( database, parameters, options ) => {

    const result = await database.collection(
      'drinks'
    ).find().toArray();

    return result;

  }

}
