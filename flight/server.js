const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = 3002;

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/airline-service', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true });

const Flight = mongoose.model('Flight', {
  fId: Number,
  fName: String,
  aId: Number,
  fdate: Number 
});

app.get('/flight',  async(req,res) => {
    try{
        const flight = await Flight.find();
        res.json(flight);
    }catch(error) {
        res.status(500).json({ error: 'Error fetching flights' });
    }
});



app.get('/flight/:fId', async (req, res) => {
  try {
    const flight = await Flight.findOne({ fId: req.params.fId });
    if (flight) {
      const passengerDetails = await axios.get(`http://localhost:3001/passenger/flight/${req.params.fId}`);
      
      res.json({ flight, passengers: passengerDetails.data });
    } else {
      res.status(404).json({ error: 'Flight not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flight details' });
  }
});


  app.get('/flight/airline/:aId', async (req, res) => {
    try {
      const flight = await Flight.find({ aId: req.params.aId });
      if (flight.length >0) {
        res.json(flight);
      } else {
        res.status(404).json({ error: 'airline not found ' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching flights of the airline' });
    }
  });
  
  app.post('/flight', async (req, res) => {
    try {
      const flight = new Flight(req.body);
      await flight.save();
      res.status(201).json(flight);
    } catch (error) {
      res.status(500).json({ error: 'Error creating flight' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Flight service running on port ${PORT}`);
  });