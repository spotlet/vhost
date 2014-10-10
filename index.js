
/**
 * Module dependencies
 */

var http = require('http')
  , proxy = require('http-proxy').createProxyServer({})
  , mongo = require('mongojs')

var PORT = process.env.PORT;
var server = http.createServer(onrequest);
var db = mongo('spotlets', ['spotlets']);

server.listen(PORT);

function onrequest (req, res) {
  var host = req.headers.host;
  var parts = host.split(':')[0];
  var subs = parts.split('.');
  var subdomain = subs[0];

  db.spotlets.findOne({name: subdomain}, function (err, result) {
    if (err || !result) {
      if (err) { console.error(err); }
      res.setHeader('Location', 'spotlet.io');
      res.statusCode = 301;
      res.end();
    } if (result) {
      proxy.web(req, res, { target: 'http://127.0.0.1:'+result.port });
    }
  });
}
