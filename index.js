require('dotenv').config()
const Person = require('./models/person')


const express = require('express')
const app = express()

app.use(express.static('build'))
app.use(express.json())

const cors = require('cors')
app.use(cors())


let morgan = require('morgan')
let temp = morgan((tokens, request, response) => {

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


app.get('/', (request, response) => {
  response.send('<h1> FullStackOpen Part 33333!! </h1>')
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<div> Phonebook has info for ${persons.length} people </div> <br /> <div> ${new Date()} </div>`)
  })
})

app.get('/api/persons', (request, response) => {

  Person.find({}).then(persons => {
    response.json(persons)
  })

})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    } else {
      console.log(`person with id ${id} not found`)
      response.status(404).end()
    }
  }).catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  // notes = notes.filter(note => note.id !== id)

  Person.findByIdAndRemove(id)
    .then(result => {
      console.log("deleted this mf")
      response.status(204).end()
    }).catch(error => next(error))

})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name){
    response.status(400).json({
      error: "name missing"
    })

  } else if(!body.number){
    response.status(400).json({
      error: "name missing"
    })

  } else {

    Person.find( {name: body.name} ).then(result => {
      
      if(Object.keys(result).length !== 0){
        const oldPerson = result[0]

        console.log(`Person exists: ${oldPerson}. Updating now:`)

        const newPerson = {
          name: body.name,
          number: body.number,
        }
        
        //console.log(`round 2 ${result[0].name}`)

        Person.findByIdAndUpdate(oldPerson._id, newPerson, {new: true})
          .then(updatedPerson => {

            //console.log(`round 3 ${result}`)


            response.json(updatedPerson)
            console.log("updated person")
            console.log(updatedPerson)

          }).catch(error => next(error))

      } else {
        console.log('No person! Adding now:')
        
        const newPerson = new Person({
          name: body.name,
          number: body.number,
        })
    
        newPerson.save().then(person => {
          response.json(person)
        })

      }

    }).catch(error => next(error))

  }

})

app.put('/api/persons/:id', (request, response, next) => {

  const body = request.body
  const newPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, newPerson, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))

})


app.use(temp)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on ${PORT} heyheyhey world`)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint. fix da url"})
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.log(error)

  if(error.name === 'CastError'){
    return response.status('400').send({error: 'malformatted id'})
  }

  next(error)

}

app.use(errorHandler)