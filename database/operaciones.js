require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('FashionStyle');

    // ================= CREACIÓN DE COLECCIONES Y CRUD =================

    // Colección usuarios
    const usuarios = db.collection('usuarios');

    // Insertar un usuario
    await usuarios.insertOne({
      nombre: "Carlos Ramírez",
      correo: "carlos@gmail.com",
      telefono: "8888-8888",
      fecha_creacion: new Date("2025-06-01")
    });

    // Insertar varios usuarios
    await usuarios.insertMany([
      {
        nombre: "Andrea Gómez",
        correo: "andrea@gmail.com",
        telefono: "8777-1234",
        fecha_creacion: new Date("2025-06-02")
      },
      {
        nombre: "Juan Pérez",
        correo: "juanperez@gmail.com",
        telefono: "8999-9999",
        fecha_creacion: new Date("2025-06-03")
      }
    ]);

    // Actualizar correo de un usuario
    await usuarios.updateOne(
      { nombre: "Carlos Ramírez" },
      { $set: { correo: "nuevo_correo@gmail.com" } }
    );

    // Eliminar un usuario
    await usuarios.deleteOne({ nombre: "Juan Pérez" });

    // Colección marcas
    const marcas = db.collection('marcas');

    // Insertar marcas
    await marcas.insertOne({ nombre: "FashionStyle", pais: "Costa Rica" });
    await marcas.insertMany([
      { nombre: "UrbanWear", pais: "Estados Unidos" },
      { nombre: "Elegancia", pais: "Colombia" }
    ]);

    // Actualizar país de una marca
    await marcas.updateOne(
      { nombre: "UrbanWear" },
      { $set: { pais: "Canadá" } }
    );

    // Eliminar una marca
    await marcas.deleteOne({ nombre: "Elegancia" });

    // Colección prendas
    const prendas = db.collection('prendas');

    // Insertar prendas
    await prendas.insertOne({
      nombre: "Camisa Blanca",
      talla: "M",
      precio: 8000,
      stock: 20,
      marca: "FashionStyle"
    });
    await prendas.insertMany([
      {
        nombre: "Pantalón Negro",
        talla: "L",
        precio: 12000,
        stock: 15,
        marca: "UrbanWear"
      },
      {
        nombre: "Chaqueta Azul",
        talla: "S",
        precio: 15000,
        stock: 10,
        marca: "FashionStyle"
      }
    ]);

    // Actualizar stock de una prenda
    await prendas.updateOne(
      { nombre: "Camisa Blanca" },
      { $set: { stock: 18 } }
    );

    // Eliminar una prenda
    await prendas.deleteOne({ nombre: "Chaqueta Azul" });

    // Colección ventas
    const ventas = db.collection('ventas');

    // Insertar ventas
    await ventas.insertOne({
      prenda: "Camisa Blanca",
      fecha: new Date("2025-06-24"),
      cantidad: 2,
      total: 16000,
      usuario: "Carlos Ramírez"
    });
    await ventas.insertMany([
      {
        prenda: "Pantalón Negro",
        fecha: new Date("2025-06-24"),
        cantidad: 1,
        total: 12000,
        usuario: "Andrea Gómez"
      },
      {
        prenda: "Camisa Blanca",
        fecha: new Date("2025-06-25"),
        cantidad: 1,
        total: 8000,
        usuario: "Juan Pérez"
      }
    ]);

    // Actualizar total de una venta
    await ventas.updateOne(
      { prenda: "Pantalón Negro", cantidad: 1 },
      { $set: { total: 12500 } }
    );

    // Eliminar una venta
    await ventas.deleteOne({ prenda: "Camisa Blanca", cantidad: 1 });

    // ================= CONSULTAS CON COMENTARIOS =================

    // Consulta 1: Obtener la cantidad total vendida de prendas en una fecha específica
    const totalVendido = await ventas.aggregate([
      { $match: { fecha: new Date("2025-06-24") } },
      { $group: { _id: "$fecha", total_vendido: { $sum: "$cantidad" } } }
    ]).toArray();
    console.log("Total vendido el 2025-06-24:", totalVendido);

    // Consulta 2: Obtener la lista de todas las marcas que tienen al menos una venta
    const marcasVendidas = await ventas.aggregate([
      {
        $lookup: {
          from: "prendas",
          localField: "prenda",
          foreignField: "nombre",
          as: "info_prenda"
        }
      },
      { $unwind: "$info_prenda" },
      {
        $group: {
          _id: "$info_prenda.marca"
        }
      }
    ]).toArray();
    console.log("Marcas con ventas:", marcasVendidas);

    // Consulta 3: Obtener prendas vendidas y su cantidad restante en stock
    const prendasStock = await prendas.aggregate([
      {
        $lookup: {
          from: "ventas",
          localField: "nombre",
          foreignField: "prenda",
          as: "ventas_prenda"
        }
      },
      {
        $project: {
          nombre: 1,
          stock: 1,
          total_vendido: { $sum: "$ventas_prenda.cantidad" }
        }
      }
    ]).toArray();
    console.log("Prendas y stock:", prendasStock);

    // Consulta 4: Obtener el listado de las 5 marcas más vendidas y su cantidad de ventas
    const topMarcas = await ventas.aggregate([
      {
        $lookup: {
          from: "prendas",
          localField: "prenda",
          foreignField: "nombre",
          as: "info_prenda"
        }
      },
      { $unwind: "$info_prenda" },
      {
        $group: {
          _id: "$info_prenda.marca",
          total_ventas: { $sum: "$cantidad" }
        }
      },
      { $sort: { total_ventas: -1 } },
      { $limit: 5 }
    ]).toArray();
    console.log("Top 5 marcas más vendidas:", topMarcas);

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

run();
