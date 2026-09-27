// middleware/productValidator.js
import { body, param, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateProductIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),
];

// Validate req.body for POST (Create)
export const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isString().withMessage('Name must be a string'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required')
    .isString(),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('currency')
    .optional() 
    .toUpperCase()
    .isIn(['INR', 'USD', 'EUR', 'GBP']).withMessage('Currency must be one of: INR, USD, EUR, GBP'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
];

// Validate req.body for PUT (Update)
export const validateUpdateProduct = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty if provided')
    .isString(),
  
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty if provided'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('currency')
    .optional()
    .toUpperCase()
    .isIn(['INR', 'USD', 'EUR', 'GBP']).withMessage('Currency must be one of: INR, USD, EUR, GBP'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
];