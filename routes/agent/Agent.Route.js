import { Router } from "express";

import {
  agentValidateFormLogin,
  agentValidateFormRegistration,
} from "../../middleware/validations/agent.validationSchema.js";

import {
  agentLogin,
  agentProfile,
  agentProfileEdit,
  agentSignup,
  agentGetAllCourses
} from "../../controllers/AgentController.js";
import AgentRouteProtect from "../../middleware/Auth/agent.Routeprotect.js";

const agentAuthRoute = Router();
const agentRoute = Router();

agentAuthRoute.post("/login", agentValidateFormLogin, agentLogin);
agentAuthRoute.post(
  "/registration",
  agentValidateFormRegistration,
  agentSignup
);

agentRoute.get("/profile", AgentRouteProtect, agentProfile);
agentRoute.post("/profile/edit", AgentRouteProtect, agentProfileEdit);

agentRoute.get("/allcourses", AgentRouteProtect, agentGetAllCourses);

export { agentAuthRoute, agentRoute };
