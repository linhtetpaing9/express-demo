const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());


const genres = [
  {
    id: 1,
    name: 'Action'
  },
  {
    id: 2,
    name: 'Horror'
  },
  {
    id: 3,
    name: 'Drama'
  },
]

app.get('/', (req, res) => {
  res.send('Welcome from vidly...')
})

// Read
app.get('/api/genres', (req, res) => {
  res.send(genres)
})

// Read
app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(genre => genre.id == parseInt(req.params.id))
  if(!genre) return res.status(404).send("Given ID doesn't exist")
  res.send(genre)
})

// Create
app.post('/api/genres', (req, res) => {
  // validation

  const { error } = validateGenre(req.body) 
  if(error) return res.status(400).send(error.details[0].name)

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }

  genres.push(genre)
  res.send(genres)
})

// Delete
app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(genre => genre.id == parseInt(req.params.id))
  if (!genre) return res.status(404).send("Given ID doesn't exist")

  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].name)
  
  const index = genres.indexOf(genre)

  genres.splice(index, 1);
  res.send(genre);
})

// Update
app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(genre => genre.id == parseInt(req.params.id))
  if (!genre) return res.status(404).send("Given ID doesn't exist")

  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].name)
  
  genre.name = req.body.name

  res.send(genre);
})



function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  }

  return Joi.validate(genre, schema)
}


const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})