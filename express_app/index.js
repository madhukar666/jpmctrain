const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.json())
require('dotenv').config()
const PORT = process.env.PORT || 1000

//middlewares
const findObjectIndex = (req, res, next) => {
    const idx = parseInt(req.params.id)
    const objects = req.requestedObject
    // console.log(objects)
    const obj = objects.find(object => object.id === idx)
    // console.log(obj)
    if (obj) {
        req.objIdx = objects.indexOf(obj)
    }
    else
        res.status(404).json({ "message": "invalid id" })
    next()
}
const readJSON = (req, res, next) => {
    const urlComponents = req.url.split('/')
    const data = fs.readFileSync(__dirname + '/db.json', 'utf-8')
    req.allObjects = JSON.parse(data)
    req.requestedObject = JSON.parse(data)[urlComponents[1]]
    console.log(req.url.slice(1))
    next()
}
const writeJSON = (req, res, next) => {

    console.log(req.allObjects)
    fs.writeFileSync(__dirname + '/db.json', JSON.stringify(req.allObjects))
    next()
}
//get routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/users', readJSON, (req, res) => {

    res.append('content-type', 'application/json')
    res.json(req.requestedObject)
})

app.get('/admins', readJSON, (req, res) => {

    res.append('content-type', 'application/json')
    res.json(req.requestedObject)
})

app.get('/admins/:id', readJSON, findObjectIndex, (req, res) => {

    res.append('content-type', 'application/json')
    res.json(req.requestedObject[req.objIdx])

})
app.get('/users/:id', readJSON, findObjectIndex, (req, res) => {
    res.append('content-type', 'application/json')
    res.json(req.requestedObject[req.objIdx])
})

//post requests
app.post('/users', readJSON, (req, res, next) => {

    const { body, allObjects } = req
    allObjects[req.url.slice(1)].push({ id: allObjects[req.url.slice(1)].length + 1, ...body })
    console.log(allObjects[req.url.slice(1)])
    next()
}, writeJSON, (req, res) => {
    res.sendStatus(200)
})

app.post('/admins', readJSON, (req, res, next) => {

    const { body, allObjects } = req
    allObjects[req.url.slice(1)].push({ id: allObjects[req.url.slice(1)].length + 1, ...body })
    console.log(allObjects[req.url.slice(1)])
    next()
}, writeJSON, (req, res) => {
    res.sendStatus(200)
})
// put requests
app.put('/admins/:id', readJSON, findObjectIndex, (req, res, next) => {

    const { body, allObjects } = req
    const property = req.url.split('/')[1]
    allObjects[property][req.objIdx] = { id: allObjects[property][req.objIdx].id, ...body }
    next()
}, writeJSON, (req, res) => {
    res.sendStatus(200)
})

app.put('/users/:id', readJSON, findObjectIndex, (req, res, next) => {

    const { body, allObjects } = req
    const property = req.url.split('/')[1]
    allObjects[property][req.objIdx] = { id: allObjects[property][req.objIdx].id, ...body }
    next()
}, writeJSON, (req, res) => {
    res.sendStatus(200)
})

app.patch('/users/:id', readJSON, findObjectIndex, (req, res, next) => {

    const { body, allObjects } = req
    const property = req.url.split('/')[1]
    allObjects[property][req.objIdx] = { ...allObjects[property][req.objIdx], ...body }
    next()
}, writeJSON, (req, res) => {
    res.sendStatus(200)
})
app.patch('/admins/:id', readJSON, findObjectIndex, (req, res, next) => {

    const { body, allObjects } = req
    const property = req.url.split('/')[1]
    allObjects[property][req.objIdx] = { ...allObjects[property][req.objIdx], ...body }
    next()
}, writeJSON, (req, res) => {
    res.sendStatus(200)
})

//DELETE

app.delete('/users/:id', readJSON, findObjectIndex, (req, res, next) => {
    const { objIdx, allObjects } = req
    const property = req.url.split('/')[1]
    allObjects[property].splice(objIdx, 1)
    next()
}, writeJSON, (req, res) => { res.sendStatus(204) })
app.delete('/admins/:id', readJSON, findObjectIndex, (req, res, next) => {
    const { objIdx, allObjects } = req
    const property = req.url.split('/')[1]
    allObjects[property].splice(objIdx, 1)
    next()
}, writeJSON, (req, res) => res.sendStatus(204))


app.use((req, res) => {
    res.status(404).write("<h1>404: Not Found</h1>")
    res.end()
})
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))