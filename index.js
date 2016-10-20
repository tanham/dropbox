#!/usr/bin/env babel-node

'use strict'

require('./helper')

let fs = require('fs')
let express = require('express')
//let PromiseRouter = require('express-promise-router')
let morgan = require('morgan')
let trycatch = require('trycatch')
let bodyParser = require('body-parser')
let nodeify = require('bluebird-nodeify')
let mime = require('mime-types')
let path = require('path')

async function main() {
    // Use 'await' in here
    console.log('main()...')
   
    let app = express()
    app.use(morgan('dev'))

    
    app.get('*', async (req, res, next) => {
		console.log(req.url)
		let filePath = path.join(process.cwd(), req.url)
		try {
			let stat = await fs.promise.stat(filePath)
		} catch(e) {
			return res.send(404, 'Invalid path')
		}

		if (stat instanceof Error) {
			console.log('file not existed yet')
		}
		
		console.log(stat);
		if (stat.isDirectory()) {
			let files = await fs.promise.readdir(filePath)
			return res.json(files)
		}
		let type = await mime.lookup(filePath)
		res.setHeader('Content-Type', type)
		
		res.setHeader('Content-Length', stat.size)
		fs.createReadStream(filePath).pipe(res)
    })
    
    app.head('*', (req, res) => { } )

    let port = 8000
    await app.listen(port)
    console.log(`LISTENING @ http://127.0.0.1:${port}`)

}

main()
