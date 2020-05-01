//configurações do multer
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const awsSdk = require('aws-sdk')
//conexão com o s3 
const multerS3 = require('multer-s3')


const storageTypes = {//duas opções para salvar o arquivo
    local: multer.diskStorage({ 
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            //mudando o nome do arquivo
            crypto.randomBytes(16, (err, hash)=> {
                if(err) cb(err)

                file.key = `${hash.toString('hex')} - ${file.originalname}`//nome do arquivo
                cb(null, file.key)
            })
        }, 
    }),
    s3: multerS3({
        s3: new awsSdk.S3(),//vai ler as variaveis no .env
        bucket: 'uploademanoelbernardo',
        contentType: multerS3.AUTO_CONTENT_TYPE,//vai abrir o arquivo em vez de baixar
        acl: 'public-read', //qualquer um pode ler o arquivp
        key: (req, file, cb) => { //nome da imagem
            crypto.randomBytes(16, (err, hash)=> {
                if(err) cb(err)

                const fileName = `${hash.toString('hex')} - ${file.originalname}`//nome do arquivo
                cb(null, fileName)
            })
        }
    })
}



module.exports = {     //pasta config
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),//pra onde os arquivos irão
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        //limites do arquivo
        fileSize: 2 * 1024 * 1024 //2MB
    },                    //função que será chamada assim que terminar a verificação
    fileFilter: (req, file, callback) => {
        //filtrar as extenções
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ]

        //verficar se o arquivo tem as extenções 
        if(allowedMimes.includes(file.mimetype)){
            callback(null, true)
        } else {
            callback(new Error('Invalid file type.'))
        }
    }
}