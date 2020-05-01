//configurando o arquivo .env
require('dotenv').config()
const path = require('path')
const express = require('express')
const port = 3333
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
})



app.use(express.json())
app.use(express.urlencoded({ extended: true }))//facilita o envio de arquivos
app.use(require('./routes'))
app.use(morgan('dev'))//logs da requisições

//vai liberar o acesso apar acessar na rota da img
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))//toda vez que acessar um rota /files vai encontar o arquivo na rota informada

app.listen(port, ()=> {
    console.log('servidor rodando na porta ' + port)
})