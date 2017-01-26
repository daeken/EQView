function showMod(data) {
	var mod = new Eqg.Mod(data);
	console.log(mod);

	var scene = new THREE.Scene();
	var geometry = new THREE.BufferGeometry();

	var vertices = new Float32Array(mod.Vertices.length * 3);
	var normals = new Float32Array(mod.Vertices.length * 3);
	var texcoords = new Float32Array(mod.Vertices.length * 2);
	for(var i = 0, j = 0; i < mod.Vertices.length; ++i) {
		var vert = mod.Vertices[i];
		vertices [j  ] = vert.Position[0];
		normals  [j  ] = vert.Normal[0];
		texcoords[j++] = vert.TexCoord[0];
		vertices [j  ] = vert.Position[1];
		normals  [j  ] = vert.Normal[1];
		texcoords[j++] = vert.TexCoord[1];
		vertices [j  ] = vert.Position[2];
		normals  [j++] = vert.Normal[2];
	}

	var indices = new Uint32Array(mod.Triangles.length * 3);
	for(var i = 0, j = 0; i < mod.Triangles.length; ++i) {
		var tri = mod.Triangles[i], ind = tri.Indices;
		indices[j++] = ind[0];
		indices[j++] = ind[1];
		indices[j++] = ind[2];
	}

	geometry.setIndex(new THREE.BufferAttribute(indices, 1));
	geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
	geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

	var material = new THREE.MeshNormalMaterial();
	var obj = new THREE.Mesh(geometry, material);
	obj.rotateX(-Math.PI / 2);
	obj.rotateZ(Math.PI);
	//obj.rotateY(-Math.PI / 2);
	obj.scale.set(.5, .5, .5);
	scene.add(obj);

	showScene(scene, function(time, delta) {
	});
}