import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://sriharshan136:watermelon@cluster1.meeij.mongodb.net/?appName=Cluster1";

// mongodb+srv://sriharshan136:<watermelon>@cluster1.meeij.mongodb.net/?appName=Cluster1

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
