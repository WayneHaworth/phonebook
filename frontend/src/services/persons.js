import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then( response => response.data)
}

const create = (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    return request.then( response => response.data)
}

const remove = (id) => {
    console.log('id: ', id)
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then( response => response.data)
}

const update = (person) => {
    console.log("person inside update service", person)
    const request = axios.put(`${baseUrl}/${person.id}`, person)
    return request.then( response => response.data)
}

export default {
    getAll,
    create,
    remove,
    update
}