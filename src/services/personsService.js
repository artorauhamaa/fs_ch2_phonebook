import axios from 'axios'
//const baseUrl = '/api/persons'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
  console.log(baseUrl)
  const request = axios.get(baseUrl)
  return request.then(response => response)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response)
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response)
}

export default { 
    getAll: getAll, 
    create: create, 
    update: update,
    remove: remove
}