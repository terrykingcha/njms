var message = require('./message')
	;

function register(name, hostname, ispub) {
	var code = 0,
		publisher,
		subscriber
		;

	message.addHost(hostname);

	if (ispub) {
		publisher = message.addPublisher(name, hostname);
		return {
			code : code,
			host : hostname,
			id : publisher.id,
			name : publisher.name,
		}
	} else {
		subscriber = message.addSubscriber(name, hostname);
		return {
			code : code,
			host : hostname,
			id : subscriber.id,
			name : subscriber.name
		}
	}
}

module.exports = register;