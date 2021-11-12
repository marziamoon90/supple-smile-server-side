const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e6utb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('database is connected');
        const database = client.db('supple_smile');
        const lipsticksCollection = database.collection('lipsticks');
        const orderCollection = database.collection('orders');

        // get api for lipsticks 
        app.get('/lipsticks', async (req, res) => {
            const cursor = lipsticksCollection.find({})
            const lipstick = await cursor.toArray();
            // console.log(lipstick)
            res.send(lipstick)
        })
        // GET SINGLE DATA API 
        app.get('/lipsticks/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id, 'get id');
            const query = { _id: ObjectId(id) }
            const singleLipstick = await lipsticksCollection.findOne(query);
            res.json(singleLipstick);
        })

        // POST api for lipsticks order 
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.send(result)
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    // res.send('Hello from supple smile server site!')
    res.send('sunos ni naki boyra tui')
})

app.listen(port, () => {
    console.log(`Hello from supple smile server running ${port}`)
})