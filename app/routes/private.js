//Import the express router
const express = require( 'express' );
const router = express.Router();

//Import authenticaion and validation utilities
const { auto_validator } = require( '../utilities/validation' );
const { authenticate_user_request } = require( '../utilities/authentication' );

//Import controllers
const favorites_controller = require( '../controllers/favorites' );
const history_controller = require( '../controllers/history' );
const reports_controller = require( '../controllers/reports' );

//Gets a list of favorites
router.use(
  '/users/:user_id',
  auto_validator({
    headers: { authorization: { type: 'authorization_header' } },
    params: { user_id: { type: 'object_id' } }
  }),
  authenticate_user_request()
)

//Gets a list of favorites
router.get(
  '/users/:user_id/favorites',
  auto_validator({}),
  favorites_controller.get_favorites
);

//Adds a drink to favorites
router.post(
  '/users/:user_id/favorites',
  auto_validator( { body: { drink_id: { type: "object_id" } } } ),
  favorites_controller.add_favorite
);

//Deletes a drink from favorites
router.delete(
  '/users/:user_id/favorites/:favorite_id',
  auto_validator( { params: { favorite_id: { type: "object_id" } } } ),
  favorites_controller.delete_favorite
);

//Gets the history of consumed drinks
router.get(
  '/users/:user_id/history',
  auto_validator({}),
  history_controller.get_history
);

//Adds a drink to the history of consumed drinks
router.post(
  '/users/:user_id/history',
  auto_validator( { body: { drink_id: { type: "object_id" } } } ),
  history_controller.add_history
);

//Deletes a drink from the history of consumed drinks
router.delete(
  '/users/:user_id/history/:history_id',
  auto_validator( { params: { history_id: { type: "object_id" } } } ),
  history_controller.delete_history
);

//Gets the list of reports
router.get(
  '/users/:user_id/reports',
  auto_validator({}),
  reports_controller.get_reports
);

//Gets a report
router.get(
  '/users/:user_id/reports/:report_id',
  auto_validator( { params: { report_id: { type: "object_id" } } } ),
  reports_controller.get_report
);

//Gets a report
router.delete(
  '/users/:user_id/reports/:report_id',
  auto_validator( { params: { report_id: { type: "object_id" } } } ),
  reports_controller.delete_report
);

//Creates a specific type of report
router.post(
  '/users/:user_id/reports',
  auto_validator( { body: { report_type: { type: "string" } } } ),
  reports_controller.add_report
);

module.exports = router;
