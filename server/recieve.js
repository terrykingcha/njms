var util = require('util'),
	msg = require('./message')
	;

function recieve(subid, hostname) {
	var topicname,
		messages = msg.getSubscriber(subid, hostname).messages,
		message, msgid, res
		;

	if (!(message = messages.shift())) {
		return false;
	}

	topicname = message.topic;
	msgid = message.id;

	if ((res = msg.consumeMessage(subid, msgid, topicname, hostname))) {
		util.debug('recieve a message "' + msgid + '" in ' + hostname + '/' + topicname + ' via "' + subid + '" ');
		return {
			code : 0,
			topic : topicname,
			id : msgid,
			message : res[0],
			pubid : res[1]
		}
	} else {
		return {
			code : -1
		}
	}
}

module.exports = recieve;