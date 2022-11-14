const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send(`Ema John Server is Running`)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bmwcolr.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('emaJohn').collection('products');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            // console.log(page, size);
            const query = {}
            const cursor = productsCollection.find(query)
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productsCollection.countDocuments();//count total data
            res.send({ count, products });
        })

        //data pathate post er use
        app.post('/productsByIds', async (req, res) => {
            const ids = req.body
            // console.log(ids);
            const objectIds = ids.map(id => ObjectId(id)) //DB theke kisu nirdisti id k filter kore ana
            const query = { _id: { $in: objectIds } };//$in er use
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })
    }
    finally {

    }

}
run().catch(console.dir)



app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
})