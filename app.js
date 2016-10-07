var express = require('express');
var app = express();

app.use('/build/scripts/index.js', express.static (__dirname + '/build/scripts/index.js') );
app.use('/build/styles/style.css', express.static (__dirname + '/build/styles/style.css') );

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/build/views/index.html');
});

app.listen(3000, function () {
  // launch browser?
  console.log('listening on 3000...');
});