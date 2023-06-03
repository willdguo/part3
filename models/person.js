const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


const url = 
    process.env.MONGODB_URI
console.log(`connecting to ${url}`)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDb')
    }).catch((error) => {
        console.log(`error: ${error.message}`)
    })



const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        const arry = v.split('-')
        return (arry[0] > 1 && arry.length > 1)
      }
    }
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)