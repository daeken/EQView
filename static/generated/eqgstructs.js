/*
*       o__ __o       o__ __o__/_   o          o    o__ __o__/_   o__ __o                o    ____o__ __o____   o__ __o__/_   o__ __o      
*      /v     v\     <|    v       <|\        <|>  <|    v       <|     v\              <|>    /   \   /   \   <|    v       <|     v\     
*     />       <\    < >           / \o      / \  < >           / \     <\             / \         \o/        < >           / \     <\    
*   o/                |            \o/ v\     \o/   |            \o/     o/           o/   \o        |          |            \o/       \o  
*  <|       _\__o__   o__/_         |   <\     |    o__/_         |__  _<|           <|__ __|>      < >         o__/_         |         |> 
*   \          |     |            / \    \o  / \   |             |       \          /       \       |          |            / \       //  
*     \         /    <o>           \o/     v\ \o/  <o>           <o>       \o      o/         \o     o         <o>           \o/      /    
*      o       o      |             |       <\ |    |             |         v\    /v           v\   <|          |             |      o     
*      <\__ __/>     / \  _\o__/_  / \        < \  / \  _\o__/_  / \         <\  />             <\  / \        / \  _\o__/_  / \  __/>     
*
* THIS FILE IS GENERATED BY structgen.py/structs.yml
* DO NOT EDIT
*
*/
var Eqg = {};
Eqg.Triangle = class {
	constructor(data) {
		var br = new Binary(data, true);
		var Indices = this.Indices = new Array(3);
		for(var i = 0; i < 3; ++i) {
			Indices[i] = br.u32();
		}
		var MatIndex = this.MatIndex = br.u32();
		var Flag = this.Flag = br.u32();
	}
};

Eqg.Vertex3 = class {
	constructor(data) {
		var br = new Binary(data, true);
		var Position = this.Position = new Array(3);
		for(var i = 0; i < 3; ++i) {
			Position[i] = br.f32();
		}
		var Normal = this.Normal = new Array(3);
		for(var i = 0; i < 3; ++i) {
			Normal[i] = br.f32();
		}
		var unk1 = br.u32();
		var TexCoord = this.TexCoord = new Array(2);
		for(var i = 0; i < 2; ++i) {
			TexCoord[i] = br.f32();
		}
		var unk2 = new Array(2);
		for(var i = 0; i < 2; ++i) {
			unk2[i] = br.f32();
		}
	}
};

Eqg.Material = class {
	constructor(data) {
		var br = new Binary(data, true);
		var Index = this.Index = br.u32();
		var _reftemp_Name = br.u32();
		var Name = this.Name = readStringFromTable(Eqg.__stringtable, _reftemp_Name);
		var _reftemp_Shader = br.u32();
		var Shader = this.Shader = readStringFromTable(Eqg.__stringtable, _reftemp_Shader);
		var numProp = br.u32();
		var Properties = this.Properties = new Array(numProp);
		for(var i = 0; i < numProp; ++i) {
			Properties[i] = new Eqg.MatProperty(br);
		}
	}
};

Eqg.Vertex = class {
	constructor(data) {
		var br = new Binary(data, true);
		var Position = this.Position = new Array(3);
		for(var i = 0; i < 3; ++i) {
			Position[i] = br.f32();
		}
		var Normal = this.Normal = new Array(3);
		for(var i = 0; i < 3; ++i) {
			Normal[i] = br.f32();
		}
		var TexCoord = this.TexCoord = new Array(2);
		for(var i = 0; i < 2; ++i) {
			TexCoord[i] = br.f32();
		}
	}
};

Eqg.MatProperty = class {
	constructor(data) {
		var br = new Binary(data, true);
		var _reftemp_Name = br.u32();
		var Name = this.Name = readStringFromTable(Eqg.__stringtable, _reftemp_Name);
		var Type = this.Type = br.u32();
		if(!(Type != 1 && Type <= 3)) throw new Error('Assertion failed: Type != 1 && Type <= 3');
		if(Type == 0) {
			var FloatValue = this.FloatValue = br.f32();
		}
		if(Type == 2) {
			var _reftemp_StringValue = br.u32();
			var StringValue = this.StringValue = readStringFromTable(Eqg.__stringtable, _reftemp_StringValue);
		}
		if(Type == 3) {
			var ARGBValue = this.ARGBValue = br.u32();
		}
	}
};

