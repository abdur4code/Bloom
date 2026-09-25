import {Router} from "express";
import { registerValidator } from "../validators/auth.validator.js";
import { authRegisterController } from "../controller/auth.controller.js";

const router = Router();

/**
 * @POST /api/auth/register
 */
router.post('/register', registerValidator, authRegisterController)

export default router;