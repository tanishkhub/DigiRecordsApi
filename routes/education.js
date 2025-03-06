const express = require('express');
const router = express.Router();
const Education = require('../models/education');

// GET all education options
router.get('/all', async (req, res) => {
  try {
    const educationOptions = await Education.find({});
    res.json(educationOptions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch education options' });
  }
});

// POST add a new education option
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const newEducation = new Education({ name });
    await newEducation.save();
    res.json(newEducation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add education option' });
  }
});

// DELETE an education option by id
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Education.findByIdAndDelete(id);
    res.json({ message: 'Education option deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete education option' });
  }
});

module.exports = router;
