const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: "Products fetched",
            count: products.length,
            products: products,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({ error: "Product not found"});
        }

        res.status(200).json({
            message: "Product found",
            product: product, 
        });
    } catch (error) {
        res.status(500).json( { error: error.message});
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ error:"Please provide all fields"});
        }

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            category,
            createdBy: req.user.id,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product created",
            product: savedProduct,
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }

};

 const updateProduct = async (req, res) => {
    try {
        const {name, description, price, stock, category } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {name, description, price, stock, category },
            {new: true}
        );

        if(!updatedProduct) {
            return res.status(404).json({ error: "Product not found"});
        }

        res.status(200).json({
            message: "Product updated",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
 };

 const deleteProduct = async (req,res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if(!deletedProduct) {
            return res.status(404).json({ error: "Product not found"});
        }

        res.status(200).json({
            message: "Product deleted",
            product: deletedProduct,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
 };

 module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
 };