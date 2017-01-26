function showAni(data) {
	var b = new Binary(data, true);
	var ani = new Eqg.Ani(b);
	console.log(ani);
	$('#viewer').append($('<pre>').text(JSON.stringify(ani, null, 2)));
}