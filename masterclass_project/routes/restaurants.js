const express = require('express');
const restaurants = require('../models/restaurants');
const router = express.Router();

router.get('/restaurants/:restaurant_id', async (req, res) => {
  try {
    const restaurant = await restaurants.findById(req.params.restaurant_id);
    res.send(restaurant);
  } catch {
    res.status(404);
    res.send({ error: "Restaurant not found" });
  }
});

router.get('/restaurants', async (req, res) => {
  try {
    const long_coordinates = req.query.long_coordinates;
    const lat_coordinates = req.query.lat_coordinates;
    const max_distance = req.query.max_distance;
    const restaurant = await restaurants.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [long_coordinates, lat_coordinates]
          },
          $maxDistance: max_distance
        }
      }
    });
    res.send(restaurant);
    console.log('geoNear : ' + restaurant)
  } catch {
  res.status(404);
  res.send({ error: 'Restaurant not found' });
  }
});

router.get('/restaurants_price_average', async (req, res) => {
  try {
  const restaurant = await restaurants.aggregate([{
    $group: { _id: '', AveragePrice: { $avg: '$price' } }
  }]);
  res.send(restaurant);
  } catch {
    res.status(404);
    res.send({ error: 'Restaurant not found' });
  }
});

router.get('/restaurants//average_rating', async (req, res) => {
  try {
    const restaurant = await restaurants.aggregate([{
      $project: {
        averageRating: { $avg: '$reviews'},
      }
    }]);
    res.send(restaurant);
  } catch {
    res.status(404);
    res.send({ error: 'Restaurant not found' });
  }
});

router.post('/restaurants', async (req, res) => {
  try {
    const restaurant = new restaurants({
    name: req.body.name,
    location: {
      coordinates: [
        req.body.long_coordinates,
        req.body.lat_coordinates,
      ],
      type: 'Point'
    },
  });
  await restaurant.save();
  res.send(restaurant);
  } catch {
    res.status(404);
    res.send({ error: 'Restaurant not found' });
  }
});

router.patch('/restaurants/:restaurant_id', async (req, res) => {
  try {
    const restaurant = await restaurants.findOne({ _id: req.params.restaurant_id });

    restaurant.name = req.body.name,
        restaurant.location = {
          coordinates: [
            req.body.long_coordinates,
            req.body.lat_coordinates,
          ],
          type: 'Point'
        }
    await restaurant.save();
    res.send(restaurant);
  } catch {
    res.status(404);
    res.send({ error: 'Restaurant not found' });
  }
});

router.delete('/posts/:restaurant_id', async (req, res) => {
  try {
    await restaurants.deleteOne({ _id: req.params.restaurant_id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: 'Restaurant not found' });
  }
});

module.exports = router;
