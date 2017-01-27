function showMod(data, files) {
	function makeTex(name) {
		var data = files[name.toLowerCase()];
		var asstr = '';
		for(var b of data)
			asstr += String.fromCharCode(b);
		var b64 = btoa(asstr);
		var texture = new THREE.DDSLoader().load('data:image/png;base64,' + b64);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		return texture;
	}

	function createMaterials() {
		mod.Materials.sort(function(a, b) {
			return cmp(a.Index, b.Index);
		});
		var matarr = new Array(mod.Materials[mod.Materials.length - 1].Index + 1);
		for(var mat of mod.Materials) {
			var props = {color: 0xffffff, side: THREE.DoubleSide};
			for(var prop of mat.Properties) {
				switch(prop.Name) {
					case "e_TextureDiffuse0":
						props.map = makeTex(prop.StringValue);
						break;
					case "e_TextureNormal0":
						props.normalMap = makeTex(prop.StringValue);
						break;
					case "e_fShininess0":
						props.shininess = prop.FloatValue;
						break;
				}
			}
			matarr[mat.Index] = new THREE.MeshPhongMaterial(props);
		}
		return matarr;
	}

	var mod = new Eqg.Mod(data);
	console.log(mod);
	
	var scene = new THREE.Scene();
	var geometry = new THREE.BufferGeometry();

	var vertices = new Float32Array(mod.Vertices.length * 3);
	var normals = new Float32Array(mod.Vertices.length * 3);
	var texcoords = new Float32Array(mod.Vertices.length * 2);
	for(var i = 0, j = 0, k = 0; i < mod.Vertices.length; ++i) {
		var vert = mod.Vertices[i];
		vertices [j  ] = vert.Position[0];
		normals  [j++] = vert.Normal[0];
		vertices [j  ] = vert.Position[1];
		normals  [j++] = vert.Normal[1];
		vertices [j  ] = vert.Position[2];
		normals  [j++] = vert.Normal[2];

		texcoords[k++] = vert.TexCoord[0];
		texcoords[k++] = vert.TexCoord[1];
	}

	mod.Triangles.sort(function(a, b) {
		return cmp(a.MatIndex, b.MatIndex);
	});
	var curMat = -1, groupStart = 0;
	var indices = new Uint32Array(mod.Triangles.length * 3);
	for(var i = 0, j = 0; i < mod.Triangles.length; ++i) {
		var tri = mod.Triangles[i], ind = tri.Indices;
		if(tri.MatIndex != curMat) {
			if(groupStart != j) {
				geometry.addGroup(groupStart, j - groupStart, curMat);
			}
			groupStart = j;
			curMat = tri.MatIndex;
		}
		indices[j++] = ind[0];
		indices[j++] = ind[1];
		indices[j++] = ind[2];
	}

	geometry.setIndex(new THREE.BufferAttribute(indices, 1));
	geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
	geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
	geometry.addAttribute('uv', new THREE.BufferAttribute(texcoords, 2));
	var material = new THREE.MultiMaterial(createMaterials());

	var obj;
	if(mod.Bones.length != 0) {
		var bones = mod.Bones.map(function(bone) {
			var jbone = new THREE.Bone();
			jbone.position.set(bone.Position[0], bone.Position[1], bone.Position[2]);
			jbone.quaternion.set(bone.Rotation[0], bone.Rotation[1], bone.Rotation[2], bone.Rotation[3])
			jbone.scale.set(bone.Scale[0], bone.Scale[1], bone.Scale[2]);
			return jbone;
		});
		function joinBones(i) {
			var mbone = mod.Bones[i], jbone = bones[i];

			var child = mbone.ChildBoneIndex;
			while(child != -1) {
				jbone.add(bones[child]);
				joinBones(child);
				child = mod.Bones[child].LinkBoneIndex;
			}
		}
		joinBones(0);

		var skinIndices = new Uint32Array(mod.BoneAssignments.length * 4);
		var skinWeights = new Float32Array(mod.BoneAssignments.length * 4);
		for(var i = 0; i < mod.BoneAssignments.length; ++i) {
			var w = mod.BoneAssignments[i].Weights;
			for(var j = 0; j < 4; ++j) {
				skinIndices[i * 4 + j] = w[j].BoneIndex;
				skinWeights[i * 4 + j] = w[j].Value;
			}
		}
		geometry.addAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
		geometry.addAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));

		obj = new THREE.SkinnedMesh(geometry, material);
		obj.add(bones[0]);
		obj.bind(new THREE.Skeleton(bones));

		/*var helper = new THREE.SkeletonHelper(obj);
		helper.material.linewidth = 3;
		obj.add(helper);*/
	} else {
		obj = new THREE.Mesh(geometry, material);
	}

	obj.rotateX(-Math.PI / 2);
	obj.rotateZ(Math.PI);
	//obj.rotateY(-Math.PI / 2);
	obj.scale.set(.5, .5, .5);
	scene.add(obj);

	scene.add(new THREE.AmbientLight(0x404040, 2));
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.target = obj;
	light.position.set(0, 10, 10);
	scene.add(light);
	light = new THREE.DirectionalLight(0xffffff, 1);
	light.target = obj;
	light.position.set(0, 10, -10);
	scene.add(light);

	showScene(scene, function(time, delta) {
		bones[0].position.set(Math.sin(time) * 2, bones[0].position.y, bones[0].position.z);
	});
}