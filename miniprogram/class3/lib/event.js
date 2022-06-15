class Event {
	cache;
	constructor() {
		this.cache = {};
	}
	on(key, func) {
		(this.cache[key] || (this.cache[key] = [])).push(func);
  }
  // apply、call、bind差别
	once(key, func) {
		function on() {
			this.off(key, on);
			func.apply(this, arguments);
		}
		this.on.apply(this, [key, on]);
	}
	off(key) {
		this.cache[key] = null;
	}
	emit(key, ...args) {
		const stack = this.cache[key];
		if (stack && stack.length > 0) {
			stack.forEach(item => item.apply(this, args));
		}
	}
}

export default Event;