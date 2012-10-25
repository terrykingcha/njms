var http = require('http'),
    url = require('url'),
    util = require('util'),
    args = process.argv.slice(2), v,

    njsm = require('../index'),
    options = {
        port : 8888,
        base : '/'
    },
    baseReg
    ;


while(args.length) {
    v = args.shift();

    switch(v) {
        case '-p' :
        case '--port' :
            options.port = parseInt(args.shift());
            break;
        default :
            break;
    }
}


baseReg = new RegExp('^' + options.base.replace('/', '\\/'));

http.createServer(function(req, resp){
    var loc = url.parse(req.url, true)
        action = loc.pathname.replace(baseReg, '').replace(/\/$/, ''),
        params = loc.query;

    //util.debug('action=' + action + '; params=' + util.inspect(params));

    resp.writeHead(200, {'content-type':'text/javascript;charset=utf8'});
    resp.write(njsm(action, params));
    resp.end();
}).listen(options.port);

process.on('uncaughtException', function(err) {
    util.debug(err);
})

util.debug('server started at port ' + options.port);
