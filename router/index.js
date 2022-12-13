const express = require('express');
const movieRouter = express.Router();
const userProcessor = require('../dataProcessor')
const movieProcessor = require('../movieProcessor')
const adminRouter = require('./adminRouter')

movieRouter.get('/member', userProcessor.validateSignIn);
movieRouter.get('/guest', movieProcessor.readFreeMovies)

movieRouter.use('/admin', userProcessor.validateAdmin, adminRouter)


module.exports = movieRouter