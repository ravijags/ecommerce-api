const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "items.product"
        );

        if(!cart) {
            return res.status(200).json({
                message: "Your cart is empty",
                items: [],
            });
        
        }

        res.status(200).json({
            message: "Cart fetched",
            cart: cart,
        });
    } catch (errro) {
        res.status(500).json({ error: error.message});
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } =req.body;

        if(!productId || !quantity) {
            return res.status(400).json({ error: "Please provide productId and quantity"});
        }

        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({ error: "Product not found"});
        }

        if(product.stock < quantity) {
            return res.status(400).json({ error: "Not enough stock available"});
        }

        let cart = await Cart.findOne({user: req.user.id});

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: [{ product: productId, quantity}],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if(itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
    
        }

        await cart.save();

        res.status(200).json({
            message: "Product added to cart",
            cart: cart,
        });
    } catch (error) {
        res.status(500).json( {error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id});

        if(!cart) {
            return res.status(404).json({ error: "Cart not found"});
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart",
            cart:cart,
        });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id});

        if(!cart) {
            return res.status(404).json({ error: "Cart not found"});
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Cart cleared"});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart};