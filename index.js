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
const Cart = require("./models/orderSchema.models.js");

// const {error} =require('console');
// const { read } = require('fs');
// const { json } = require('stream/consumers');

// const fs =require('fs')
// const jsonData =fs.readFileSync('outfits.json','utf-8')

// const outfitsData=JSON.parse(jsonData)
// function seedData(){
//     try{
//         for(const outfitData of outfitsData ){
//             const newOutfit= new Outfit({
//                 title:outfitData.title,
//                 imgUrl:outfitData.imgUrl,
//                 category:outfitData.category,
//                 price:outfitData.price,
//                 rating:outfitData.rating,
//                 description:outfitData.description,
//                 size:outfitData.size
//             })
//             newOutfit.save()
//             //console.log(newOutfit.title)
//         }
//     }catch(error){
//         console.log('Error seeding the data:',error)
// } }

// seedData()

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

//get cart items
// async function readCartItems() {
//     try{
//         const outfit = await Outfit.find()
//         return outfit
//     }catch(error){
//         throw error
//     }
// }

// app.get('/cart', async (req,res)=>{
//     try{
//         const outfit= await readCartItems(req.params.outfitId)

//         if(outfit){
//             res.json(outfit)
//         }else{
//             res.status(404).json({error:'cart items not found.'})
//         }

//     }catch(error){
//         res.status(500).json({error:'failed to fetch data'})
//     }
// })

//get cart item by id
// async function updateCartItems(detailId, dataToUpdate) {
//     try{
//         const updatedCart= await Outfit.findByIdAndUpdate(detailId,dataToUpdate,{new:true})
//         return updatedCart
//     }catch(error){
//         throw error
//     }
// }

// app.post('/cart/:outfitId', async(req,res)=>{
//     try{
//         const updatedCart= await updateCartItems(req.params.detailId, req.body)

//         if(updatedCart){
//             res.status(200).json({message:'cart items updated successfully.'})
//         }else{
//             res.status(404).json({error:'data not found'})
//         }
//     }catch(error){
//         res.status(500).json({error:'failed to update data.'})
//     }
// })

// GET all outfits (temporary cart)

app.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("product");
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart items." });
  }
});

app.post("/cart/:outfitId", async (req, res) => {
  try {
    const existing = await Cart.findOne({ product: req.params.outfitId });

    if (existing) {
      existing.quantity += 1;
      const updated = await existing.save();
      res.json(updated);
    } else {
      const newCartItem = new Cart({
        product: req.params.outfitId,
        quantity: req.body.quantity || 1,
      });
      const saved = await newCartItem.save();
      res.json(saved);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart." });
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

// const express = require('express');
// const app = express();
// const cors = require("cors");
// const {initializeDatabase}=require('./db/db.connect')

// const Outfit = require('./models/outfit.models')
// const Category = require('./models/category.models')

// const corsOptions = {
//     origin: "*",
//     credentials: true,
//     optionSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// initializeDatabase();

// async function readAllOutfits() {
//     try {
//         const outfit = await Outfit.find();
//         return outfit;
//     } catch (error) {
//         throw error;
//     }
// }

// app.get('/outfit', async (req, res) => {
//     try {
//         const outfits = await readAllOutfits();
//         if (outfits.length !== 0) {
//             res.json(outfits);
//         } else {
//             res.status(404).json({ error: 'outfit not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch data from outfits' });
//     }
// });

// // Get outfit by id
// async function readOutfitById(outfitId) {
//     try {
//         const outfit = await Outfit.findById(outfitId);
//         return outfit;
//     } catch (error) {
//         throw error;
//     }
// }

// app.get('/outfit/:outfitId', async (req, res) => {
//     try {
//         const outfit = await readOutfitById(req.params.outfitId);
//         if (outfit) {
//             res.json(outfit);
//         } else {
//             res.status(404).json({ error: 'outfit not found.' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'failed to fetch data' });
//     }
// });

// // Category Routes: Get outfit by category
// async function readByCategories(outfitCategory) {
//     try {
//         const categories = await Outfit.find({ category: outfitCategory });
//         return categories;
//     } catch (error) {
//         throw error;
//     }
// }

// app.get('/outfit/category/:outfitCategory', async (req, res) => {
//     try {
//         const outfits = await readByCategories(req.params.outfitCategory);
//         if (outfits.length > 0) {
//             res.json(outfits);
//         } else {
//             res.status(404).json({ error: 'outfit not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'failed to fetch data' });
//     }
// });

// // Get category by ID
// async function readOutfitCategoryById(outfitId) {
//     try {
//         const category = await Category.findById(outfitId);
//         return category;
//     } catch (error) {
//         throw error;
//     }
// }

// app.get('/outfit/category/:categoryId', async (req, res) => {
//     try {
//         const category = await readOutfitCategoryById(req.params.categoryId);
//         if (category) {
//             res.json({ data: { category } });
//         } else {
//             res.status(404).json({ error: 'Category not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch data.' });
//     }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on PORT ${PORT}`);
// });
