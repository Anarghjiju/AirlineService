const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/airline-service', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true });

const Passenger = mongoose.model('Passenger', {
  pId: Number,
  pName: String,
  fId: Number,
  pAge: Number
});

app.get('/passenger',  async(req,res) => {
    try{
        const passenger = await Passenger.find();
        res.json(passenger);
    }catch(error) {
        res.status(500).json({ error: 'Error fetching passengers' });
    }
});

app.get('/passenger/:pId', async (req, res) => {
    try {
      const passenger = await Passenger.findOne({ pId: req.params.pId });
      if (passenger) {
        res.json(passenger);
      } else {
        res.status(404).json({ error: 'Passenger not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching passenger' });
    }
  });

  app.get('/passenger/flight/:fId', async (req, res) => {
    try {
      const passenger = await Passenger.find({ fId: req.params.fId });
      if (passenger.length >0) {
        res.json(passenger);
      } else {
        res.status(404).json({ error: 'Flight not found ' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching passengers of the flight' });
    }
  });
  
  app.post('/passenger', async (req, res) => {
    try {
      const passenger = new Passenger(req.body);
      await passenger.save();
      res.status(201).json(passenger);
    } catch (error) {
      res.status(500).json({ error: 'Error creating passenger' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Passenger service running on port ${PORT}`);
  });