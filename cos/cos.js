const multer = require('@koa/multer')
const COS = require('cos-nodejs-sdk-v5');

var cos = new COS({
    SecretId: 'AKIDtb4GBpCI7fy0lFTQ6ax82f28xVUEjxvk',
    SecretKey: 'atvnQnumOlskOmvoSqzsWv4xc1A3g4C5',
    Protocol:'https:'
});

let Bucket = 'saoma-1304959650'
let Region = 'ap-nanjing'


let cosfun = function(filename,path){
	return new Promise((resolve,reject)=>{
		cos.uploadFile({
			Bucket,
			Region,
			Key: 'image/' + filename,              /* 必须 */
			FilePath: path,  
		})
		.then(res=>{
			resolve(res.Location)
		})
		.catch(err=>{
			reject(err)
		})
	})
}

// 二进制上传
let buffer = function(filename,path){
	return new Promise((resolve,reject)=>{
		cos.putObject({
			Bucket,
			Region,
			Key: 'image/' + filename,              /* 必须 */
			Body: Buffer.from(path),  
		})
		.then(res=>{
			resolve(res.Location)
		})
		.catch(err=>{
			reject(err)
		})
	})
}


const storage = multer.diskStorage({
	destination:(req, file, cb)=> {
	    cb(null, 'upload/image')
	},
	filename:(req, file, cb)=> {
	   // 防止文件重名更改前缀
	   let fileFormat = (file.originalname).split(".")
	   let num = `${Date.now()}-${Math.floor(Math.random(0,1) * 10000000)}${"."}${fileFormat[fileFormat.length - 1]}`
	   cb(null,num)
	 }
})

const upload = multer({storage})

module.exports = {upload,cosfun,buffer}