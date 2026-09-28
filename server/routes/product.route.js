import {Router} from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createProductController, 
    getAllProductsController, 
    getProductByIdController, 
    updateProductController, deleteProductController } from "../controller/product.controller.js";
import {validateCreateProduct, 
    validateProductIdParam, 
    validateRequest, 
    validateUpdateProduct} from "../validators/product.validator.js";
import uploadImage from "../middleware/upload.middleware.js";

const router = Router();

/**
 * @POST /api/products
 */
router.post('/', authenticate,
    uploadImage.single('image'), 
    validateCreateProduct, 
    validateRequest, 
    createProductController);

/**
 * @GET /api/products
 */
router.get('/', getAllProductsController);

/**
 * @GET /api/products/:id
 */
router.get('/:id', validateProductIdParam, validateRequest, getProductByIdController);

/**
 * @PUT /api/products/:id
 */
router.put('/:id', authenticate,
    uploadImage.single('image'), 
    validateProductIdParam,
    validateUpdateProduct,
    validateRequest, 
    updateProductController);

/**
 * @DELETE /api/products/:id
 */
router.delete('/:id', authenticate, 
    validateProductIdParam, 
    validateRequest,
    deleteProductController);

export default router;