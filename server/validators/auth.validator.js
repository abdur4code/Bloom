import { body, validationResult } from "express-validator";

export const registerValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is Required"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is Required")
        .isEmail().withMessage("Invalid Email Address")
        .toLowerCase(),
    body("password")
        .trim()
        .notEmpty().withMessage("Password is Required")
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)'),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage("Confirm Password is Required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid request",
                errors: errors.array()
            })
        }
        next()
    }
]

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .toLowerCase(),
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty){
            return res.status(400).json({
                message: "Invalid request",
                errors: errors.array()
            })
        }
        next()
    }
]