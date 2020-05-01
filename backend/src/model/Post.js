const mongoose = require('mongoose')
const aws = require('aws-sdk')
const s3 = new aws.S3()
//apagar arquivo dentro do pc
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String, //nome gerado
    url: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
//antes de salvar
PostSchema.pre('save', function(){
//vai preencher o campo url com a rota static caso não seja colocada no s3
    if(!this.url){
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }                   //dentro do arquivo .env
})

//quando o arquivo for deletado, vai no s3 e deleta tb
PostSchema.pre('remove', function(){
    if(process.env.STORAGE_TYPE === 's3'){
        return s3.deleteObject({
            Bucket: 'uploademanoelbernardo',
            Key: this.key
        }).promise()
    }
        else {
            //deletando dentro da maquina
            return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key ))
        }
    
})


module.exports = mongoose.model('Post', PostSchema)