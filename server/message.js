var util = require('util'),
	listenInterval = 100
	;

function addHost(hostname) {
	var self = this,
		hosts = self.__hosts
		;

	if (!hosts.hasOwnProperty(hostname)) {
		hosts[hostname] = {
			topics : {},
			publishers : {},
			subscribers : {}
		};
		util.debug('add host "' + hostname + '"');

		return true;
	}
}

function getHost(hostname) {
	var self = this,
		hosts = self.__hosts
		;

	if (hosts.hasOwnProperty(hostname)) {
		util.debug('get host "' + hostname + '"');
		return hosts[hostname];
	} else {
		throw new Error('no host "' + hostname + '"');
	}
}

function addTopic(topicname, hostname) {
	var self = this,
		topics = self.getHost(hostname).topics,
		topic
		;

	if (!topics.hasOwnProperty(topicname)) {
		topic = topics[topicname] = {
			messages : {}
		}
		util.debug('add topic "' + topicname + '" for "' + hostname + '"');
	} else {
		topic = topics[topicname];
	}

	return topic;
}

function getTopic(topicname, hostname) {
	var self = this,
		topics = self.getHost(hostname).topics
		;

	if (!topics.hasOwnProperty(topicname)) {
		throw new Error('no publisher in "' + hostname + '"');
	} else {
		util.debug('get topic "' + topicname + '" for "' + hostname + '"');
		return topics[topicname];
	}
}

function addPublisher(pubname, hostname) {
	var self = this,
		pubno = self.__pubno,
		publishers = self.getHost(hostname).publishers, 
		publisher, pubid
		;

	pubid = 'pub-' + Date.now() + '-' + (pubno++);
	self.__pubno = pubno %= 1024;

	publisher = publishers[pubid] = {
		id : pubid,
		name : pubname
	}
	util.debug('add publisher "' + pubname + '" for "' + hostname + '"');

	return publisher;
}

function getPublisher(pubid, hostname) {
	var self = this,
		publishers = self.getHost(hostname).publishers
		;

	if (!publishers.hasOwnProperty(pubid)) {
		throw new Error('no publisher in "' + hostname + '"');
	} else {
		util.debug('get publisher "' + pubid + '" from "' + hostname + '"');
		return publishers[pubid];
	}
}

function addSubscriber(subname, hostname) {
	var self = this,
		subno = self.__subno,
		subscribers = self.getHost(hostname).subscribers, 
		subscriber, subid
		;

	subid = 'sub-' + Date.now() + '-' + (subno++);
	self.__subno = subno % 1024;

	subscriber = subscribers[subid] = {
		id : subid,
		name : subname,
		messages : []
	}
	util.debug('add subscriber "' + subname + '" for "' + hostname + '"');

	return subscriber;
}

function getSubscriber(subid, hostname) {
	var self = this,
		subscribers = self.getHost(hostname).subscribers, 
		subscribers
		;

	if (!subscribers.hasOwnProperty(subid)) {
		throw new Error('no subscriber in "' + hostname + '"');
	} else {
		util.debug('get subscriber "' + subid + '" from "' + hostname + '"');
		return subscribers[subid];
	}
}

function addMessage(messageText, topicname, hostname) {
	var self = this,
		msgno = self.__msgno,
		messages = self.getTopic(topicname, hostname).messages,
		message, msgid
		;

	msgid = 'msg-' + Date.now() + '-' + (msgno++);
	self.__msgno = msgno % 1024;

	message = messages[msgid] = {
		id : msgid,
		text : messageText,
		sub : {}
	};
	util.debug('add message "' + msgid + '" for "' + hostname + '/' + topicname + '"');

	return message;
}

function getMessage(msgid, topicname, hostname) {
	var self = this,
		messages = self.getTopic(topicname, hostname).messages
		;

	if (!messages.hasOwnProperty(msgid)) {
		throw new Error('no message "' + msgid + '" in "' + hostname + '/' + topicname + '"');
	} else {
		util.debug('get message "' + msgid + '" from "' + hostname + '/' + topicname + '"');
		return messages[msgid];
	}
}

function delMessage(msgid, topicname, hostname) {
	var self = this,
		messages = self.getTopic(topicname, hostname).messages
		;

	if (!messages.hasOwnProperty(msgid)) {
		throw new Error('no message "' + msgid + '" in "' + hostname + '/' + topicname + '"');
	} else {
		util.debug('delete message "' + msgid + '" from "' + hostname + '/' + topicname + '"');
		delete messages[msgid];
	}
}

function listenMessage(msgid, topicname, hostname) {
	var self = this,
		message = self.getMessage(msgid, topicname, hostname),
		msgsub = message.sub,
		intervalId
		;

	if (Object.keys(msgsub).length <=0) return;

	intervalId = setInterval(function() {
		if (Object.keys(msgsub).length <=0) {
			self.delMessage(msgid, topicname, hostname);
			clearInterval(intervalId);
			util.debug('stop listen message for "' + msgid + '"');
		}
	}, listenInterval);

	util.debug('start listen message for "' + msgid + '"');
	return intervalId;
}

function consumeMessage(subid, msgid, topicname, hostname) {
	var self = this,
		message = self.getMessage(msgid, topicname, hostname),
		msgtext = message.text,
		msgsub =  message.sub
		;

	if (msgtext && msgsub && msgsub.hasOwnProperty(subid)) {
		delete msgsub[subid];
		return msgtext;
	} else {
		return false;
	}
}

function __create() {
	return {
		__hosts : {},
		__msgno : 0,
		__pubno : 0,
		__subno : 0,
		addHost : addHost,
		getHost : getHost,
		addTopic : addTopic,
		getTopic : getTopic,
		addPublisher : addPublisher,
		getPublisher : getPublisher,
		addSubscriber : addSubscriber,
		getSubscriber : getSubscriber,
		addMessage : addMessage,
		getMessage : getMessage,
		delMessage : delMessage,
		listenMessage : listenMessage,
		consumeMessage : consumeMessage,
		__create : __create,
	}
}

module.exports = __create();
