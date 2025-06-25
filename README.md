# Tienda de Ropa - Base de Datos

Este proyecto contiene la estructura de una base de datos para gestionar una tienda de ropa llamada FashionStyle. Incluye operaciones básicas de CRUD y consultas específicas en MongoDB.

## Integrantes
- Nombre: Emily Hernández

## Colecciones

###  Usuarios
```json
{
  "nombre": "Carlos Ramírez",
  "correo": "carlos@gmail.com",
  "telefono": "8888-8888"
}
{
    "nombre": "Ana Pérez",
    "correo": "ana@gmail.com",
    "telefono": "8999-1111"
  }
  
```

### Marcas
```json
{
  "nombre": "Nike",
  "pais_origen": "Estados Unidos"
}
```

### Prendas
```json
{
  "nombre": "Camiseta Deportiva",
  "marca_id": "ObjectId('664f2a1c8c4b6780f23d64b1')",
  "precio": 25000,
  "stock": 15
}
```

### Ventas
```json
{
 "usuario_id": "ObjectId('664f2a1c8c4b6780f23d64b5')",
  "prenda_id": "ObjectId('664f2a1c8c4b6780f23d64b3')",
  "fecha": "2025-06-23",
  "cantidad": 2
}
```
