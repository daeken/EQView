function showMod(data) {
	var mod = new Eqg.Mod(data);
	console.log(mod);

	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(800, 600);
	$('#viewer').append(renderer.domElement);
	var controls = new THREE.FirstPersonControls(camera, renderer.domElement);
	controls.movementSpeed = 5;
    controls.lookSpeed = .05;
    controls.noFly = true;
    controls.lookVertical = false;

	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 5;

	var first = true;
	function render() {
		if(!first && !$('#viewer').is(':visible'))
			return;
		requestAnimationFrame(render);
		controls.update(clock.getDelta());
		renderer.render(scene, camera);
	}
	render();
}