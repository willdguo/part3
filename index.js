const express = require('express')
const app = express()

app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method)
  console.log("Path:", request.path)
  console.log("Body:", request.body)
  console.log("---")
  next()
}

//app.use(requestLogger)

let morgan = require('morgan')
let temp = morgan((tokens, request, response) => {

  //console.log(tokens.method(request, response))

  if(tokens.method(request, response) === 'POST'){

    console.log(request.body)

    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, 'content-length'), '-',
      tokens['response-time'](request, response), 'ms',
      JSON.stringify(request.body),
      'this code is working lezgooo'
    ].join(' ')

  } else {

    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, 'content-length'), '-',
      tokens['response-time'](request, response), 'ms'
    ].join(' ')

  }



})

app.use(temp)

let notes = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }

]


app.get('/', (request, response) => {
  response.send('<h1> FullStackOpen Part 33333!! </h1>')
})

app.get('/info', (request, response) => {
  response.send(`<div> Phonebook has info for ${notes.length} people </div> <br /> <div> ${new Date()} </div>`)
})

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const note = notes.find(note => note.id === id)

  if(note){
    response.json(note)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  console.log("deleted this mf")

  response.status(204).end()
})


const isDuplicate = (name) => {
  const temp = notes.find(note => note.name === name)

  return temp
}

app.post('/api/persons', (request, response) => {
  const newId = Math.floor(Math.random() * 10e8)
  const body = request.body

  console.log("plz work")

  if(!body.name){
    response.status(400).json({
      error: "name missing"
    })

  } else if(!body.number){
    response.status(400).json({
      error: "name missing"
    })

  } else if(isDuplicate(body.name)){

    response.status(400).json({
      error: "duplicate name"
    })

  } else {

    const note = {
      name: body.name,
      number: body.number,
      id: newId
    }

    console.log(note)
    console.log(notes)
    console.log("still working?")
  
    notes = notes.concat(note)
  
    response.json(note)

  }

})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT} heyheyhey world`)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint. fix da url"})
}

app.use(unknownEndpoint)