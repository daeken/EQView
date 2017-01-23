class S3D {
	constructor(ab) {
		this.ab = ab;
		
		var b = new Binary(ab, true);
		var offset = b.getUint32();
		if(b.getString(4, 'binary') != 'PFS ')
			throw '!S3D';

		var filelist = [];
		b.seek(offset);
		var count = b.getUint32();
		var dir;
		for(var i = 0; i < count; ++i) {
			b.seek(offset + 4 + i * 12);
			var crc = b.getUint32(), foff = b.getUint32(), size = b.getUint32();
			b.seek(foff);

			var dbuf = new ArrayBuffer(size);
			var data = new Uint8Array(dbuf);
			var len = 0;
			while(len < size) {
				var deflen = b.getUint32(), inflen = b.getUint32();
				data.set(pako.inflate(b.getBytes(deflen)), len);
				len += inflen;
			}
			if(crc == 0x61580AC9)
				dir = data;
			else
				filelist.push([foff, data]);
		}

		filelist.sort(function(a, b) {
			return cmp(a[0], b[0]);
		});

		b = new Binary(dir, true);
		if(b.getUint32() != filelist.length)
			throw 'File count mismatch';

		this.filenames = [];
		this.files = {};
		for(var i = 0; i < filelist.length; ++i) {
			var fn = b.getString(b.getUint32() - 1)
			b.skip(1);
			this.filenames.push(fn);
			this.files[fn] = filelist[i][1];
		}
	}
}
