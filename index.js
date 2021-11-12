const express = require('express');
const { MongoClient } = require('mongodb');

require('dotenv').config();
// findone or delelte
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const app = express();
const port= process.env.PORT || 5000;

// middleWare---
app.use(cors());
app.use(express.json());

// -----database conect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e4xul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
async function run() {
  try {
    await client.connect();
    const database = client.db('CyclePoint');
    const servicesCollection = database.collection('products');
    const orderCollection = database.collection('order');
    const reviewCollection = database.collection('review');
    const userCollection = database.collection('users');
    // get all---------------
    app.get('/services', async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.send(result);
    });
    //  findone

    app.get('/order/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    // post cart data
    app.post('/order', async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    });

    // my order
    app.get('/myorder/:email', async (req, res) => {
      const email = req.params.email;
      const result = await orderCollection.find({ email: email }).toArray();
      res.send(result);
    });

    // detete data from myorder
    app.delete('/deleteOrder/:id', async (req, res) => {
      const query = req.params.id;
      const result = await orderCollection.deleteOne({ _id: ObjectId(query) });
      res.send(result);
    });
    // post review

    app.post('/addreview', async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.send(result);
    });

    // get review all
    app.get('/review', async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });
    //  addproduct
    app.post('/addproduct', async (req, res) => {
      const result = await servicesCollection.insertOne(req.body);
      res.send(result);
    });

    // deleteProduct
    app.delete('/deleteProduct/:id', async (req, res) => {
      const query = req.params.id;
      const result = await servicesCollection.deleteOne({
        _id: ObjectId(query),
      });
      res.send(result);
    });

    // savedUser ----

    app.post('/saveduser', async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.send(result);
    });
    // saveduser for google
    app.put('/saveduser', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // make admin
    app.put('/makeAdmin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //filter data by admin --
    app.get('/makeadmin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);

      let isAdmin = false;
      if (user?.role == 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // all order get
    app.get('/allorder', async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });

    // update status
    app.put('/allorder/:id', async (req, res) => {
      const id=req.params.id
      const filter={_id :ObjectId(id)}
      const updateDoc = { $set:{ status:'Shipped' } };
      const result = await orderCollection.updateOne(filter,updateDoc)
      res.send(result)
    });
// delete order by admin
 app.delete('/deleteProduct/:id', async (req, res) => {
   const query = req.params.id;
   const result = await orderCollection.deleteOne({
     _id: ObjectId(query),
   });
   res.send(result);
 });
    
  } finally { 
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('running assigmnet-12 server');
});

app.listen(port, () => {
  console.log('Runing assigmnet-12server on port', port);
});
