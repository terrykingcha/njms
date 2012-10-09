(function(njms, undefined) {
	var Subscriber = function(host, name) {
		var that = this
			;

		that._host = host;
		that._name = name;
		that._event = new Event('subscriber');
		that._isRegistered = false;
	}

	Subscriber.prototype.register = function() {
		var that = this
			;

		njms.register({
			host : that._host,
			sub : that._name
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

	Subscriber.prototype.recieve = function(isPolling) {
		var that = this
			;

		if (!that._isRegistered) {
			that.once('registered', function() {
				that.recieve(isPolling);
			});
		} else {
			njms.recieve({
				host : that._host,
				id : that._id
			}, function(data) {
				if (data.code === 0) {
					that.trigger('recieved', data.id, data.pubid, data.topic, data.message);
				} else {
					//that.trigger('error', data.code, 'recieve');
				}
				isPolling && setTimeout(function() {
					that.recieve(isPolling);
				}, 500);
			});
		}
	}

	Subscriber.prototype.on = function(events, callback) {
		this._event.on(events, callback, this);
	}

	Subscriber.prototype.off = function(events, callback) {
		this._event.off(events, callback, this);
	}

	Subscriber.prototype.has = function(events, callback) {
		this._event.has(events, callback, this);
	}

	Subscriber.prototype.once = function(events, callback) {
		this._event.once(events, callback, this);
	}

	Subscriber.prototype.trigger = function() {
		this._event.trigger.apply(this._event, arguments);
	}

	njms.createSubscriber = function(host, name) {
		var subscriber = new Subscriber(host, name);

		subscriber.register();

		return subscriber;
	}
})(window.njms);