const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const fileUpload = require('express-fileupload');

require('dotenv').config()

const bodyParser = require('body-parser')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lhe87.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload());

const port = 5000

// app.use(express.static)



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteerdb").collection("event");
  const registrationCollection = client.db("volunteerdb").collection("registration");
  console.log('data base');
  app.post('/addEvent', (req, res) => {
    const file = req.files.file;
    const fileName = file.name;
    file.mv("./public/" + fileName)
    const push = JSON.parse(req.body.data)
    console.log(req.files.file)
    // const event = req.body;
    eventCollection.insertOne(push)
    .then(result => {
      console.log(result);
      res.send(result)
    })
  })

  app.get('/event', (req, res) => {
    eventCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.post('/reg', (req, res) => {
    const reg = req.body;
    registrationCollection.insertOne(reg)
      .then(result => {
        res.send(result.insertedCount > 0)
        // console.log(result);
      })
  })

  app.get('/task', (req, res) => {
    // console.log(req.query.email);
    registrationCollection.find({ email: req.query.email })
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    registrationCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result)
      })
  })

  app.get('/adminTask', (req, res) => {
    // console.log(req.query.email);
    registrationCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })

});










app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log('port listening');
})