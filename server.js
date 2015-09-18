var server = require('http').createServer(),
  url = require('url'),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ server: server }),
  path = require('path'),
  express = require('express'),
  app = express();

app.set('views', path.join(__dirname, '/'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/')));

app.get('/', function(req, res) {
  res.render('index');
});

var clients = {};
var id = 0;

var sendAll = function(message) {
  for(var id in clients) { 
      clients[id].send(message); 
  }
};

wss.on('connection', function(ws) {
  console.log(ws.upgradeReq.connection.remoteAddress + ' connected...');
  ws.id = ++id;
  clients[ws.id] = ws;

  ws.on('message', function(message) {
    sendAll(message);
  });

  ws.on('close', function(){
    console.log(ws.id + ' disconnected...');
    delete clients[ws.id];
  });
});

server.on('request', app);

server.listen(3000, function(){
  console.log('Running on ' + server.address().port);
});