import { Router } from "express";

import { studentValidateFormLogin, studentValidateFormRegistration } from "../../middleware/validations/student.validationSchema.js";
import StudentRouteProtect from "../../middleware/Auth/student.Routeprotect.js";
import { studentLogin, studentProfile, studentProfileEdit, studentSignup } from "../../controllers/StudentController.js";


const studentAuthRoute = Router();
const studentRoute = Router();


studentAuthRoute.post("/login", studentValidateFormLogin, studentLogin);
studentAuthRoute.post("/registration", studentValidateFormRegistration, studentSignup);

studentRoute.get("/profile", StudentRouteProtect, studentProfile);
studentRoute.post("/profile/edit", StudentRouteProtect, studentProfileEdit);


export { studentAuthRoute, studentRoute };
