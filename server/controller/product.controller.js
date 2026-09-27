import ProductModel from '../models/product.model.js';
/**
 * @POST /api/products
 */
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, currency, stock } = req.body;
        const product = await ProductModel.create({
            name,
            description,
            price,
            currency: currency || 'INR', 
            stock,
            createdBy: req.user._id, 
        });
        
        res.status(201).json({
            message: "Product created successfully",
            data: product
        });
    }
    catch (error) {
        console.log("create product controller error:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

/**
 * @GET /api/products
 */
export const getAllProductsController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await ProductModel.find()
            .skip(skip)
            .limit(limit);
        const total = await ProductModel.countDocuments();

        res.status(200).json({
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    totalProducts: total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                }
            }
        });
    }
    catch (error) {
        console.log("get all products controller error:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}