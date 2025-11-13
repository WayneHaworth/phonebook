import SearchFilter from './components/SearchFilter'
import NewPeopleForm from './components/NewPeopleForm'
import Notification from './components/Notification'
import PeopleList from './components/PeopleList'
import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchText, setSearchText] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(peopleList => {
        setPersons(peopleList)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person =>
      person.name === newName)

    if (existingPerson) {
      // if name and number the same exit out - duplicate
      if (newNumber === existingPerson.number) {
        alert(`${existingPerson.name} already exists`)
        return
      }
      // if number is different offer to update record
      if (confirm(`${existingPerson.name} is already added to phonebook, replace the old number is a new one?`)) {
        const changedPerson = {
          ...existingPerson,
          number: newNumber
        }
        personService
          .update(changedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p))
            setNewName('')
            setNewNumber('')
          })
          .catch( updatedPerson => {
            setErrorMessage(`${updatedPerson.name} has already been removed from server`, "success")
            setTimeout( () => {
              setErrorMessage(null)
            },5000)
          })
      }
      return
    }
    const newPersonObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPersonObject)
      .then(newPerson => {
        setPersons([...persons, newPerson])

        setSuccessMessage(`Added ${newPerson.name}`)
        setTimeout( () => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        alert(`Unable to create user: ${error}`)
      })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchText = (event) => setSearchText(event.target.value)
  const personsToShow = searchText
    ? persons.filter(person =>
      person.name.toLowerCase().includes(searchText.toLowerCase()))
    : persons

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => setPersons(persons.filter(p => p.id !== person.id)))
        .catch(error => {
          alert(error)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type="success"/>
      <Notification message={errorMessage} type="error" />
      <SearchFilter searchText={searchText} handleSearchText={handleSearchText} />
      <NewPeopleForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <PeopleList personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}


export default App
