/**
 * Observable subject, which have a list of observers, and notifies them of state changes
 * 
 * @author Adrian Wądrzyk <adrian.wadrzyk@gmail.com>
 * @constructor
 */
var Observable = function() {
	var ATTR_DELIMETER = ":",
		observers = {},
		
		getOptions = function(event) {
			if (typeof event !== "string") {
				throw {
					'name' 	  : "InvalidArgumentException",
					'message' : "Event name must be a string" 
				};
			}
		
			event = event.split(ATTR_DELIMETER);
			
			return {
				'name' 		: event.shift(),
				'attribute' : event.shift()
			};
		};
	
	/**
	 * Add specific event listener to subject
	 * 
	 * @param {string}   event 	  event name with optional attribute
	 * @param {function} callback function called after an event occurred
	 * @param {Object}   context  context of callback function
	 * 
	 * @return {Observable}
	 */
	this.addEventListener = function(event, callback, context) {
		if (typeof callback !== "function") {
			throw {
				'name' 	  : "InvalidArgumentException",
				'message' : "Callback must be a function"
			};
		}
		
		if (context && typeof context !== "object") {
			throw {
				'name' 	  : "InvalidArgumentException",
				'message' : "Context of callback function must be a object"
			};
		}
		
		var options  = getOptions(event),
			list 	 = observers[options.name] || (observers[options.name] = []), 
			observer = {
				'attribute' : options.attribute,
				'callback'  : callback,
				'context'   : context
			};

		list.push(observer);
		
		return this;
	};
		
	/**
	 * Remove specific event listener to subject
	 * 
	 * @param {string}   event    event name with optional attribute
	 * @param {function} callback function called after an event occurred
	 * @param {Object}   context  context of callback function
	 * 
	 * @return {Observable}
	 */
	this.removeEventListener = function (event, callback, context) {
		var options	  = getOptions(event),
			list 	  = observers[options.name],
			observer  = null;
		
		if (list !== undefined) {
			for (var i = list.length; i--; ) {
				observer = list[i];
				
				if ((options.attribute && observer.attribute !== options.attribute) ||
					(callback && observer.callback !== callback ) ||
					(context && observer.context !== context)
				) {
					continue;
				}
				
				list.splice(i, 1);
			}
		}			
		
		return this;
	};
		
	/**
	 * Run specific event
	 * If any of listeners returns false chain of callbacks is interrupted
	 * 
	 * @param {string} event event name with optional attribute
	 * 
	 * @return {Observable}
	 */
	this.trigger = function(event) {
		var options	  = getOptions(event),
			list 	  = observers[options.name],
			args	  = Array.prototype.slice.call(arguments, 1),
			observer  = null; 
		
		if (list !== undefined) {
			for (var i = 0; i < list.length; i++) {
				observer = list[i];
				
				if (!options.attribute || observer.attribute === options.attribute) {
					if (observer.callback.apply(observer.context, args) === false) {
						break;
					}
				}
			}
		}
		
		return this;
	};
};