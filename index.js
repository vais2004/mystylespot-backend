const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");

const Outfit = require("./models/outfit.models");
const Category = require("./models/category.models");
const Cart = require("./models/placeOrder.models.js");
const Order = require("./models/placeOrder.models.js");
app.use(express.json());

initializeDatabase();

//get all outfits from the database

async function readAllOutfits() {
  try {
    const outfit = await Outfit.find();
    return outfit;
  } catch (error) {
    throw error;
  }
}

app.get("/outfit", async (req, res) => {
  try {
    const outfits = await readAllOutfits();
    if (outfits.length !== 0) {
      res.json(outfits);
    } else {
      res.status(404).json({ error: "outfit not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from outfits" });
  }
});

//get outfit by id
async function readOutfitById(outfitId) {
  try {
    const outfit = await Outfit.findById(outfitId);
    return outfit;
  } catch (error) {
    throw error;
  }
}

app.get("/outfit/:outfitId", async (req, res) => {
  try {
    const outfit = await readOutfitById(req.params.outfitId);

    if (outfit) {
      res.json(outfit);
    } else {
      res.status(404).json({ error: "outfit not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

// Get all items in the cart
app.get("/cart", async (req, res) => {
  try {
    // Find all cart items and also get details of the product (outfit)
    const cartItems = await Cart.find().populate("product");
    res.json(cartItems); // Send the cart items back as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart items." });
  }
});

// Add an outfit to the cart or increase quantity if it's already there
app.post("/cart/:outfitId", async (req, res) => {
  try {
    // Check if the outfit is already in the cart
    const existingItem = await Cart.findOne({ product: req.params.outfitId });

    if (existingItem) {
      // If it exists, increase the quantity by 1
      existingItem.quantity += 1;
      const updatedItem = await existingItem.save();
      res.json(updatedItem); // Send back updated cart item
    } else {
      // If it does not exist, create a new cart item with quantity 1 or from request body
      const newCartItem = new Cart({
        product: req.params.outfitId,
        quantity: req.body.quantity || 1,
      });
      const savedItem = await newCartItem.save();
      res.json(savedItem); // Send back the new cart item
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart." });
  }
});

//Category Routes
//get all categories

async function readByCategories(outfitCategory) {
  try {
    const categories = await Outfit.find({ category: outfitCategory });
    return categories;
  } catch (error) {
    throw error;
  }
}

app.get("/outfit/category/:outfitCategory", async (req, res) => {
  try {
    const outfits = await readByCategories(req.params.outfitCategory);

    if (outfits.length > 0) {
      res.json(outfits);
    } else {
      res.status(404).json({ error: "outfit not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
});

// get category by id
async function readOutfitCategoryById(outfitId) {
  try {
    const outfit = await Category.findById(outfitId);
    return outfit;
  } catch (error) {
    throw error;
  }
}

app.get("/category/:outfitId", async (req, res) => {
  try {
    const category = await readOutfitCategoryById(req.params.outfitId);

    if (category) {
      res.json({
        data: {
          category: category,
        },
      });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

//Place Order Routes
//post handle for placing orders

app.post("/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
