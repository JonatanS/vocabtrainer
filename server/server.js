var http = require('http');
var server = http.createServer();

server.on('request', require('./express-app'));

server.listen(3000, function () {
    console.log('Server is listening on port 3000!');
});