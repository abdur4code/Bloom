import {Router} from "express";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authLoginController, authRegisterController } from "../controller/auth.controller.js";

const router = Router();

/**
 * @POST /api/auth/register
 */
router.post('/register', registerValidator, authRegisterController);

/**
 * @POST /api/auth/login
 */
router.post('/login', loginValidator, authLoginController);

export default router;