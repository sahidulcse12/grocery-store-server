const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = 5000;


const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('hello world');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t8bkp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("groceryStore").collection("products");

    // add product
    app.post("/addProduct", (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //read single data
    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })


    //read data
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
});







app.listen(port, () => {
    console.log('port is running')
})