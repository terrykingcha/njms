var util = require('util'),
	msg = require('./message')
	;

function publish(pubid, msgtext, topicname, hostname) {
	var publisher = msg.getPublisher(pubid, hostname),
		subscribers = msg.getHost(hostname).subscribers,
		subscriber, subid,
		message, msgid
		;

	msg.addTopic(topicname, hostname);
	message = msg.addMessage(pubid, msgtext, topicname, hostname);
	msgid = message.id;

	for (subid in subscribers) {
		subscribers[subid].messages.push({
			topic : topicname,
			id : msgid
		});
		message.sub[subid] = 1;
	}

	if (msg.listenMessage(msgid, topicname, hostname)) {
		util.debug('publish a message "' + msgid + '" in ' + hostname + '/' + topicname + ' from "' + pubid + '" ');
		return {
			code : 0,
			id : msgid
		}
	} else {
		return {
			code : -1
		}
	}
}

module.exports = publish;