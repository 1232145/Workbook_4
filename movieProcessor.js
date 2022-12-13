const file = './data/movies.json';
const fs = require('fs');

//get
const readAll = async () => {
    try {
        const data = await fs.promises.readFile(file, 'utf8');
        return JSON.parse(data)
    } catch (err) {
        console.log(err);
        return [];
    }
}

const readFreeMovies = async (req, res) => {
    const allMovies = await readAll();
    const freeMovies = allMovies.filter(item => item.isFree === true);
    res.json(freeMovies)
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
    }
    const allData = await readAll();
    allData.push(dataConvert);
    await saveDataArray(allData);
    return dataConvert;
}

//post
const createMovie = async (req, res) => {
    const payload = req.body;
    await createNewRecord(payload);
    res.json({
        msg: "Created movie successfully!"
    })
}

//delete
const deleteMovie = async (req, res) => {
    const {id} = req.body;
    const allMovies = await readAll();
    const newAllMovies = allMovies.filter(item => item.id !== id);
    await saveDataArray(newAllMovies);
    res.json({msg: "Successfully delete movie!"})
}

//patch
const updateMovie = async (req, res) => {
    const newMovie = req.body;
    const allMovies = await readAll()
    const updatedMovies = allMovies.filter(item => item.id != newMovie.id);
    const newAllMovies = [...updatedMovies, newMovie]
    await saveDataArray(newAllMovies);
    res.json({msg: "Updated movie successfully!"})
}

module.exports = {readAll, readFreeMovies, createMovie, deleteMovie, updateMovie}