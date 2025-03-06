import express from "express";
import { searchUsers } from "../controllers/searchController";

const router = express.Router();

router.get("/users", searchUsers); 


export default router;
