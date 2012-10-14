var message = require('./message')
	;

function del(type, id, host) {
	var code = 0,
		result = {}
		;

	switch(type) {
		case 'pub':
		case 'publisher':
			if (!message.delPublisher(id, host)) {
				code = -1;
			}
			break;

		case 'sub':
		case 'subscriber':
			if (!message.delSubscriber(id, host)) {
				code = -1;
			}
			break;

		case 'host':
			if (!message.delHost(host)) {
				code = -1;
			}
			break;
		default :
			code = -1;
			break;
	}

	result.code = code;

	return result;
}

module.exports = del;