import { Router } from "express";
import { GetGenders } from "../controllers/Gender.Controller.js";

const GenderRoute = Router();



GenderRoute.get("/", GetGenders);



export default GenderRoute
