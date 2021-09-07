import React, { useState, useEffect } from 'react'
import personsService from './services/personsService'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Arto's Computer Science Academy</em>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  //
  const effectHook = () => {
    console.log('effect')
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
        console.log(persons)
    })
  }
  useEffect(effectHook, [])

  //
  const addPerson = () => {
    console.log("addPerson")

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.reduce((maxid,person) => Math.max(person.id,maxid),0)+1
    }

    console.log(personObject)
    personsService
      .create(personObject)
      .then(response => {
        setErrorMessage(
          `Added '${personObject.name}' id '${personObject.number}' to the PhoneBook`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        setPersons(persons.concat(personObject))
        console.log(persons)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage( `Erro respose by the Server ... missing data....`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // proper logic here
      })      
  
  }

   //
   const updateNumber = () => {
    console.log("updateNumber")

    var personObject = persons.find(person => person.name === newName)
    personObject.number = newNumber

    console.log(personObject)
    personsService
      .update(personObject.id,personObject)
      .then(response => {
        setErrorMessage(`Updated '${personObject.name}' id ' ${personObject.id}' in the the PhoneBook`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        // setPersons(persons.concat(personObject))
        console.log(persons)
        setNewName('')
        setNewNumber('')
      })
  }

  function deletePerson(id) {
    console.log("deletePerson", id)
    personsService
    .remove(id)
    .then(response => {
      console.log(response)
      setErrorMessage(`Id ' ${id}' deleted sucessfully from the PhoneBook`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      // remove deleted person from the local phonebook copy
      //setPersons(persons.reduce((list, person) => (person.id != id ? list.concat(person) : list),[]))
      setPersons(persons.filter(person => (person.id != id)))

      //setPersons(persons.reduce((list, person) => {
      //  console.log(id, person.id, person.id != id )
      //  return(person.id != id ? list.concat(person) : list)
      //},[]))
      console.log(persons)
      setNewName('')
      setNewNumber('')
    })
    .catch(error => {
      setErrorMessage( `Id '${id}' has been deleted from the PhoneBook by an other user. Please refresh data in your browser`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setPersons(persons.filter(person => (person.id != id)))
    })
  }


  // Event handlers

  const handleClickAdd = (event) => {
    event.preventDefault()
    console.log('handleClickAdd', event.target)
    if (persons.find(person => person.name === newName) === undefined) {
      addPerson()
    } else {
      if (window.confirm( `Name ' ${newName} ' already exists in the phonebook. Do you want to replace the old number with a new one ?`)) {
         updateNumber()
      }
    }

  } 

  const handleNameChange = (event) => {
    console.log("handleNameChange", event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log("handleNumberChange", event.target.value)
    setNewNumber(event.target.value)
  }

  // event handler for the select buttons. id is the unique indentifier for the selected person
  const handleDeleteClick = (event) => { 
    console.log("handleDeleteClick", event)
    if (window.confirm('Do you really want to delete customer id' + event.target.id + '?')) {
      deletePerson(event.target.id)
    }
  }

  //
  const ListNames = (param) => {
    console.log("ListNames", param)
    const persons = param.persons 

    function buildRow (person) {
      return(
       <p key={person.name}> {person.name} {person.number}
        <button id = {person.id} onClick = {handleDeleteClick} type="submit">Delete</button> </p>
        )
    }

    return (
      <div>
        {persons.map(person => buildRow(person))}
      </div>
   )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <form onSubmit = {handleClickAdd}> 
        <div>
          Name: 
          <input 
            value = {newName}  
            onChange = {handleNameChange}
          />
        </div>
          Number
          <input 
            value = {newNumber}  
            onChange = {handleNumberChange}
          />

        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
          <ListNames persons={persons} />
      </ul>
      <div>debug: {newName}</div>
      <Footer />
    </div>
  )

}

export default App