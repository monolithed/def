// -*- coding: utf-8; indent-tabs-mode: nil; tab-width: 4; c-basic-offset: 4; -*-

/**
 * def.js: A simple Ruby-style inheritance for JavaScript
 *
 * Original author Tobias Schneider
 * Contributors Dmitry A. Soshnikov, Alexander Abashkin
 *
 * Date 2010
 *
 * @license MIT
 * @version 0.1.0
 *
 * @links
 *   https://github.com/DmitrySoshnikov/def.js
 *   https://github.com/tobeytailor/def.js
 *   https://github.com/monolithed/def
 */

void function (__global__)
{
	'use strict';

	var extend = function (source) {
		var property,
			target = this.prototype;

		for (var key in source) {
			if (source.hasOwnProperty(key)) {
				property = target[key] = source[key];

				if (typeof property == 'function') {
					property.__name__  = key;
					property.__class__ = this;
				}
			}
		}

		// The constructor __init__ must be enumerable
		Object.defineProperty(target, '__init__', {
			value:      target.__init__,
			enumerable: false
		});

		return this;
	};

	/**
	 * @interface
	 */
	var def = function (__parent__, __name__) {
		__name__ || (__name__ = __parent__, __parent__ = __global__);

		// Create __class__ on given context (defaults to global object)
		var __class__ = __parent__[__name__] = function __class__() {

			// Called as a constructor
			if (__parent__ != this) {

				// Allow the constructor to return a different __class__/object
				return this.__init__ && this.__init__.apply(this, arguments);
			}

			// Called as a function - defer setup of __super__ and properties
			deferred.__super__ = __class__;
			deferred.__props__ = arguments[0] || {};
		};


		// Add static helper method
		__class__.extend = extend;

		__class__.__init__ = function(name) {
			var __proto__ = this.prototype;

			return __proto__.__init__
				.apply(__proto__, arguments);
		};

		// Called as function when not, inheriting from a __super__
		var deferred = function (props) {
			return __class__.extend(props);
		};

		/** @constructor */
		var __proto__ = function () {};

		// valueOf is called to setup inheritance from a __super__
		deferred.valueOf = function () {
			/** @typedef {__class__} */
			var __super__ = deferred.__super__;

			if (!__super__)
				return __class__;

			/** @typedef {__super__.prototype} */
			__proto__.prototype = __super__.prototype;

			__class__.prototype = Object.create(new __proto__, {
				__main__: {
					/** @lends {__class__.__init__} */
					value: __proto__.prototype.__init__
				},

				__super__: {
					/*
						Calls the same method as its caller but in the __super__
						based on http://github.com/shergin/legacy by shergin

						function __super__() {
							var caller = __parent__.caller;

							return caller.__class__.__super__.prototype[caller.__name__]
								.apply(this, arguments);
						}
					*/

					value: function(object) {
						return object.prototype.__init__.apply(this,
							Array.prototype.slice.call(arguments, 1));
					}
				},

				__name__ : {
					value: __name__,
					writable: true
				},

				toString : {
					value: function() {
						return '[object ' + __name__ + ']';
					},
					writable: true
				}
			});

			__class__.prototype.constructor = __class__;
			__class__.__super__ = __super__;

			__class__.prototype.toString = function() {
				return __name__;
			};

			__class__.extend(deferred.__props__);

			return __class__.valueOf();
		};

		return deferred;
	};

	/** @implements {def} */
	__global__.def = def;
}(new Function('return this')());
