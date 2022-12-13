const file = './data/users.json';
const fs = require('fs');
const jwt = require('jsonwebtoken');

const readAll = async () => {
    try {
        const data = await fs.promises.readFile(file, 'utf8');
        return JSON.parse(data)
    } catch (err) {
        console.log(err);
        return [];
    }
}

const saveDataArray = async (data) => {
    try {
        await fs.promises.writeFile(file, JSON.stringify(data));
        return 1;
    } catch (err) {
        throw err;
    }
}

const createNewRecord = async (data) => {
    const dataConvert = {
        ...data,
        isAdmin: false,
        apiKey: new Date().valueOf()
    }
    const allData = await readAll();
    allData.push(dataConvert);
    await saveDataArray(allData);
    return dataConvert;
}

////Testing
const createToken = (data) => {
    return jwt.sign({
        data: data,
    }, 'secret_key');
}

////Testing
const validateToken = (req, res, next) => {
    if (req.headers?.authorization) {
        const [_, token] = req.headers.authorization.split(' ');
        jwt.verify(
            token,
            'secret_key',
            (err, decoded) => {
                if (err) {
                    res.json({
                        msg: "Wrong token!"
                    })
                } else {
                    req.decoded = decoded.data;
                    next();
                }
            }
        )
    } else {
        res.status(401).json({
            err: "Authorization denied!",
        })
    }
} 

const createUser = async (req, res) => {
    const payload = req.body;
    const result = await createNewRecord(payload);
    res.json({
        data: result
    })
}

const validateSignUp = async (req, res, next) => {
    const allData = await readAll();
    const data = allData.find(item => item.username === req.body.username);
    if (data) {
        res.status(400).json({ error: "Account already existed!" })
    } else {
        // const token = createToken(req.body);
        // const body = req.body;
        // req.body = {...body, token};
        next();
    }
}

const movieProcessor = require('./movieProcessor');

const validateSignIn = async (req, res, next) => {
    const allData = await readAll();
    const { username, password } = req.query;
    const data = allData.find(item => item.username === username && item.password === password);
    if (data) {
        const movies = await movieProcessor.readAll();
        res.json(movies)
    } else {
        next();
    }
}

const validateAdmin = async (req, res, next) => {
    const allData = await readAll();
    const {username, password} = req.query;
    const data = allData.find(item => item.username === username && item.password === password);
    if (data?.isAdmin) {
        next();
    } else {
        res.status(400).json({msg: "You do not have permission!"})
    }
}

module.exports = {
    readAll, saveDataArray, createNewRecord, createUser, validateSignUp, validateSignIn, validateAdmin, validateToken
}