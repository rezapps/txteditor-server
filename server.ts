import express from 'express';
import dotenv from 'dotenv';

const Doc = require('./models/Docmnt')

import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

// import Doc from './models/Docmnt';
import docRoutes from './routes/route';

dotenv.config();

const app = express();
const MonUrl = process.env.MONGO_URI || ''
const httpServer = require('http').createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `${process.env.FRONT_URL}`,
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use('/api/docs', docRoutes);

mongoose.connect(MonUrl);

io.on("connection", socket => {
  socket.on('getDoc', async doc_id => {
    const currDoc = await findOrCreate(doc_id);
    socket.join(doc_id);

    socket.emit('load-doc', currDoc);

    socket.on('send-title', title => {
      console.log(title);
      socket.broadcast.to(doc_id).emit('receive-title', title);
    });

    socket.on('send-delta', delta => {
      console.log(delta);
      socket.broadcast.to(doc_id).emit('receive-delta', delta);
    });

    let x = 0;

    socket.on('save-document', async delta => {
      console.log('autosave is called', x+=1);
      await Doc.findByIdAndUpdate(doc_id, delta);
    });
  });

  console.log('connected!! ');

  socket.on("disconnect", (reason) => {
    console.log('disconnected ', socket.id, ' due to ', reason);
  });
});

async function findOrCreate(id: string) {
  if (id == null) return;

  const doc = await Doc.findById(id);
  console.log(doc);

  if (doc) return doc;




	if (doc) return doc;

	const newDoc = await Doc.create({ _id: id, title: 'untitled', text: '<p>type here...</p>' });
	console.log(newDoc);

	return newDoc;
}

httpServer.listen(3000, () => {
	console.log('Server is listening on port 3000');
});
