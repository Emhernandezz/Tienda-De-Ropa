const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://emilyhernandez1329:emily1329@cluster0.wgwweg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB Atlas");

    const db = client.db('FashionStyle');
    const usuarios = db.collection('Usuarios');

    const resultado = await usuarios.insertOne({
      nombre: "Prueba Atlas",
      correo: "atlas@mongo.com",
      telefono: "8888-0000",
      fecha_creacion: new Date()
    });

    console.log("Usuario insertado con ID:", resultado.insertedId);

  } catch (error) {
    console.error("Error al conectar o insertar:", error);
  } finally {
    await client.close();
  }
}

run();
