(function(njms, undefined) {
	var Publisher = function(host, name) {
		var that = this
			;

		that._host = host;
		that._name = name;
		that._event = new Event('publisher');
		that._isRegistered = false;
	}

	Publisher.prototype.register = function() {
		var that = this
			;

		njms.register({
			host : that._host,
			pub : that._name
		}, function(data) {
			if (data.code === 0) {
				that._id = data.id;
				that._isRegistered = true;
				that._event.__id = data.id;
				that.trigger('registered');
			} else {
				that.trigger('error', data.code, 'register');
			}
		});
	}

	Publisher.prototype.publish = function(topic, message) {
		var that = this
			;

		if (!that._isRegistered) {
			that.once('registered', function() {
				that.publish(topic, message);
			});
		} else {
			njms.publish({
				host : that._host,
				topic : topic,
				message : message,
				id : that._id
			}, function(data) {
				if (data.code === 0) {
					that.trigger('published', data.id, topic, message);
				} else {
					that.trigger('error', data.code, 'publish');
				}
			});
		}
	}

	Publisher.prototype.on = function(events, callback) {
		this._event.on(events, callback, this);
	}

	Publisher.prototype.off = function(events, callback) {
		this._event.off(events, callback, this);
	}

	Publisher.prototype.has = function(events, callback) {
		this._event.has(events, callback, this);
	}

	Publisher.prototype.once = function(events, callback) {
		this._event.once(events, callback, this);
	}

	Publisher.prototype.trigger = function() {
		this._event.trigger.apply(this._event, arguments);
	}

	njms.createPublisher = function(host, name) {
		var publisher = new Publisher(host, name);

		publisher.register();

		return publisher;
	}
})(window.njms);