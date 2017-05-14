import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import InvertedIndex from '../src/inverted-index';


const app = express();

const index = new InvertedIndex();
const upload = multer({ dest: 'uploads/' });

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


app.post('/api/create', upload.array('books'), (req, res) => {
  const content = req.files;
  if (content === undefined) {
    res.send('Please pass in valid book filetype and key to create index');
  } else {
    content.forEach((file, fileIndex) => {
      const fileName = file.originalname;
      const path = file.path;
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          res.json(err.message);
        }
        const fileContent = JSON.parse(data);
        fs.unlink(path);
        try {
          const creates = index.createIndex(fileName, fileContent);
          if (fileIndex === content.length - 1) {
            res.json(creates);
          }
        } catch (err) {
          res.send('must create index');
        }
      });
    });
  }
});

app.post('/api/search', (req, res) => {
  const fileName = req.body.fileName;
  const terms = req.body.terms;
  if ((fileName === undefined && terms === undefined) ||
  (fileName === ('' || []) && terms === ('' || []))) {
    res.json('Please supply a fileName and search-term(s) or only search-term(s)');
  } else {
    const output = index.searchIndex(fileName, terms);
    res.json(output);
  }
});
const port = 1337;
const server = app.listen(process.env.PORT || port, () => (`LISTENING ON PORT ${port}...`));
export default server;
