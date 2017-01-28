fileHandler('zon', function(data, files) {
	var zon = new Eqg.Zon(data);
	console.log(zon);
	var scene = new THREE.Scene();

	var objs = {};

	function loadObjects() {
		var loadIdx = 0;
		var interval = setInterval(function() {
			for(var i = 0; i < 10; ++i) { // 10 per tick
				if(loadIdx == zon.Files.length) {
					placeObjects();
					return clearInterval(interval);
				}
				var fn = zon.Files[loadIdx++].toLowerCase();
				console.log(fn);
				var mod = fn.match(/\.ter$/) ? new Eqg.Ter(files[fn]) : new Eqg.Mod(files[fn]);
				var obj = mod2three(mod, files, false);
				objs[fn.split('.').shift()] = obj;
			}
		}, 10);
	}

	function placeObjects() {
		for(var placeable of zon.Placeables) {
			var obj = objs[placeable.Name.toLowerCase()];
			if(obj === undefined)
				continue;
			var holder = new THREE.Object3D();
			holder.position.set(placeable.Position[0], placeable.Position[2], placeable.Position[1]);
			holder.scale.set(placeable.Scale, placeable.Scale, placeable.Scale);
			holder.add(obj);
			scene.add(holder);
		}
		render();
	}

	function render() {
		showScene(scene, function(time, delta) {
		});
	}

	loadObjects();

	scene.add(new THREE.AmbientLight(0x404040, 2));
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 10, 10);
	scene.add(light);
	light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 10, -10);
	scene.add(light);

});