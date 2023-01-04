const { ObjectId } = require('bson')
var mongoClient = require('mongodb').MongoClient

var url = 'mongodb+srv://hungSaD123:yeugaum2@cluster0.6cudytj.mongodb.net/test'



async function ConnectDB() {
    let client = await mongoClient.connect(url)
    let dbo = client.db("ToyStore")
    return dbo
}

async function insertProduct(newProduct) {
    let db = await ConnectDB()
    let id = await db.collection("products").insertOne(newProduct)
    return id
}

async function SearchFunction(name) {
    let dbo = await ConnectDB()
    let results = await dbo.collection("products").find({ name: new RegExp(name) }).toArray()
    return results
}

async function FindProduct(id) {
    let dbo = await ConnectDB()
    let prod = await dbo.collection("products").findOne({ _id: ObjectId(id) })
    return prod
}

async function DeleteProduct(id) {
    let db = await ConnectDB()
    await db.collection("products").deleteOne({ _id: ObjectId(id) })
}


async function SortByPriceASC() {
    let dbo = await ConnectDB()
    var mysort = { price: 1 };
    let results = await dbo.collection("products").find().sort(mysort).toArray()
    return results
}

async function AllProducts() {
    let db = await ConnectDB()
    let results = await db.collection("products").find().toArray()
    return results
}

async function UpdateProduct(id, product) {
    let dbo = await ConnectDB()
    await dbo.collection("products").updateOne({ _id: ObjectId(id) }, { $set: product })
}
module.exports = {insertProduct, SearchFunction, FindProduct, DeleteProduct, UpdateProduct, AllProducts, SortByPriceASC}