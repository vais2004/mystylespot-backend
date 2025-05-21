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

app.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("product");
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart items." });
  }
});

app.post("/cart/:productId", async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  try {
    // Check if item already exists in cart
    let cartItem = await Cart.findOne({ product: productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      res.status(200).json({ message: "Quantity updated", cartItem });
    } else {
      const newCartItem = new Cart({
        product: productId,
        quantity,
      });
      await newCartItem.save();
      res.status(201).json({ message: "Product added to cart", cartItem: newCartItem });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart." });
  }
});

//Update quantity of a specific cart item
app.put("/cart/:cartItemId", async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      cartItemId,
      { quantity },
      { new: true }
    ).populate("product");

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item." });
  }
});

// Remove an item from the cart
app.delete("/cart/:cartItemId", async (req, res) => {
  const { cartItemId } = req.params;

  try {
    await Cart.findByIdAndDelete(cartItemId);
    res.json({ message: "Item removed from cart." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cart item." });
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
