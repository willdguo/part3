const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const dbName = 'phonebook'

const url =
  `mongodb+srv://willdguo-fso:${password}@fullstackopen-part3.wv7msos.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3){
    const newName = process.argv[3]
    const newNum = process.argv[4]

    const newPerson = new Person({
        name: newName,
        number: newNum
    })

    newPerson.save().then(result => {
        console.log(`added ${newName} number ${newNum} to ${dbName}`)
        mongoose.connection.close()
    })

} else {

    console.log('phonebook: ')
    
    Person.find({}).then(result => {

        result.forEach(person => {
          console.log(person.name, person.number)
        })
    
        mongoose.connection.close()
    })

}

