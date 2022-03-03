//Import the express router
const express = require( 'express' );
const router = express.Router();

//Import validation utility
const { auto_validator } = require( '../utilities/validation' );

//Import controllers
const drinks_controller = require( '../controllers/drinks' );
const users_controller = require( '../controllers/users' );

//Gets all drinks
router.get(
  '/drinks',
  auto_validator({}),
  drinks_controller.get_drinks
);

//Gets one specific drink
router.get(
  '/drinks/:drink_id',
  auto_validator({
    params: { drink_id: { type: "object_id" } }
  }),
  drinks_controller.get_drink
);

/****************************************************************************
  The current sign in implementaiton should be a patch, but it will be a
  post after the addition of sessions and session logs.
****************************************************************************/

//Signs in a user
router.post(
  '/users/sign-in',
  auto_validator({
    body: { email: { type: "email" }, password: { type: "password" } }
  }),
  users_controller.sign_in_post
);

//Signs up a new user
router.post(
  '/users/sign-up',
  auto_validator({
    body: { email: { type: "email" }, password: { type: "password" } }
  }),
  users_controller.sign_up_post
);

//Exports the router
module.exports = router;
