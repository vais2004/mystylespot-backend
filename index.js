const express = require('express')
const app = express()


const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const {initializeDatabase}=require('./db/db.connect')

const Outfit = require('./models/outfit.models')
const Category = require('./models/category.models')
const {error} =require('console');
const { read } = require('fs');
const { json } = require('stream/consumers');




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
// }
// }

// seedData()





app.use(express.json())

initializeDatabase()

//get all outfits from the database

async function readAllOutfits() {
    try{
        const outfit = await Outfit.find()
        return outfit
    }catch(error){
        throw error
    }
}

app.get('/outfit', async(req,res)=>{
    try{
        const outfits = await readAllOutfits()
        if(outfits.length!==0){
            res.json(outfits)
        }else{
            res.status(404).json({error:'outfit not found'})
        }
    }catch(error){
        res.status(500).json({error:'Failed to fetch data from outfits'})
    }
})

//get outfit by id

async function readOutfitById(outfitId) {
    try{ 
        const outfit = await Outfit.findById(outfitId)
        return outfit
    }catch(error){
        throw error
    }
}

app.get('/outfit/:outfitId', async (req,res)=>{
    try{
        const outfit= await readOutfitById(req.params.outfitId)

        if(outfit){
            res.json(outfit)
        }else{
            res.status(404).json({error:'outfit not found.'})
        }

    }catch(error){
        res.status(500).json({error:'failed to fetch data'}) 
    }
})

//Category Routes
//get all categories


async function readByCategories(outfitCategory){
    try{
        const categories= await Outfit.find({category:outfitCategory})
        return categories
    }catch(error){
        throw error
    }
}

app.get('/outfit/category/:outfitCategory', async (req,res)=>{
    try{
        const outfits= await readByCategories(req.params.outfitCategory)

        if(outfits.length>0){ 
            res.json(outfits)   
        }else{
            res.status(404).json({error:'outfit not found'})
        }        
    }catch(error){
        res.status(500).json({error:'failed to fetch data'})
    }
})

// get category by id

// get category by id

async function readOutfitCategoryById(outfitId) {
    try{
        const outfit = await Category.findById(outfitId)
        return outfit
    }catch(error){
        throw error
    }
}

app.get('/outfit/category/:outfitId', async(req,res)=>{
    try{
        const category = await readOutfitCategoryById(req.params.outfitId)

        if (category) {
            res.json({
                data: {
                    category: category
                }
            });
        } else {
            res.status(404).json({ error: 'Category not found' });
        }

    }catch(error){
        res.status(500).json({error:'Failed to fetch data.'})
    }
})   

const PORT =3000
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`)
})
 