var eqfiles, curs3d;

function getRootFile(fn, cb) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200)
			cb(this.response);
	};
	xhr.open('GET', '/eq/' + fn);
	xhr.responseType = 'arraybuffer';
	xhr.send();
}

function getS3D(fn, cb) {
	getRootFile(fn, function(ab) {
		cb(new S3D(ab));
	});
}

function viewFile(s3d, fn) {
	var ext = fn.split('.').pop().toLowerCase();
	if(fn == '$') {
		// XXX: Do lookup of the main file and call view function accordingly.
	}

	$('#viewer').empty();

	switch(ext) {
		case 'ani':
			showAni(s3d.files[fn]);
			break;
		case 'mod':
			showMod(s3d.files[fn]);
			break;
		case 'ter':
			showTer(s3d.files[fn]);
			break;
		default:
			showHex(s3d.files[fn]);
			break;
	}

	$('#subfileselector,#tlfileselector').hide();
	$('#viewer').show();
}

function selectSubFile(fn, pushed) {
	if(pushed !== true)
		history.pushState({type: 'sub', fn: fn}, fn, '#' + curs3d.fn + '/' + fn);

	viewFile(curs3d, fn);
}

function selectRootFile(fn, pushed, sub) {
	if(pushed !== true)
		history.pushState({type: 'tl', fn: fn}, fn, '#' + fn);
	$('#tlfileselector').hide();

	getS3D(fn, function(s3d) {
		curs3d = s3d;
		s3d.fn = fn;
		if(sub === undefined)
			$('#subfileselector').show();
		showFiles('#subfiles', s3d.filenames, selectSubFile);
		if(sub !== undefined)
			selectSubFile(sub, true);
	});
}

var specialExt = ['s3d', 'eqg', 'wld', 'ani', 'lit', 'mod', 'zon', 'ter'];
function cmp(a, b) {
	if(a == b)
		return 0;
	else if(a < b)
		return -1;
	return 1;
}

function sortFiles(arr) {
	arr.sort(function(a, b) {
		var aext = a.split('.').pop(), bext = b.split('.').pop();
		if(aext == bext)
			return cmp(a, b);
		else {
			var as = specialExt.includes(aext), bs = specialExt.includes(bext);
			if(as && !bs)
				return -1;
			else if(!as && bs)
				return 1;
			return cmp(aext, bext);
		}
	});
}

function showFiles(sel, files, cb) {
	sortFiles(files);
	$(sel).empty();
	for(var fn of files) {
		var li = $('<li>');
		li.append($('<a>').text(fn).click(
			(function(fn) { return function() { cb(fn) } })(fn)
		));
		$(sel).append(li);
	}
}

$(document).ready(function() {
	$('#viewsubfile').click(function() {
		selectSubFile('$');
	});

	$.ajax('/eqfiles.json', { dataType: 'json', success : function(files) {
		eqfiles = files;
		showFiles('#tlfiles', files, selectRootFile);

		if(window.location.hash.length > 1) {
			var hash = window.location.hash.substring(1).split('/');
			selectRootFile(hash[0], true, hash[1]);
		}
	} });
});

window.onpopstate = function(evt) {
	if(evt.state == null) {
		$('#tlfileselector').show();
		$('#subfileselector').hide();
		$('#viewer').hide();
	} else if(evt.state.type == 'tl') {
		$('#subfileselector').hide();
		$('#viewer').hide();
		selectRootFile(evt.state.fn, true);
	} else if(evt.state.type == 'sub') {
		$('#tlfileselector').hide();
		$('#subfileselector').hide();
		$('#viewer').hide();
		selectSubFile(evt.state.fn, true);
	}
};
