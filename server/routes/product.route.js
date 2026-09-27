import {Router} from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createProductController, getAllProductsController } from "../controller/product.controller.js";
import {validateCreateProduct, validateRequest} from "../validators/product.validator.js";

const router = Router();

/**
 * @POST /api/products
 */
router.post('/', authenticate, 
    validateCreateProduct, 
    validateRequest, 
    createProductController);

/**
 * @GET /api/products
 */
router.get('/', getAllProductsController);

export default router;