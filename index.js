const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const userProcessor = require('./dataProcessor')

app.get('/', async (req, res) => {
    const allData = await userProcessor.readAll();
    res.json(allData)
})

app.post('/signup', userProcessor.validateSignUp, async (req, res) => {
    const data = await userProcessor.createNewRecord(req.body);
    res.json(data)
})

const movieRouter = require('./router/index')
app.use('/movies', movieRouter)


const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})