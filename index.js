dotenv.config();
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb' ;
import dotenv from 'dotenv';



const app = express();
const port = process.env.PORT || 3000;


//middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.jzd13.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const EquipmentDatabase = client.db("equipmentDB").collection("equipment");
    
    const UsersDatabase = client.db("equipmentDB").collection("users");
    
    app.post('/equipment', async(req,res) => {
      const newEquipment = req.body;
      const result = await EquipmentDatabase.insertOne(newEquipment);
      res.send(result);
    });

    app.get('/equipment', async(req,res) => {
      const cursor = EquipmentDatabase.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/equipment/:id", async(req,res) => {
      const id =req.params;
      const query= {_id : new ObjectId(id)}
      const result = await EquipmentDatabase.findOne(query) 
      res.send(result);
    });

    // app.get('/equipment/:email', async (req, res) => {
    //   const email  = req.params.email;  // Get email from query parameters
    //   let query = {userEmail : email };
    //   // if (userEmail) {
    //   //   query = { email: userEmail }; // Filter based on email
    //   // }
    //   const result = await EquipmentDatabase.find(query).toArray();
    //   res.send(result);
    // });


  

    // update my equipment list
    app.patch('/equipment/:id', async(req,res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const updateDetails = {
        $set: {
          itemName: req.body.itemName,
          description: req.body.description,
          categoryName: req.body.categoryName,
          price: req.body.price,
          image: req.body.image,
          customization: req.body.customization,
          stockStatus: req.body.stockStatus
        }
      }
      const result= await EquipmentDatabase.updateOne(filter,updateDetails)
      res.send(result)

    })
    // delete the equipment
    app.delete('/equipment/:id', async(req,res) => {
      const id = req.params.id;
      const query ={_id : new ObjectId(id)}
      const result = await EquipmentDatabase.deleteOne(query);
      res.send(result);
    })


    // User related 
    app.post('/users', async(req,res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await UsersDatabase.insertOne(newUser);
      res.send(result);
    });
    app.get("/users", async(req,res) => {
      const cursor = UsersDatabase.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.patch("/users", async(req,res) => {
      const email = req.body.email;
      const filter = {email};
      const updateDoc = {
        $set: {
          lastSignInTime : req.body?.lastSignInTime
        }
      }
      const result = await UsersDatabase.updateOne(filter,updateDoc);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req,res) => {
   res.send("Our MRS-Sport's Server is Running")
});

app.listen(port, (req,res) => {
  console.log("MRS-Server is running at :", port)
});
