import { Router } from "express";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authLoginController, 
    authRegisterController, 
    authMeController, 
    authRefreshController, 
    authLogoutController } from "../controller/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

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
router.get('/me', authenticate, authMeController);

/**
 * @POST /api/auth/refresh-token
 */
router.post('/refresh-token', authRefreshController);

/**
 * @POST /api/auth/logout
 */
router.post('/logout', authLogoutController);

export default router;