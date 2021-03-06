var util = require('util')
	register = require('./server/register'),
	publish = require('./server/publish'),
	recieve = require('./server/recieve'),
	get = require('./server/get'),
	del = require('./server/del')
	;

function messageService(action, params) {
	var result
		;

	switch(action) {
		case 'register':
			result = register(params.pub || params.sub, params.host, !!params.pub);
			break;
		case 'publish' :
			result = publish(params.id, params.message, params.topic, params.host);
			break;
		case 'recieve' :
			result = recieve(params.id, params.host);
			break;
		case 'get' : 
			result = get(params.type, params.id,  params.host);
			break;
		case 'del' : 
			result = del(params.type, params.id,  params.host);
			break;
		default :
			result = {code : 99};
			break;
	}

	return params.callback + '(' + util.inspect(result) + ')';
}

module.exports = messageService;