var message = require('./message')
	;

function get(type, id, host) {
	var code = 0,
		result
		;

	switch(type) {
		case 'pub':
		case 'publisher':
			var pub = message.getPublisher(id, host);
			if (pub) {
				result = {
					host : host,
					id : pub.id,
					name : pub.name
				}
			} else {
				code = -1;
			}
			break;

		case 'sub':
		case 'subscriber':
			var sub = message.getSubscriber(id, host);
			if (sub) {
				result = {
					host : host,
					id : sub.id,
					name : sub.name
				}
			} else {
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

module.exports = get;