/*!
 * Binary Reader
 * author: Stefan Benicke <stefan.benicke@gmail.com>
 * version: 1.0.2
 * url: https://github.com/opusonline/binary.js
 * license: MIT
 *
 * Modifications by Cody Brocious
 */

;(function(global) {
	'use strict';

	function Binary(array, littleEndian) {
		// array can be Array, TypedArray or ArrayBuffer or Number
		if (Array.isArray(array)) {
			this.dataView = new DataView(new ArrayBuffer(array));
		} else if (ArrayBuffer.isView(array)) {
			this.dataView = new DataView(array.buffer, array.byteOffset, array.byteLength);
		} else if (_instanceOf(array, 'ArrayBuffer')) {
			this.dataView = new DataView(array);
		} else if ( typeof array === 'number') {
			this.dataView = new DataView(new ArrayBuffer(array));
		} else {
			throw new Error('Invalid argument');
		}
		this.length = this.dataView.byteLength;
		this.littleEndian = littleEndian || false;
		this.position = 0;
		return this;
	}


	Binary.prototype.setLittleEndian = function() {
		this.littleEndian = true;
		return this;
	};
	Binary.prototype.setBigEndian = function() {
		this.littleEndian = false;
		return this;
	};
	Binary.prototype.getBlob = function(type) {
		if (type === undefined || ! _instanceOf(type, 'String')) {
			type = 'application/octet-binary';
		}
		return new Blob([this.dataView.buffer], {
			type : type
		});
	};
	Binary.prototype.getChunk = function(from, to) {
		if (to === undefined) {
			var length = from;
			from = this.position;
			to = from + length;
			this.seek(to);
		}
		from += this.dataView.byteOffset;
		to += this.dataView.byteOffset;
		return new Uint8Array(this.dataView.buffer.slice(from, to));
	};
	Binary.prototype.getBuffer = function() {
		return this.dataView.buffer;
	};
	Binary.prototype.u8 = Binary.prototype.getUint8 = function() {
		var offset = this.position;
		this.seek(offset + Uint8Array.BYTES_PER_ELEMENT);
		var result = this.dataView.getUint8(offset);
		return result;
	};
	Binary.prototype.i8 = Binary.prototype.getInt8 = function() {
		var offset = this.position;
		this.seek(offset + Int8Array.BYTES_PER_ELEMENT);
		var result = this.dataView.getInt8(offset);
		return result;
	};
	Binary.prototype.u16 = Binary.prototype.getUint16 = function(littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Uint16Array.BYTES_PER_ELEMENT);
		var result = this.dataView.getUint16(offset, littleEndian);
		return result;
	};
	Binary.prototype.i16 = Binary.prototype.getInt16 = function(littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Int16Array.BYTES_PER_ELEMENT);
		var result = this.dataView.getInt16(offset, littleEndian);
		return result;
	};
	Binary.prototype.u32 = Binary.prototype.getUint32 = function(littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Uint32Array.BYTES_PER_ELEMENT);
		var result = this.dataView.getUint32(offset, littleEndian);
		return result;
	};
	Binary.prototype.i32 = Binary.prototype.getInt32 = function(littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Int32Array.BYTES_PER_ELEMENT);
		var result = this.dataView.getInt32(offset, littleEndian);
		return result;
	};
	Binary.prototype.f32 = Binary.prototype.getFloat32 = function(littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Float32Array.BYTES_PER_ELEMENT);
		var result = this.dataView.getFloat32(offset, littleEndian);
		return result;
	};
	Binary.prototype.f64 = Binary.prototype.getFloat64 = function(littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Float64Array.BYTES_PER_ELEMENT);
		var result = this.dataView.getFloat64(offset, littleEndian);
		return result;
	};
	Binary.prototype.setUint8 = function(value) {
		var offset = this.position;
		this.seek(offset + Uint8Array.BYTES_PER_ELEMENT);
		this.dataView.setUint8(offset, value);
		return this;
	};
	Binary.prototype.setInt8 = function(value) {
		var offset = this.position;
		this.seek(offset + Int8Array.BYTES_PER_ELEMENT);
		this.dataView.setInt8(offset, value);
		return this;
	};
	Binary.prototype.setUint16 = function(value, littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Uint16Array.BYTES_PER_ELEMENT);
		this.dataView.setUint16(offset, value, littleEndian);
		return this;
	};
	Binary.prototype.setInt16 = function(value, littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Int16Array.BYTES_PER_ELEMENT);
		this.dataView.setInt16(offset, value, littleEndian);
		return this;
	};
	Binary.prototype.setUint32 = function(value, littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Uint32Array.BYTES_PER_ELEMENT);
		this.dataView.setUint32(offset, value, littleEndian);
		return this;
	};
	Binary.prototype.setInt32 = function(value, littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Int32Array.BYTES_PER_ELEMENT);
		this.dataView.setInt32(offset, value, littleEndian);
		return this;
	};
	Binary.prototype.setFloat32 = function(value, littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Float32Array.BYTES_PER_ELEMENT);
		this.dataView.setFloat32(offset, value, littleEndian);
		return this;
	};
	Binary.prototype.setFloat64 = function(value, littleEndian) {
		littleEndian = littleEndian || this.littleEndian;
		var offset = this.position;
		this.seek(offset + Float64Array.BYTES_PER_ELEMENT);
		this.dataView.setFloat64(offset, value, littleEndian);
		return this;
	};
	Binary.prototype.seek = function(offset) {
		if (offset < 0) {
			this.position = 0;
		} else if (offset > this.dataView.byteLength) {
			throw new Error('Offset behind length');
		} else {
			this.position = offset;
		}
		return this;
	};
	Binary.prototype.tell = function() {
		return this.position;
	};
	Binary.prototype.skip = function(length) {
		if (length === undefined) {
			length = 1;
		}
		return this.seek(this.position + length);
	};
	Binary.prototype.skipInt8 = function() {
		return this.skip(Int8Array.BYTES_PER_ELEMENT);
	};
	Binary.prototype.skipInt16 = function() {
		return this.skip(Int16Array.BYTES_PER_ELEMENT);
	};
	Binary.prototype.skipInt32 = function() {
		return this.skip(Int32Array.BYTES_PER_ELEMENT);
	};
	Binary.prototype.getBytes = function(length, copy) {
		if (length === undefined || length === null) {
			length = this.length - this.position;
		}
		var offset = this.position;
		this.seek(offset + length);
		if (copy === true) {
			var from = offset + this.dataView.byteOffset;
			var to = from + length;
			return new Uint8Array(this.dataView.buffer.slice(from, to));
		}
		return new Uint8Array(this.dataView.buffer, this.dataView.byteOffset, this.dataView.byteLength).subarray(offset, offset + length);
	};
	Binary.prototype.getString = function(length, encoding) {
		if (length === undefined || length === null) {
			length = this.length - this.position;
		}
		var bytes = this.getBytes(length);
		encoding = encoding === 'utf8' ? 'utf-8' : (encoding || 'binary');
		if (TextDecoder && encoding !== 'binary') {
			return new TextDecoder(encoding).decode(bytes);
		}
		var string = '';
		for (var i = 0; i < length; i++) {
			string += String.fromCharCode(bytes[i]);
		}
		if (encoding === 'utf-8') {
			string = decodeURIComponent(escape(string));
		}
		return string;
	};
	Binary.prototype.getChar = function(encoding) {
		return this.getString(1, encoding);
	};
	Binary.prototype.setBytes = function(array) {
		var view = null;
		if (Array.isArray(array)) {
			view = new Uint8Array(array);
		} else if (array && ArrayBuffer.isView(array)) {
			view = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
		} else if (_instanceOf(array, 'ArrayBuffer')) {
			view = new Uint8Array(array);
		} else {
			throw new Error('Invalid argument');
		}
		var offset = this.position;
		this.seek(offset + view.length);
		for (var i = 0; i < view.length; i++) {
			this.dataView.setUint8(offset + i, view[i]);
		}
		return this;
	};
	Binary.prototype.setString = function(string, encoding) {
		var offset = this.position;
		var length = string.length;
		this.seek(offset + length);
		encoding = encoding === 'utf8' ? 'utf-8' : (encoding || 'binary');
		if (TextEncoder && encoding !== 'binary') {
			var bytes = new TextEncoder(encoding).encode(string);
			for (var i = 0; i < length; i++) {
				this.dataView.setUint8(offset + i, bytes[i]);
			}
		} else {
			if (encoding === 'utf-8') {
				string = unescape(encodeURIComponent(string));
			}
			for (var i = 0; i < length; i++) {
				this.dataView.setUint8(offset + i, (string.charCodeAt(i) & 0xff));
			}
		}
		return this;
	};
	Binary.prototype.setChar = function(char, encoding) {
		return this.setString(char, encoding);
	};
	Binary.prototype.fill = function(value, length) {
		if (length === undefined || length === null) {
			length = this.length - this.position;
		}
		if ( typeof value !== 'number' && _instanceOf(value, 'String')) {
			value = (value.charCodeAt(0) & 0xff);
		}
		var offset = this.position;
		this.seek(offset + length);
		for (var i = 0; i < length; i++) {
			this.dataView.setUint8(offset + i, value);
		}
		return this;
	};
	Binary.prototype.copy = function(target, targetFrom, sourceFrom, length) {
		if (!( target instanceof Binary)) {
			throw new Error('Target has invalid type');
		}
		if (targetFrom === undefined || targetFrom === null) {
			targetFrom = 0;
		}
		if (sourceFrom === undefined || sourceFrom === null) {
			sourceFrom = 0;
		}
		var bytes = this.seek(sourceFrom).getBytes(length);
		target.seek(targetFrom).setBytes(bytes);
		return this;
	};
	Binary.prototype.toString = function(encoding, from, length) {
		if (from === undefined) {
			from = 0;
		}
		this.seek(from);
		return this.getString(length, encoding);
	};
	Binary.prototype.getByte = Binary.prototype.getUint8;
	Binary.prototype.setByte = Binary.prototype.setUint8;

	function _instanceOf(object, name) {
		var type = Object.prototype.toString.call(object);
		if (type === '[object ' + name + ']') {
			return true;
		}
		return false;
	}

	if ( typeof define === 'function' && define.amd) {
		define(function() {
			return Binary;
		});
	} else {
		global.Binary = Binary;
	}

})(this);