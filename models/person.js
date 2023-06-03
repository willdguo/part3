const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


const url = 
    //`mongodb+srv://willdguo-fso:ZerothApp1_@fullstackopen-part3.wv7msos.mongodb.net/phonebook?retryWrites=true&w=majority`
    process.env.MONGODB_URI
console.log(`connecting to ${url}`)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDb')
    }).catch((error) => {
        console.log(`error: ${error.message}`)
    })



const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)