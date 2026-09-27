import { Router } from "express";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authLoginController, 
    authRegisterController, 
    authMeController, 
    authRefreshController, 
    authLogoutController } from "../controller/auth.controller.js";

const router = Router();

/**
 * @POST /api/auth/register
 */
router.post('/register', registerValidator, authRegisterController);

/**
 * @POST /api/auth/login
 */
router.post('/login', loginValidator, authLoginController);

/**
 * @GET /api/auth/me
 */
router.get('/me', authMeController);

/**
 * @POST /api/auth/refresh
 */
router.post('/refresh', authRefreshController);

/**
 * @POST /api/auth/logout
 */
router.post('/logout', authLogoutController);

export default router;