Eqg.BoneAssignment = class {
	constructor(data) {
		var br = new Binary(data, true);
		var Count = this.Count = br.u32();
		var Weights = this.Weights = new Array(4);
		for(var i = 0; i < 4; ++i) {
			Weights[i] = new Eqg.BoneWeight(br);
		}
	}
};

Eqg.BoneWeight = class {
	constructor(data) {
		var br = new Binary(data, true);
		var BoneIndex = this.BoneIndex = br.i32();
		var Value = this.Value = br.f32();
	}
};

Eqg.Ter = class {
	constructor(data) {
		var br = new Binary(data, true);
		var magic = br.getString(4);
		if(!(magic == "EQGT")) throw new Error('Assertion failed: magic == "EQGT"');
		var Version = this.Version = br.u32();
		var strlen = br.u32();
		var numMat = br.u32();
		var numVert = br.u32();
		var numTri = br.u32();
		Eqg.__stringtable = br.getString(strlen);
		var Materials = this.Materials = new Array(numMat);
		for(var i = 0; i < numMat; ++i) {
			Materials[i] = new Eqg.Material(br);
		}
		if(Version < 3) {
			var Vertices = this.Vertices = new Array(numVert);
			for(var j = 0; j < numVert; ++j) {
				Vertices[j] = new Eqg.Vertex(br);
			}
		}
		if(Version >= 3) {
			var Vertices = this.Vertices = new Array(numVert);
			for(var j = 0; j < numVert; ++j) {
				Vertices[j] = new Eqg.Vertex3(br);
			}
		}
		var Triangles = this.Triangles = new Array(numTri);
		for(var i = 0; i < numTri; ++i) {
			Triangles[i] = new Eqg.Triangle(br);
		}
	}
};

Eqg.Bone = class {
	constructor(data) {
		var br = new Binary(data, true);
		var _reftemp_Name = br.u32();
		var Name = this.Name = readStringFromTable(Eqg.__stringtable, _reftemp_Name);
		var LinkBoneIndex = this.LinkBoneIndex = br.u32();
		var Flag = this.Flag = br.u32();
		var ChildBoneIndex = this.ChildBoneIndex = br.u32();
		var Position = this.Position = new Array(3);
		for(var i = 0; i < 3; ++i) {
			Position[i] = br.f32();
		}
		var Rotation = this.Rotation = new Array(4);
		for(var i = 0; i < 4; ++i) {
			Rotation[i] = br.f32();
		}
		var Scale = this.Scale = new Array(3);
		for(var i = 0; i < 3; ++i) {
			Scale[i] = br.f32();
		}
	}
};

Eqg.Mod = class {
	constructor(data) {
		var br = new Binary(data, true);
		var magic = br.getString(4);
		if(!(magic == "EQGM")) throw new Error('Assertion failed: magic == "EQGM"');
		var Version = this.Version = br.u32();
		var strlen = br.u32();
		var numMat = br.u32();
		var numVert = br.u32();
		var numTri = br.u32();
		var numBones = br.u32();
		Eqg.__stringtable = br.getString(strlen);
		var Materials = this.Materials = new Array(numMat);
		for(var i = 0; i < numMat; ++i) {
			Materials[i] = new Eqg.Material(br);
		}
		if(Version < 3) {
			var Vertices = this.Vertices = new Array(numVert);
			for(var j = 0; j < numVert; ++j) {
				Vertices[j] = new Eqg.Vertex(br);
			}
		}
		if(Version >= 3) {
			var Vertices = this.Vertices = new Array(numVert);
			for(var j = 0; j < numVert; ++j) {
				Vertices[j] = new Eqg.Vertex3(br);
			}
		}
		var Triangles = this.Triangles = new Array(numTri);
		for(var i = 0; i < numTri; ++i) {
			Triangles[i] = new Eqg.Triangle(br);
		}
		var Bones = this.Bones = new Array(numBones);
		for(var i = 0; i < numBones; ++i) {
			Bones[i] = new Eqg.Bone(br);
		}
		if(numBones > 0) {
			var BoneAssignments = this.BoneAssignments = new Array(numVert);
			for(var j = 0; j < numVert; ++j) {
				BoneAssignments[j] = new Eqg.BoneAssignment(br);
			}
		}
	}
};