import { Router } from "express";
import { GetAllGrades } from "../controllers/Grade.Controller.js";

const GradeRoute = Router();



GradeRoute.get("/", GetAllGrades);



export default GradeRoute
