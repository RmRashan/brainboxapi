const { login , signup , logout  } = require('../controllers/auth.controller');
const validateForm = require('../middleware/Auth/AuthendicationValidation');


const authRoute = require('express').Router();


// authRoute.post("/registration", validateForm, signup )
authRoute.post("/registration",signup )
// authRoute.post("/login", login )
// authRoute.post("/logout", logout )

module.exports = authRoute;