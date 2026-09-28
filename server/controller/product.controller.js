import ProductModel from '../models/product.model.js';


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
/**
 * @POST /api/products
 */
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, currency, stock } = req.body;
        const imageInfo = { url: null, fileId: null };

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `product_${Date.now()}_${req.file.originalname}`,
                folder: '/bloom_products'
            });

            if (uploadResponse) {
                imageInfo.url = uploadResponse.url;
                imageInfo.fileId = uploadResponse.fileId;
            }

        }
        const product = await ProductModel.create({
            name,
            description,
            price,
            currency: currency || 'INR',
            stock,
            image: imageInfo,
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

/**
 * @GET /api/products/:id
 */
export const getProductByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            data: product
        });
    }
    catch (error) {
        console.log("get product by id controller error:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

/**
 * @PUT /api/products/:id
 */
export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProduct = await ProductModel.findById(id);

        if (!existingProduct) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        let updatedData = { ...req.body };

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `product_${Date.now()}_${req.file.originalname}`,
                folder: '/bloom_products'
            });

            if (uploadResponse) {
                updatedData.image = {
                    url: uploadResponse.url,
                    fileId: uploadResponse.fileId
                };
            }

            if (existingProduct.image && existingProduct.image.fileId) {
                try {
                    await imagekit.deleteFile(existingProduct.image.fileId);
                }
                catch (deleteError) {
                    console.error("Error deleting old image from ImageKit:", deleteError);
                }
            }
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    }
    catch (error) {
        console.log("update product controller error:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

/**
 * @DELETE /api/products/:id
 */
export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProduct = await ProductModel.findById(id);

        if (!existingProduct) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        if (existingProduct.image && existingProduct.image.fileId) {
            try {
                await imagekit.deleteFile(existingProduct.image.fileId);
            }
            catch (deleteError) {
                console.error("Error deleting image from ImageKit:", deleteError);
            }
        }

        const product = await ProductModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Product deleted successfully",
            data: product
        });
    }
    catch (error) {
        console.log("delete product controller error:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}