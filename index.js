const Joi = require('joi');
const express = require('express');
const logger = require('./logger');
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

if (app.get('env') === 'development') {
  app.use(logger);
  console.log('This is development server')
}

const courses = [
  {
    id: 1,
    name: 'Javascript'
  },
  {
    id: 2,
    name: 'React JS'
  },
  {
    id: 3,
    name: 'Python'
  },
]

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/courses', (req, res) => {
  res.send(courses)
})

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const course = {
    id: courses.length + 1,
    // need to add express.json() middleware
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id))
  if (!course) {
    return res.status(404).send(`Course of the given id ${req.params.id} doesn't found`)
  }

  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  course.name = req.body.name;
  res.send(course);
})

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id))
  if (!course) {
    return res.status(404).send(`Course of the given id ${req.params.id} doesn't found`)
  }
  res.send(course)
});

app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.query);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id))
  if (!course) {
    return res.status(404).send(`Course of the given id ${req.params.id} doesn't found`)
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})


function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  }

  return Joi.validate(course, schema)
}