const express = require('express');
const adminRouter = express.Router();
const movieProcessor = require('../movieProcessor')

adminRouter.get('/', async (req, res) => {
    const allMovies = await movieProcessor.readAll();
    res.json(allMovies)
})

adminRouter.post('/', movieProcessor.createMovie)

adminRouter.delete('/', movieProcessor.deleteMovie)

adminRouter.patch('/', movieProcessor.updateMovie);

module.exports = adminRouter