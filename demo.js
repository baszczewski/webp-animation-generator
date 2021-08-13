const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const open = require('open');

const app = express();
 
app.use(serveStatic('demo', {'index': ['index.html', 'index.htm']}));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.listen(3000);

open('http://localhost:3000/');