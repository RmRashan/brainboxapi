import {
  adminSignup,
  agentSignup,
  coordinatorSignup,
  lecturerSignup,
  managerSignup,
  studentSignup,
} from "../controllers/Auth/auth.registration.controller.js";
import {
  adminLogin,
  agentLogin,
  coordinatorLogin,
  lecturerLogin,
  managerLogin,
  studentLogin,
} from "../controllers/Auth/auth.login.controller.js";

import { Router } from "express";
import { studentValidateFormLogin, studentValidateFormRegistration } from "../middleware/Auth/student.validationSchema.js";
import { otherValidateFormLogin, otherValidateFormRegistration } from "../middleware/Auth/other.validationSchema.js";

const authRoute = Router();

authRoute.post("/registration/student", studentValidateFormRegistration, studentSignup);
authRoute.post("/registration/agent", otherValidateFormRegistration, agentSignup);
authRoute.post("/registration/lecturer", otherValidateFormRegistration, lecturerSignup);
authRoute.post("/registration/admin", otherValidateFormRegistration, adminSignup);
authRoute.post("/registration/manager", otherValidateFormRegistration, managerSignup);
authRoute.post("/registration/coordinator", otherValidateFormRegistration, coordinatorSignup);
// authRoute.post("/registration",signup )
authRoute.post("/login/student", studentValidateFormLogin, studentLogin);
authRoute.post("/login/agent", otherValidateFormLogin, agentLogin);
authRoute.post("/login/lecturer", otherValidateFormLogin, lecturerLogin);
authRoute.post("/login/admin", otherValidateFormLogin, adminLogin);
authRoute.post("/login/manager", otherValidateFormLogin, managerLogin);
authRoute.post("/login/coordinator", otherValidateFormLogin, coordinatorLogin);
// authRoute.post("/logout", logout )

export default authRoute;
