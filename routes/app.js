import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import InvertedIndex from '../src/inverted-index';


const app = express();

const index = new InvertedIndex();
const upload = multer({ dest: '../fixtures' });

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'PROD') {
  app.set('PORT', process.env.PORT_PROD);
} else if (NODE_ENV === 'DEV') {
  app.set('PORT', process.env.PORT_DEV);
} else {
  app.set('PORT', process.env.PORT_TEST);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/createIndex', upload.single('Books'), (req, res) => {
  res.send(index.createIndex(req.file, req.body));
  res.send(index.getIndex(req.body));
});

app.post('/api/searchIndex', (req, res) => {
  res.send(index.searchIndex(req.body[0], req.body[1]));
});

app.post('/isJson', (req, res) => {
  res.send(index.isJson(req.body));
});
const port = app.get('PORT');
const server = app.listen(process.env.PORT || port, () => console.log(`LISTENING ON PORT ${port}...`));
export default server;
