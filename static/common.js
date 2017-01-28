function readStringFromTable(table, pos) {
	var ret = '';
	for(; pos < table.length, table[pos] != '\0'; ++pos)
		ret += table[pos];
	return ret;
}

function showScene(scene, cb) {
	var vpsize = [1000, 1000];
	var clock = new THREE.Clock();
	var camera = new THREE.PerspectiveCamera(60, vpsize[0] / vpsize[1], 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x002864, 1);
	renderer.setSize(vpsize[0], vpsize[1]);
	$('#viewer').append(renderer.domElement);
	var controls = new THREE.FirstPersonControls(camera, renderer.domElement);
	controls.movementSpeed = 5;
    controls.lookSpeed = 0.1;
    controls.noFly = true;
    controls.lookVertical = true;
    camera.position.set(-5, 0, 0);

	var first = true;
	function render() {
		if(!first && !$('#viewer').is(':visible'))
			return;
		requestAnimationFrame(render);
		var delta = clock.getDelta();
		cb(clock.getElapsedTime(), delta);
		controls.handleResize();
		controls.update(delta);
		renderer.render(scene, camera);
	}
	render();
}
