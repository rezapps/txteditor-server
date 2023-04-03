import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

const Doc = require('./models/Docmnt')
import docRoutes from './routes/docRoute'
import usrRoutes from './routes/usrRoutes'

dotenv.config()

const app = express()
const MonUrl = process.env.MONGO_URI || ''

mongoose.connect(MonUrl)


const httpServer = require('http').createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: `${process.env.FRONT_URL}`,
		methods: ["GET", "POST", "PATCH", "DELETE"]
	}
})


app.use(cors({
	origin: '*',
	credentials: true
}));


app.use('/api/docs', docRoutes)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// -------------------------- Auth  --------------------------

app.use('/user', usrRoutes)

app.use(cookieParser('some-secret'))




// -------------------------- Scoket  --------------------------
io.on("connection", socket => {
	socket.on('getDoc', async doc_id => {
		const currDoc = await findOrCreate(doc_id)
		socket.join(doc_id)

		socket.emit('load-doc', currDoc)

		socket.on('send-title', title => {
			console.log(title)
			socket.broadcast.to(doc_id).emit('receive-title', title)
		})

		socket.on('send-delta', delta => {
			console.log(delta)
			socket.broadcast.to(doc_id).emit('receive-delta', delta)
		})

		let x = 0

		socket.on('save-document', async delta => {
			console.log('autosave is called', x += 1)
			await Doc.findByIdAndUpdate(doc_id, { $set: delta }, { new: true })
		})
	})

	console.log('connected!! ')

	socket.on("disconnect", (reason) => {
		console.log('disconnected ', socket.id, ' due to ', reason)
	})
})

async function findOrCreate(id: string) {
	if (id == null) return

	let doc = await Doc.findById(id)
	console.log(doc)

	if (doc) return doc

	const newDoc = await Doc.create({ _id: id, title: 'untitled', text: '<p>type here...</p>', authors: [] })
	console.log(newDoc)

	return newDoc
}

httpServer.listen(3000, () => {
	console.log('Server is listening on port 3000')
})
