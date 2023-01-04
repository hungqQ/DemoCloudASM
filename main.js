var express = require('express')
const { insertProduct, SearchFunction, FindProduct, DeleteProduct, UpdateProduct, AllProducts,SortByPriceASC } = require('./function')
var app = express()
const { handlebars } = require('hbs')

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

handlebars.registerHelper('CheckPrice',function(number){
    if (number > 50000){
        return false
    }
    return true
})

app.post('/new',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const quality = req.body.txtQuality
    const dicount = req.body.txtDicount
    const description = req.body.txtDescription
    const picUrl = req.body.txtURL
    if(name.length==0){
        res.render("newProduct",{'errorName':'you did not enter name of product'})
        return
    }
    if(price < 1000){
        res.render("newProduct",{'errorPrice':'Low Price'})
        return
    }
    const newProduct = {
        name :name,
        price: Number.parseFloat(price),
        quality: quality,
        dicount: dicount,
        description: description,
        picture: picUrl
    }
    let id = await insertProduct(newProduct)
    console.log(id)
    res.redirect('/all')
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id
    let prod = await FindProduct(id)
    console.log(prod)
    res.render('edit',{'prod':prod})
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    await DeleteProduct(id)
    res.redirect('/all')
})

app.post('/update',async (req,res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const quality = req.body.txtQuality
    const dicount = req.body.txtDicount
    const description = req.body.txtDescription
    const picUrl = req.body.txtURL
    const product = {
        'name' :name,
        'price': Number.parseFloat(price),
        'quality': quality,
        'dicount': dicount,
        'description': description,
        'picture': picUrl
    }
    await UpdateProduct(id, product)
    res.redirect('/all')
})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})

app.get('/all', async (req,res)=>{
    let results = await AllProducts()
    console.log(results)
    res.render('AllProducts',{results:results})
})

app.get('/',async (req,res)=>{
    let results = await AllProducts()
    console.log(results)
    res.render('homepage',{results:results})
})

app.post('/search', async (req,res)=>{
    let name = req.body.txtSearch
    let results = await SearchFunction(name)
    console.log(results)
    res.render('AllProducts',{'results':results})
})

app.get('/SortByPrice', async (req,res)=>{
    let results = await SortByPriceASC()
    console.log(results)
    res.render('AllProducts',{'results':results})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running!")


