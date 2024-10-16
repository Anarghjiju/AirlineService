const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');


const app = express();
const PORT = 3003;

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/airline-service', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true });

const Airline = mongoose.model('Airline', {
  aId: Number,
  aName: String,
  aRating: Number
});

app.get('/airline',  async(req,res) => {
    try{
        const airline = await Airline.find();
        res.json(airline);
    }catch(error) {
        res.status(500).json({ error: 'Error fetching Airlines' });
    }
});

app.get('/airline/:aId', async (req, res) => {
    try {
      const airline = await Airline.findOne({ aId: req.params.aId });
      if (airline) {
        const flightDetails = await axios.get(`http://localhost:3002/flight/airline/${req.params.aId}`);
        res.json({airline , Flights :flightDetails.data});
      } else {
        res.status(404).json({ error: 'airline not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching airlines' });
    }
  });

  app.post('/airline', async (req, res) => {
    try {
      const airline = new Airline(req.body);
      await airline.save();
      res.status(201).json(airline);
    } catch (error) {
      res.status(500).json({ error: 'Error creating Airline' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Airline service running on port ${PORT}`);
  });