import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Venue from "./models/venue.js";
import OpenAI from "openai";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

mongoose.connect(
    process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Conected to DB"))
    .catch((e) => console.log("Not Connected"));

app.get("/", (req,res)=> {
    res.send("Backend is running");
});


app.get("/api/cities", async (req, res) => {
    try{
        const cities = await Venue.distinct("city");
        res.json(cities);
    } catch(err){
        res.status(500).json({error: err.message
        })
    }
});

app.get("/api/categories", async (req, res) => {
    try{
        const cat = await Venue.distinct("category");
        res.json(cat);
    } catch(err){
        res.status(500).json({error: err.message
        })
    }
});

app.post("/api/search", async (req, res) => {
  try {
    const { city, category, minPrice, maxPrice, rating } = req.body;

    const query = {};

 
    if (city) query.city = city;

    
    if (category) query.category = category;

    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice); 
      if (maxPrice) query.price.$lte = Number(maxPrice); 
    }

   
    if (rating) query.rating = { $gte: Number(rating) }; 

    
    const results = await Venue.find(query);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/summarize", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes venue addresses into short, clear descriptions (max 45 words).",
        },
        { role: "user", content: `Summarize this venue address: ${address}` },
      ],
      max_tokens: 100,
    });

    res.json({ summary: response.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 9000
app.listen(PORT, () => console.log("Server running on ${PORT}"));