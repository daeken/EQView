function showModTer(mod, files) {
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
			var jmat = matarr[mat.Index] = new THREE.MeshPhongMaterial(props);
			jmat.skinning = hasSkeleton;
		}
		return matarr;
	}

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
		texcoords[k++] = -vert.TexCoord[1];
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
	var hasSkeleton = mod.Bones !== undefined && mod.bones.Length != 0;
	var material = new THREE.MultiMaterial(createMaterials());
	material.skinning = hasSkeleton;

	var obj, boneNames, helper;
	if(hasSkeleton) {
		var bones = mod.Bones.map(function(bone) {
			var jbone = new THREE.Bone();
			jbone.position.set(bone.Position[0], bone.Position[1], bone.Position[2]);
			jbone.quaternion.set(bone.Rotation[0], bone.Rotation[1], bone.Rotation[2], bone.Rotation[3])
			jbone.quaternion.copy(jbone.quaternion.inverse());
			jbone.scale.set(bone.Scale[0], bone.Scale[1], bone.Scale[2]);
			return jbone;
		});
		boneNames = mod.Bones.map(bone => bone.Name);
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

		var skinIndices = new Uint16Array(mod.BoneAssignments.length * 4);
		var skinWeights = new Float32Array(mod.BoneAssignments.length * 4);
		for(var i = 0; i < mod.BoneAssignments.length; ++i) {
			var w = mod.BoneAssignments[i].Weights;
			for(var j = 0; j < mod.BoneAssignments[i].Count; ++j) {
				skinIndices[i * 4 + j] = w[j].BoneIndex;
				skinWeights[i * 4 + j] = w[j].Value;
			}
		}
		geometry.addAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
		geometry.addAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));

		obj = new THREE.SkinnedMesh(geometry, material);
		obj.add(bones[0]);
		obj.bind(new THREE.Skeleton(bones));
		helper = new THREE.SkeletonHelper(obj);
		console.log(helper.useQuaternion);
		helper.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
		scene.add(helper);
	} else {
		obj = new THREE.Mesh(geometry, material);
	}

	obj.rotateX(-Math.PI / 2);
	obj.rotateZ(Math.PI);
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

	var ani, aniTime, aniMax;
	showScene(scene, function(time, delta) {
		if(ani !== undefined) {
			if(aniTime === undefined)
				aniTime = time;
			var adelta = ~~((time - aniTime) * 1000) % aniMax;
			for(var abone of ani.FrameBones) {
				var f = abone.Frames;
				if(abone.Bone === undefined) // This animation bone doesn't exist in the model
					continue;
				for(var i = 0; i < f.length - 1; ++i) {
					if(f[i].Time <= adelta && f[i + 1].Time >= adelta) {
						var a = (adelta - f[i].Time) / (f[i + 1].Time - f[i].Time);
						abone.Bone.position.lerpVectors(f[i].Translation, f[i + 1].Translation, a);
						THREE.Quaternion.slerp(f[i].Rotation, f[i + 1].Rotation, abone.Bone.quaternion, a);
						abone.Bone.scale.lerpVectors(f[i].Scaling, f[i + 1].Scaling, a);
						break;
					}
				}
			}
		}
		if(helper !== undefined)
			helper.update();
	});

	if(hasSkeleton) {
		var select = $('<select>');
		select.append('<option value="">-----------</option>');
		for(var name in files) {
			if(name.match(/\.ani$/i))
				select.append($('<option>').text(name));
		}
		select.change(function() {
			var fn = select.val();
			if(fn == '') {
				ani = undefined;
				return;
			}
			ani = new Eqg.Ani(files[fn]);
			for(var abone of ani.FrameBones) {
				abone.Bone = bones[boneNames.indexOf(abone.Bone)];
				for(var f of abone.Frames) {
					f.Translation = new THREE.Vector3(f.Translation[0], f.Translation[1], f.Translation[2]);
					f.Rotation = new THREE.Quaternion(f.Rotation[0], f.Rotation[1], f.Rotation[2], f.Rotation[3]).inverse();
					f.Scaling = new THREE.Vector3(f.Scaling[0], f.Scaling[1], f.Scaling[2]);
				}
			}
			aniTime = undefined;
			aniMax = Math.max.apply(null, ani.FrameBones.map(bone => bone.Frames[bone.Frames.length - 1].Time));
		});
		$('#viewer').append(select);
		var skelviz = $('<input type="checkbox" checked>');
		skelviz.change(function() {
			helper.visible = skelviz.is(':checked');
		});
		$('#viewer').append(skelviz);
		$('#viewer').append('Show skeleton');
	}
}

fileHandler('mod', function(data, files) {
	var mod = new Eqg.Mod(data);
	//console.log(mod);
	showModTer(mod, files);
});

fileHandler('ter', function(data, files) {
	var ter = new Eqg.Ter(data);
	//console.log(ter);
	showModTer(ter, files);
});