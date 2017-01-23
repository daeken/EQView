var eqfiles;

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

function selectSubFile(s3d, fn) {

}

function selectRootFile(fn, pushed) {
	if(pushed !== true)
		history.pushState({type: 'tl', fn: fn}, fn, '#' + fn);
	$('#tlfileselector').hide();

	getS3D(fn, function(s3d) {
		$('#subfileselector').show();
		showFiles('#subfiles', s3d.filenames, function(fn) { selectSubFile(s3d, fn) });
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
	$.ajax('/eqfiles.json', { dataType: 'json', success : function(files) {
		eqfiles = files;
		showFiles('#tlfiles', files, selectRootFile);
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
	}
};
