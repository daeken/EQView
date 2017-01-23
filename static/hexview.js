function zeropad(inp, length) {
	if(inp.length >= length)
		return inp;
	return ('00000000' + inp).slice(-length);
}

function fhex(num, length) {
	return zeropad(num.toString(16), length);
}

var printableChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~`!@#$%^&*()_+-=[]\\|{};:\'",./<>?';

function showHex(data) {
	var hexlen = data.length < 0x100 ? 2 : (data.length < 0x10000 ? 4 : 8);
	var tdata = '';
	for(var i = 0; i < data.length; i += 16) {
		tdata += fhex(i, hexlen) + ' | ';
		var ascii = '';
		for(var j = 0; j < 16; ++j) {
			if(i + j < data.length) {
				var char = String.fromCharCode(data[i+j]);
				tdata += fhex(data[i+j], 2) + ' ';
				ascii += printableChars.includes(char) ? char : '.';
			} else {
				tdata += '   ';
				ascii += ' ';
			}
			if(j == 7) {
				tdata += ' ';
				ascii += ' ';
			}
		}
		tdata += '| ' + ascii + '\n';
	}
	tdata += fhex(data.length, hexlen);
	$('#viewer').append($('<pre>').text(tdata));
}