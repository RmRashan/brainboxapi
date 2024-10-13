const { login , signup , logout  } = require('../controllers/auth.controller');
const { validateFormLogin ,validateForm }  = require('../middleware/Auth/AuthendicationValidation')

const authRoute = require('express').Router();


authRoute.post("/registration", validateForm, signup )
// authRoute.post("/registration",signup )
authRoute.post("/login", validateFormLogin,login )
// authRoute.post("/logout", logout )

module.exports = authRoute;