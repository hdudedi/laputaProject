"use strict";


const sceneThreeJs = {
	sceneGraph: null,
	camera: null,
	renderer: null,
	controls: null,
	objects:[[null],[null],[null],[null]],
	helice:null,
};

const paintDatas = {
	view:"XY",
	paint: true,
	mousePressed: false,
	lengthline:null,
	xy: {
		plane:null,
		tracePoints: [],
		endPoints: [],
		line: null,
		spline: null,
		lenght: 20,
		object:null,
		geoEx:null,
		intersect:false,
	},
	xz: {
		plane:null,
		tracePoints: [],
		endPoints: [],
		line: null,
		spline: null,
		lenght: 20,
		object:null,
		geoEx:null,
		intersect:false,
		side:null,
		go:0,
	}
};

const moveData = {
	i:0,
	pointsABouger:[],
	bouge:[],
	tabline:[],
	line: null,
	pt:null,
	radius: 0.005,
	circle:null,
	pointEnSelection:false,
	H:null,
	ctrl:false,
	move:false,
	lastPos:null,
	large:0,
	paint:true,
	pickingData:{
		pickable:false,
		point: null,
		normal:null,
	}
};

const moveData2 = {
	i:0,
	pointsABouger:[],
	bouge:[],
	tabline:[],
	line: null,
	pt:null,
	radius: 0.005,
	circle:null,
	pointEnSelection:false,
	H:null,
	ctrl:false,
	move:false,
	lastPos:null,
	large:0,
	paint:true,
	pickingData:{
		pickable:false,
		point: null,
		normal:null,
	}
};

const heliceData ={
	ctrl:false,
	scale:0.1,
	ok:false,
}

 const guiParam = {
    etape:1,
};

const pointsMaterial = new THREE.PointsMaterial( {color: 0xFF582A, size: 5, sizeAttenuation: false} );
const material = new THREE.LineBasicMaterial( {color:0x000000, depthWrite: false, linewidth: 4});
const meshmaterial = new THREE.MeshPhongMaterial({color:0xaaffff});

function init(){
	initEmptyScene(sceneThreeJs);
	initGui(guiParam, sceneThreeJs); // Initialisation de l'interface
    updatedGui(guiParam, sceneThreeJs); //Initialisation de la visualisation en cohérence avec l'interface
}

function updatedGui(guiParam,sceneThreeJs) {
	if(guiParam.etape == 1){
		if(sceneThreeJs.objects[0][0]==null){
			sceneThreeJs.camera.position.set(0,0,1);
			sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
			sceneThreeJs.controls.enabled=false;
		}
		else{
			sceneThreeJs.camera.position.set(0,0,1);
			sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
			sceneThreeJs.controls.enabled=true;
		}
	}else if(guiParam.etape == 2){
		if(sceneThreeJs.objects[0][0]!=null){
			if(moveData.line==null){
				paintDatas.lengthline.visible=false;
				sceneThreeJs.camera.position.set(0,0,1);
				sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
				sceneThreeJs.controls.enabled=false;
				initCabine();
			}
		}else{
			guiParam.etape = 1;
			updatedGui(guiParam,sceneThreeJs);
		}
	}else if(guiParam.etape == 3){
		if(sceneThreeJs.objects[0][0]!=null && sceneThreeJs.objects[1][0]!=null){
			if(moveData2.line==null){
				paintDatas.lengthline.visible=false;
				sceneThreeJs.camera.position.set(0,1,0);
				sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
				sceneThreeJs.controls.enabled=false;
				initAile();
			}
		}else{
			guiParam.etape = 2;
			updatedGui(guiParam,sceneThreeJs);
		}
	}else if(guiParam.etape == 4){
		if(sceneThreeJs.objects[0][0]!=null){
			paintDatas.lengthline.visible=false;
			sceneThreeJs.camera.position.set(0,0,1);
			sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
			sceneThreeJs.controls.enabled=false;
			initHelice();
		}else{
			guiParam.etape = 1;
			updatedGui(guiParam,sceneThreeJs);
		}
	}
	render(sceneThreeJs);
}

function initGui(guiParam,sceneThreeJs) {
    const etapeType = {
        Ballon: function(){ guiParam.etape = 1;  },
        Cabine: function() { guiParam.etape = 2;  },
		Aile: function() { guiParam.etape = 3;  },
		Helice: function() { guiParam.etape = 4;  },
		Save: function(){ saveScene(sceneThreeJs.sceneGraph); },
		ExportOBJ: function(){ exportOBJ(sceneThreeJs.objects); },
		ExportOBJ: function(){ exportOBJ(sceneThreeJs.objects); },
    };

    const updateFunc = function() { updatedGui(guiParam,sceneThreeJs); };

    const gui = new dat.GUI();

    gui.add( etapeType, "Ballon").onFinishChange(updateFunc);
    gui.add( etapeType, "Cabine").onFinishChange(updateFunc);
	gui.add( etapeType, "Aile").onFinishChange(updateFunc);
	gui.add( etapeType, "Helice").onFinishChange(updateFunc);

	gui.add( etapeType, "Save");
	gui.add( etapeType, "ExportOBJ");
}

function saveScene(sceneGraph,createdObjects) {
    download( JSON.stringify(sceneGraph), "save_scene.js" );
}

function download(text, name) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

function exportOBJ(createdObjects) {
    console.log(createdObjects);
    let stringOBJ = "";
    let offset = 0;

    for( const k in createdObjects ) {
			for( const l in createdObjects[k] ){
				if(createdObjects[0][k]!=null){

		        // *************************************** //
		        // Applique préalablement la matrice de transformation sur une copie des sommets du maillage
		        // *************************************** //
		        createdObjects[0][k].updateMatrix();
		        const matrix = createdObjects[0][k].matrix;

		        const toExport = createdObjects[0][k].geometry.clone();
		        toExport.applyMatrix( matrix );


		        // *************************************** //
		        // Exporte les sommets et les faces
		        // *************************************** //
		        if( toExport.vertices!==undefined && toExport.faces!==undefined ) {

		            const vertices = toExport.vertices;
		            const faces = toExport.faces;

		            for( const k in vertices ) {
		                const v = vertices[k];
		                stringOBJ += "v "+ v.x+ " "+ v.y+ " "+ v.z+ "\n";
		            }

		            for( const k in faces  ) {
		                const f = faces[k];

		                // Les faces en OBJ sont indexés à partir de 1
		                const a = f.a + 1 + offset;
		                const b = f.b + 1 + offset;
		                const c = f.c + 1 + offset;

		                stringOBJ += "f "+ a+ " "+ b+ " "+ c+ "\n"
		            }

		            offset += vertices.length;
		        }
					}
				}
    }

    download( stringOBJ, "save_scene.obj" );

}

// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    sceneThreeJs.camera = sceneInit.createCamera(0,0,1);
	sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));

    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(1,2,2));

	sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera );
	sceneThreeJs.controls.enabled=false;

	sceneThreeJs.renderer = new THREE.WebGLRenderer( { antialias: true,alpha:false } );
	sceneThreeJs.renderer.setPixelRatio( window.devicePixelRatio );
	sceneThreeJs.renderer.setClearColor(0xeeeeee,1.0);
	sceneThreeJs.renderer.setSize(window.innerWidth,window.innerHeight);
    const baliseHtml = document.querySelector("#AffichageScene3D");
	baliseHtml.appendChild(sceneThreeJs.renderer.domElement);

	const planeXYGeometry = primitive.Quadrangle(Vector3(-2,-2,0), Vector3(2,-2,0), Vector3(2,2,0), Vector3(-2,2,0));
	paintDatas.xy.plane = new THREE.Mesh( planeXYGeometry);

	const planeXZGeometry = primitive.Quadrangle(Vector3(-2,0,-2), Vector3(-2,0,2), Vector3(2,0,2), Vector3(2,0,-2));
	paintDatas.xz.plane = new THREE.Mesh( planeXZGeometry);

	var geometry = new THREE.Geometry();
	geometry.vertices.push(new Vector3(0,0,0));
	var line = new THREE.Line(geometry, material);
	paintDatas.lengthline = line;
	sceneThreeJs.sceneGraph.add(line);

	const cylinderGeometry = new THREE.CylinderBufferGeometry( 0.15, 0.15, 0.4, 32 );
    const cylinder = new THREE.Mesh( cylinderGeometry, MaterialRGB(0.9,0.9,0.9) );
    cylinder.geometry.rotateX(Math.PI/2.0);
    cylinder.position.set(0,0,0);

	const vectorPoints2 = [];
    vectorPoints2.push( Vector2(0, -0.1) );
    vectorPoints2.push( Vector2(0.5, -0.2) );
	vectorPoints2.push( Vector2(2, -0.1) );
    vectorPoints2.push( Vector2(2, 0.1) );
    vectorPoints2.push( Vector2(0.5, 0.2) );
    vectorPoints2.push( Vector2(0, 0.1) );
    vectorPoints2.push( Vector2(-0.5, 0.2) );
    vectorPoints2.push( Vector2(-2, 0.1) );
    vectorPoints2.push( Vector2(-2, -0.1) );
    vectorPoints2.push( Vector2(-0.5, -0.2) );
    var curvepale = new THREE.CatmullRomCurve3(vectorPoints2, true);
    var pointspale=curvepale.getPoints(500);
    const curveShapepale = new THREE.Shape(vectorPoints2);
    const extrudeSettings2 = { amount:0.03 , bevelEnabled:false };
    const extrudeGeometry2 = new THREE.ExtrudeBufferGeometry( curveShapepale, extrudeSettings2 );
	const pale1 = new THREE.Mesh( extrudeGeometry2, meshmaterial)
    pale1.position.set(0,0,0.15);

    //Création des trois autres pales
    const pale2Geometry=extrudeGeometry2.clone();
    const pale2 = new THREE.Mesh( pale2Geometry, meshmaterial ) ;
    pale2.geometry.rotateZ(Math.PI/2.0);
    pale2.position.set(0,0,0.15);

	var group = new THREE.Object3D();
	group.add(cylinder);
	group.add(pale1);
	group.add(pale2);
	group.scale.set(0.02,0.02,0.02);
	sceneThreeJs.helice=group;

	const wrapperMouseDown = function(event) { onMouseDown(event); };
    document.addEventListener( 'mousedown', wrapperMouseDown );

	const wrapperMouseMove = function(event) { onMouseMove(event); };
    document.addEventListener( 'mousemove', wrapperMouseMove );

	const wrapperMouseRelease = function(event) { onMouseRelease(event); };
    document.addEventListener( 'mouseup', wrapperMouseRelease );

	const wrapperKeyUp = function(event) { onKeyUp(event); };
    document.addEventListener( 'keyup', wrapperKeyUp );

	const wrapperKeyDown = function(event) { onKeyDown(event); };
    document.addEventListener( 'keydown', wrapperKeyDown );

	const wrapperWheel = function(event) { onWheel(event); };
    document.addEventListener( 'wheel', wrapperWheel );
	// For Chrome
	document.addEventListener('mousewheel', wrapperWheel);
	// For Firefox
	document.addEventListener('DOMMouseScroll', wrapperWheel);

	render(sceneThreeJs);
}



// Fonction appelée lors du redimensionnement de la fenetre
function onResize(sceneThreeJs) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneThreeJs.camera.aspect = width / height;
    sceneThreeJs.camera.updateProjectionMatrix();

    sceneThreeJs.renderer.setSize(width, height);
	render(sceneThreeJs);
}

function onKeyDown(event) {
	if(guiParam.etape==1){
		onKeyDownBallon(event);
	}else if(guiParam.etape==2){
		onKeyDownCabine(event);
	}else if(guiParam.etape==3){
		onKeyDownAile(event);
	}else if(guiParam.etape==4){
		onKeyDownHelice(event);
	}
}

function onKeyUp(event) {
	if(guiParam.etape==1){
		onKeyUpBallon(event);
	}else if(guiParam.etape==2){
		onKeyUpCabine(event);
	}else if(guiParam.etape==3){
		onKeyUpAile(event);
	}else if(guiParam.etape=4){
		onKeyUpHelice(event);
	}
}

function onMouseDown(event) {
	if(guiParam.etape==1){
		onMouseDownBallon(event);
	}else if(guiParam.etape==2){
		onMouseDownCabine(event);
	}else if(guiParam.etape==3){
		onMouseDownAile(event);
	}else if(guiParam.etape==4){
		onMouseDownHelice(event);
	}
}

function onMouseMove(event) {
	if(guiParam.etape==1){
		onMouseMoveBallon(event);
	}else if(guiParam.etape==2){
		onMouseMoveCabine(event);
	}else if(guiParam.etape==3){
		onMouseMoveAile(event);
	}else if(guiParam.etape==4){
		onMouseMoveHelice(event);
	}
}

function onMouseRelease(event) {
	if(guiParam.etape==1){
		onMouseReleaseBallon(event);
	}else if(guiParam.etape==2){
		onMouseReleaseCabine(event);
	}else if(guiParam.etape==3){
		onMouseReleaseAile(event);
	}
}

function onWheel(event) {
	if(guiParam.etape==2){
		onWheelCabine(event);
	}else if(guiParam.etape==3){
		onWheelAile(event);
	}else if(guiParam.etape==4){
		onWheelHelice(event);
	}
}

/*------------------Ballon---------------*/

function cameraPos(view){
	paintDatas.view=view;
	if(view==="XY"){
		sceneThreeJs.camera.position.set(0,0,1);
		sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
		paintDatas.lengthline.visible = false;
		render(sceneThreeJs);
	}else{
		sceneThreeJs.camera.position.set(0,1,0);
		sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
		paintDatas.lengthline.visible = true;
		render(sceneThreeJs);
	}
}

function onKeyDownBallon(event){
	if(paintDatas.view==="XY"){
		var paintData = paintDatas.xy;
	}
	else{
		var paintData = paintDatas.xz;
	}
	if(event.keyCode==38){
		if(paintData.object!=null){
			paintData.object.geometry.center();
			paintData.geoEx.center();

			paintData.object.geometry.computeBoundingBox();
			var newgeometry = new THREE.Geometry();
			newgeometry.vertices.push(new THREE.Vector3(-paintData.object.geometry.boundingBox.getSize().x/2, 0, 0 ),new THREE.Vector3( paintData.object.geometry.boundingBox.getSize().x/2, 0, 0 ),);
			paintDatas.lengthline.geometry=newgeometry;
		}
		cameraPos("XZ");
	}else if(event.keyCode==40){
		cameraPos("XY");
	}else if ( event.ctrlKey ) {
		paintDatas.paint = false;
		sceneThreeJs.controls.enabled = true;
		paintDatas.lengthline.visible = false;
		render(sceneThreeJs);
	}else if (event.keyCode==13) {
		if(paintDatas.xy.geoEx!=null && paintDatas.xz.geoEx!=null){
			const mesh = intersect(paintDatas.xy.geoEx,paintDatas.xz.geoEx);
			paintDatas.xy.object.visible=false;
			paintDatas.xz.object.visible=false;
			paintDatas.lengthline.visible=false;
			//mesh.geometry.computeFaceNormals();
			//mesh.geometry.computeVertexNormals();
			//var edges = new THREE.EdgesGeometry(mesh.geometry,90);
			//var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xff0000}));
			//sceneThreeJs.sceneGraph.add(line);
			sceneThreeJs.sceneGraph.add( mesh );
			render(sceneThreeJs);
			sceneThreeJs.objects[0][0]= mesh;
		}
	}
}

function onKeyUpBallon(event){
	if ( event.ctrlKey === false ) {
		if(paintDatas.view==="XY"){
			var paintData = paintDatas.xy;
		}
		else{
			var paintData = paintDatas.xz;
		}
		paintDatas.paint = true;
		sceneThreeJs.controls.enabled = false;
		cameraPos(paintDatas.view);
	}
}

function onMouseDownBallon(event){
	if(paintDatas.view==="XY"){
		var paintData = paintDatas.xy;
	}
	else{
		var paintData = paintDatas.xz;
	}

	if(paintDatas.paint){
		// Coordonnées du clic de souris en pixel
		const xPixel = event.clientX;
		const yPixel = event.clientY;
		var point = RayProj(paintData.plane,xPixel,yPixel);

		if(paintData.object==null || RayIntersect(point)){

			if(paintData.object!=null || paintDatas.view==="XY"){
				paintDatas.mousePressed=true;

				var geometry = new THREE.Geometry();
				geometry.vertices.push(point);
				var line = new THREE.Line(geometry, material);
				sceneThreeJs.sceneGraph.add(line);

				var curve = new THREE.SplineCurve([point]);
				var pointspline = curve.getPoints(100);
				var geometryspline = new THREE.BufferGeometry().setFromPoints(pointspline);
				var spline = new THREE.Line(geometryspline, material);
				sceneThreeJs.sceneGraph.add(spline);

				paintData.tracePoints.push(point);
				paintData.endPoints.push(point);

				paintData.line=line;
				paintData.spline=spline;
			}else{
				paintDatas.mousePressed=true;

				var geometry = new THREE.Geometry();
				var line = new THREE.Line(geometry, material);
				sceneThreeJs.sceneGraph.add(line);

				var spline = new THREE.Line(geometry, material);
				sceneThreeJs.sceneGraph.add(spline);

				paintData.line=line;
				paintData.spline=spline;

				paintData.side=point.z;
			}
			render(sceneThreeJs);
		}
	}
}

function onMouseMoveBallon(event){
	if(paintDatas.view==="XY"){
		var paintData = paintDatas.xy;
	}
	else{
		var paintData = paintDatas.xz;
	}
	if(paintDatas.mousePressed && paintDatas.paint){
		// Coordonnées du clic de souris en pixel
		const xPixel = event.clientX;
		const yPixel = event.clientY;

		var point = RayProj(paintData.plane,xPixel,yPixel);

		if(paintDatas.view==="XZ"){
			if(paintData.side*point.z<=0){
				paintData.go=paintData.go+1;
				paintData.side=point.z;
				paintData.endPoints.push(new Vector3(point.x,0,0));
			}
		}

		if(paintData.object!=null || paintDatas.view==="XY" || paintData.go==1){

			paintData.tracePoints.push(point);

			if(paintData.endPoints.length > 3 && point.distanceTo(paintData.endPoints[0])<0.02){

				var newgeometry = new THREE.Geometry();
				newgeometry.vertices.push(point);
				paintData.line.geometry = newgeometry;

				paintData.endPoints.push(point);
				if(paintDatas.view==="XZ"){
					paintData.endPoints.unshift(new Vector3(point.x,0,-point.z));
				}

				var curve = new THREE.CatmullRomCurve3(paintData.endPoints);
				var pointspline = curve.getPoints(300*paintData.endPoints.length);
				var geometryspline = new THREE.BufferGeometry().setFromPoints(pointspline);
				paintData.spline.geometry = geometryspline;

				from2Dto3D(paintData.endPoints);

				paintData.tracePoints=[];
				paintData.endPoints = [];

				paintDatas.mousePressed=false;

			}else if(paintData.tracePoints.length<paintData.lenght){
				var line = paintData.line;

				var oldgeometry = line.geometry;
				var newgeometry = new THREE.Geometry();
				newgeometry.vertices = oldgeometry.vertices;
				newgeometry.vertices.push(point);
				line.geometry = newgeometry;

			}else if(prod_scal2cos(paintData.tracePoints[0],paintData.tracePoints[paintData.lenght/2-1],paintData.tracePoints[paintData.tracePoints.length - paintData.lenght/2-1],paintData.tracePoints[paintData.tracePoints.length-1])>0.98){

				var line = paintData.line;
				var oldgeometry = line.geometry;
				var newgeometry = new THREE.Geometry();
				newgeometry.vertices = oldgeometry.vertices;
				newgeometry.vertices.push(point);
				line.geometry = newgeometry;

				if(paintData.lenght<20){
					paintData.lenght=paintData.lenght+2;
				}

			}else{
				var line = paintData.line;
				var newgeometry = new THREE.Geometry();
				newgeometry.vertices.push(point);
				line.geometry = newgeometry;

				paintData.endPoints.push(point);
				if(paintDatas.view==="XZ"){
					paintData.endPoints.unshift(new Vector3(point.x,0,-point.z));
				}

				var curve = new THREE.CatmullRomCurve3(paintData.endPoints);
				var pointspline = curve.getPoints(300*paintData.endPoints.length);
				var geometryspline = new THREE.BufferGeometry().setFromPoints(pointspline);
				paintData.spline.geometry = geometryspline;

				paintData.tracePoints=[];

				paintData.tracePoints.push(point);
			}
		}else if(paintData.go==2){
			var curve = new THREE.CatmullRomCurve3(paintData.endPoints,true);
			var pointspline = curve.getPoints(300*paintData.endPoints.length);
			var geometryspline = new THREE.BufferGeometry().setFromPoints(pointspline);
			paintData.spline.geometry = geometryspline;

			from2Dto3D(paintData.endPoints);

			paintData.tracePoints=[];
			paintData.endPoints = [];

			paintDatas.mousePressed=false;
		}
	}
	render(sceneThreeJs);
}

function onMouseReleaseBallon(event){
	if(paintDatas.view==="XY"){
		var paintData = paintDatas.xy;
	}
	else{
		var paintData = paintDatas.xz;
	}

	if(paintDatas.mousePressed && paintDatas.paint){
		const xPixel = event.clientX;
		const yPixel = event.clientY;

		var point = RayProj(paintData.plane,xPixel,yPixel);

		paintData.tracePoints.push(point);
		paintData.endPoints.push(point);
		if(paintDatas.view==="XZ"){
			paintData.endPoints.unshift(new Vector3(point.x,0,0));
		}

		var curve = new THREE.CatmullRomCurve3(paintData.endPoints,true);
		var pointspline = curve.getPoints(300*paintData.endPoints.length);
		var geometryspline = new THREE.BufferGeometry().setFromPoints(pointspline);
		paintData.spline.geometry = geometryspline;

		paintDatas.mousePressed=false;

		if(paintData.object==null){
			if(paintDatas.view=="XY" || paintData.go==2){
				from2Dto3D(paintData.endPoints);
			}
			else{
				sceneThreeJs.sceneGraph.remove(paintData.line);
				sceneThreeJs.sceneGraph.remove(paintData.spline);
				paintDatas.xz.side=null;
				paintDatas.xz.go=0;
			}
		}else if(RayIntersect(point)){
			from2Dto3D(paintData.endPoints);
		}else{
			sceneThreeJs.sceneGraph.remove(paintData.line);
			sceneThreeJs.sceneGraph.remove(paintData.spline);
			paintDatas.xz.side=null;
			paintDatas.xz.go=0;
		}

		paintData.endPoints = [];
	}

	render(sceneThreeJs);
}

function prod_scal2cos(a,b,c,d){
	return ((a.x-b.x)*(c.x-d.x)+(a.y-b.y)*(c.y-d.y)+(a.z-b.z)*(c.z-d.z))/(Math.pow((Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2))*(Math.pow(c.x-d.x,2)+Math.pow(c.y-d.y,2)+Math.pow(c.z-d.z,2)),0.5));
}

function from2Dto3D(points){
	const material = new THREE.MeshBasicMaterial({color:0x000000, side: THREE.DoubleSide});
	if(paintDatas.view==="XY"){
		var paintData = paintDatas.xy;
	}
	else{
		var paintData = paintDatas.xz;
	}

	var curve = new THREE.CatmullRomCurve3(points, true);
	var pointspline = curve.getPoints(15*points.length);

	if(paintDatas.view==="XZ"){
		//obligé car Shape ne fonctionne que sur XY...
		const rot = new THREE.Euler(Math.PI/2, 0, 0);
		for(var i=0; i<pointspline.length; i++){
			pointspline[i].applyEuler(rot);
		}
	}
	const curveShape = new THREE.Shape(pointspline);
    const geometry = new THREE.ShapeGeometry( curveShape );
	const extrudegeo = new THREE.ExtrudeGeometry(curveShape,{amount:1, bevelEnabled: false});

	if(paintData.object!=null){
		if(paintDatas.view==="XZ"){
			paintData.object.rotateX(Math.PI/2);
			paintData.geoEx.rotateX(Math.PI/2);
			paintData.geoEx.translate(0,0,paintData.geoEx.boundingBox.getSize().z/2);
		}
		paintData.object.updateMatrix();
		geometry.merge(paintData.object.geometry,paintData.object.matrix);
		paintData.object.geometry = geometry;

		paintData.geoEx=merge(extrudegeo,paintData.geoEx);
	}else{
		const object = new THREE.Mesh(geometry, material);
		paintData.object=object;

		paintData.geoEx=extrudegeo;
	}
	if(paintDatas.view==="XZ"){
		paintData.object.rotateX(-Math.PI/2);
		paintData.geoEx.rotateX(-Math.PI/2);
	}

	if(paintDatas.view==="XZ"){
		paintDatas.xy.object.geometry.computeBoundingBox();
		paintData.object.geometry.computeBoundingBox();
		const r = paintDatas.xy.object.geometry.boundingBox.getSize().x/paintDatas.xz.object.geometry.boundingBox.getSize().x
		paintData.object.geometry.scale(r,r,1);
		paintData.object.geometry.center();

		paintData.geoEx.scale(r,1,r);
		paintData.geoEx.center();
	}

	sceneThreeJs.sceneGraph.add( paintData.object );

	sceneThreeJs.sceneGraph.remove(paintData.line);
	sceneThreeJs.sceneGraph.remove(paintData.spline);

	render(sceneThreeJs);
}

function RayProj(plane,xPixel,yPixel){
	const x = 2*(xPixel/window.innerWidth)-1;
	const y = 1-2*(yPixel/window.innerHeight);

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(new THREE.Vector2(x,y), sceneThreeJs.camera);
	var hits = raycaster.intersectObject(plane,true);
	return hits[0].point;
}

function RayIntersect(point){
	const raycaster = new THREE.Raycaster();
	if(paintDatas.view==="XY"){
		raycaster.set(new Vector3(point.x,point.y,-1),new THREE.Vector3(0,0,1));
		var paintData = paintDatas.xy;
	}
	else{
		raycaster.set(new Vector3(point.x,-1,point.z),new THREE.Vector3(0,1,0));
		var paintData = paintDatas.xz;
	}
	var hits = raycaster.intersectObject(paintData.object,true);
	return hits.length>0;
}

function intersect(geoa,geob){
	var xy = new ThreeBSP( geoa);
	var xz = new ThreeBSP( geob);
	const intersect = xy.intersect(xz);
	const material = new THREE.MeshPhongMaterial( {color:0xaaffff} );
	const mesh = intersect.toMesh(material);
	mesh.castShadow = true;
	return mesh;
}

function merge(geoa,geob){
	var xy = new ThreeBSP( geoa);
	var xz = new ThreeBSP( geob);
	const merge = xy.union(xz);
	const mesh = merge.toMesh(meshmaterial);
	return mesh.geometry;
}

/*----------------Cabine---------------*/


function initCabine(){
	if(sceneThreeJs.objects[0][0]!=null){
		const circle = new THREE.Mesh( new THREE.CircleGeometry( 0.01, 32 ), new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
		sceneThreeJs.sceneGraph.add( circle );
		circle.visible=false;
		circle.name="circle";
		moveData.circle=circle;

		sceneThreeJs.objects[0][0].geometry.computeBoundingBox();
		const sizex= (sceneThreeJs.objects[0][0].geometry.boundingBox.max.x-sceneThreeJs.objects[0][0].geometry.boundingBox.min.x)/4;
		const sizey= (sceneThreeJs.objects[0][0].geometry.boundingBox.max.y-sceneThreeJs.objects[0][0].geometry.boundingBox.min.y)/3;
		const z = sceneThreeJs.objects[0][0].geometry.boundingBox.max.z;
		moveData.pointsABouger.push(new Vector3(-sizex,sceneThreeJs.objects[0][0].geometry.boundingBox.min.y,z));
		moveData.pointsABouger.push(new Vector3(sizex,sceneThreeJs.objects[0][0].geometry.boundingBox.min.y,z));
		moveData.pointsABouger.push(new Vector3(sizex,sceneThreeJs.objects[0][0].geometry.boundingBox.min.y-sizey,z));
		moveData.pointsABouger.push(new Vector3(-sizex,sceneThreeJs.objects[0][0].geometry.boundingBox.min.y-sizey,z));
		moveData.pointsABouger.push(new Vector3(-sizex,sceneThreeJs.objects[0][0].geometry.boundingBox.min.y,z));

		const geometry2 = new THREE.Geometry();
		geometry2.setFromPoints(moveData.pointsABouger);
		moveData.line=new THREE.Line(geometry2, material);
		sceneThreeJs.sceneGraph.add(moveData.line);

		const pointsMaterial = new THREE.PointsMaterial( {color: 0xFF582A, size: 5, sizeAttenuation: false} );
		moveData.pt = new THREE.Points(geometry2,pointsMaterial);
		sceneThreeJs.sceneGraph.add(moveData.pt);

		for (var i=0; i<geometry2.length-1;i++){
			var point1=moveData.pointsABouger[i];
			var point2=moveData.pointsABouger[i+1];
			var ligne=new THREE.Line3(point1,point2);
			moveData.tabline.push(ligne);
		}

		moveData.H=moveData.pointsABouger[0];
		if(sceneThreeJs.objects[0][0].geometry.boundingBox.max.z-sceneThreeJs.objects[0][0].geometry.boundingBox.min.z-0.05>0){
			moveData.large=sceneThreeJs.objects[0][0].geometry.boundingBox.max.z-sceneThreeJs.objects[0][0].geometry.boundingBox.min.z-0.05;
		}else{
			moveData.large=sceneThreeJs.objects[0][0].geometry.boundingBox.max.z-sceneThreeJs.objects[0][0].geometry.boundingBox.min.z;
		}
	}
}

function onMouseDownCabine(event) {
    // Coordonnées du clic de souris en pixel
    const xPixel = event.clientX;
    const yPixel = event.clientY;
	if(moveData.paint){
		var point = RayProj3(sceneThreeJs.objects[0][0].geometry.boundingBox.max.z,xPixel,yPixel);

		// Recherche si la souris est proche d'un des points existants
		if(isInsidePolygon(point,moveData.line)){
			moveData.move=true;
			moveData.lastPos=point;
		}

		moveData.pointEnSelection=false;
		if(!moveData.ctrl && point!=null){
			for (var i=0; i < moveData.pointsABouger.length;i++){
				const pts=moveData.pointsABouger[i];
				if ((point.x-pts.x)*(point.x-pts.x)+(point.y-pts.y)*(point.y-pts.y) < (moveData.radius+0.005)*(moveData.radius+0.005)) {
					moveData.bouge[i]=true;
					moveData.pointEnSelection=true;
					moveData.move=false;
				}
				else{
					moveData.bouge[i]=false;
				}
			}
		}

		//recherche si la souris est sur un segment à partir du tableau des lignes :
		//1) Regarde dans le tableau des lignes si le point H est sa propre projection
		//2)Si oui, et que le cercle est visible, un nouveau point est crée
		if (!moveData.pointEnSelection && !moveData.ctrl && point!=null){
			for(var i=1;i<moveData.tabline.length;i++){
				var trav=moveData.tabline[i].closestPointToPoint(moveData.H)
				if(moveData.H.x==trav.x && moveData.H.y==trav.y && moveData.circle.visible==true){
					moveData.circle.material.color.set(0x66ff66);
					moveData.pointsABouger=insert(moveData.pointsABouger,moveData.H,i+1);

					var newgeometry = new THREE.Geometry();
					newgeometry.vertices = moveData.pointsABouger;
					moveData.line.geometry = newgeometry;
					moveData.pt.geometry = newgeometry;
					moveData.move=false;
				}
			}
		}

		//suppression de point
		if(moveData.ctrl && point!=null){
			for (var i=2; i < moveData.pointsABouger.length-1;i++){
				const pts=moveData.pointsABouger[i];
				if ((point.x-pts.x)*(point.x-pts.x)+(point.y-pts.y)*(point.y-pts.y) < (moveData.radius+0.005)*(moveData.radius+0.005) ) {
					moveData.pointsABouger.splice(i,1);

					var newgeometry = new THREE.Geometry();
					newgeometry.vertices = moveData.pointsABouger;
					moveData.line.geometry = newgeometry;
					moveData.pt.geometry = newgeometry;
				}
			}
			moveData.move=false;
		}

		moveData.pt.geometry.vertices=moveData.pointsABouger;
	}else if(!moveData.paint && !moveData.ctrl){
		var point = RayProj3(sceneThreeJs.objects[0][0].geometry.boundingBox.max.z,xPixel,yPixel);
		if(isInsidePolygon(point,moveData.line)){
			moveData.pickingData.pickable=true;
			moveData.lastPos=point;
		}
	}
	render(sceneThreeJs);
}

function onMouseReleaseCabine(event) {

	moveData.pointEnSelection=false;
	moveData.move=false;
	for (var i=0;i<moveData.bouge.length;i++){
		moveData.bouge[i]=false;
	}
	moveData.tabline=[];
	for (var j=0; j<moveData.pointsABouger.length-1;j++){
		var point1=moveData.pointsABouger[j];
		var point2=moveData.pointsABouger[j+1];
		moveData.tabline.push(new THREE.Line3(point1,point2 ));
	}
	if(!moveData.paint){
		moveData.pickingData.pickable=false;
	}
	render(sceneThreeJs);
}

function onMouseMoveCabine(event) {
    const xPixel = event.clientX;
    const yPixel = event.clientY;

	if(moveData.paint){
		var point = RayProj3(sceneThreeJs.objects[0][0].geometry.boundingBox.max.z,xPixel,yPixel);
		//parcours des booléens associés auc points
		if(moveData.move && point!=null){
			for(var i=0; i<moveData.pointsABouger.length;i++){
				var trans = new THREE.Vector3(point.x-moveData.lastPos.x,point.y-moveData.lastPos.y,0);
				moveData.pointsABouger[i].add(trans);
			}
			moveData.lastPos=point;
		}else if(point!=null){
			for (var i=0;i<moveData.bouge.length;i++){
				if (moveData.bouge[i]) {
					if(i==0 || i==1 || i==moveData.bouge.length-1){
						moveData.pointsABouger[i].x=point.x;
					}
					else{
						moveData.pointsABouger[i].x=point.x;
						moveData.pointsABouger[i].y=point.y;
					}
				}
			}

			var troploin=true;

			for(var i=1;i<moveData.tabline.length;i++){
				const li=moveData.tabline[i];
				var proj=li.closestPointToPoint(Vector3(point.x,point.y,0),true);
				const dist1=Math.pow(point.x-proj.x,2)+Math.pow(point.y-proj.y,2);
				const dist2=Math.pow(dist1,0.5);
				if(Math.abs(dist2)<0.005){
					moveData.circle.visible=true;
					moveData.circle.position.set(proj.x,proj.y,proj.z);
					moveData.H=proj;
					troploin=false;
				}
			}

			if (troploin) {
				moveData.circle.visible=false;
			}
			troploin=true;

			if (moveData.pointEnSelection){
				moveData.circle.material.color.set(0x66ff66);
			}else{
				moveData.circle.material.color.set(0xffff00);
			}

			//couleur du cercle
			for (var i=0; i < moveData.pointsABouger.length;i++){
				const pts=moveData.pointsABouger[i];
				if ( (point.c-pts.x)*(point.x-pts.x)+(point.y-pts.y)*(point.y-pts.y) < (moveData.radius+0.005)*(moveData.radius+0.005) ) {
					moveData.circle.material.color.set(0x66ff66);
				}
			}

		}
		var newgeometry = new THREE.Geometry();
		newgeometry.vertices = moveData.pointsABouger;
		moveData.line.geometry = newgeometry;
		moveData.pt.geometry = newgeometry;
	}else if(!moveData.paint && moveData.pickingData.pickable && !moveData.ctrl){
		var point = RayProj3(sceneThreeJs.objects[0][0].geometry.boundingBox.max.z,xPixel,yPixel);
		if(point!=null){
			for(var i=0; i<moveData.pointsABouger.length;i++){
				var trans = new THREE.Vector3(point.x-moveData.lastPos.x,point.y-moveData.lastPos.y,0);
				moveData.pointsABouger[i].add(trans);
			}
			var newgeometry = new THREE.Geometry();
			newgeometry.vertices = moveData.pointsABouger;
			moveData.line.geometry = newgeometry;
			moveData.pt.geometry = newgeometry;
			sceneThreeJs.objects[1][moveData.i].translateX(point.x-moveData.lastPos.x);
			sceneThreeJs.objects[1][moveData.i].translateY(point.y-moveData.lastPos.y);
			moveData.lastPos=point;
		}
	}
	render(sceneThreeJs);
}

function onKeyDownCabine(event) {
    const keyCode = event.code;
    if(event.ctrlKey){
		moveData.ctrl=true;
		if(!moveData.paint){
			sceneThreeJs.controls.enabled=true;
			moveData.pickingData.pickable=false;
		}
    }else if (event.keyCode==13) {
		if(sceneThreeJs.objects[1][moveData.i]===null){
			moveData.paint=false;
			createCabine();
			moveData.pickingData.pickable=false;
			moveData.circle.visible=false;
		}else{
			sceneThreeJs.sceneGraph.remove(sceneThreeJs.objects[1][moveData.i]);
			sceneThreeJs.objects[1][moveData.i]=null;
			sceneThreeJs.sceneGraph.add(moveData.line);
			sceneThreeJs.sceneGraph.add(moveData.pt);
			moveData.paint=true;
			sceneThreeJs.camera.position.set(0,0,1);
			sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
		}
	}else if(event.keyCode==107){
		sceneThreeJs.camera.position.set(0,0,sceneThreeJs.camera.position.z-0.1);
		render(sceneThreeJs);
	}else if(event.keyCode==109){
		sceneThreeJs.camera.position.set(0,0,sceneThreeJs.camera.position.z+0.1);
		render(sceneThreeJs);
	}else if(event.keyCode==40){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y+0.1,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==38){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y-0.1,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==39){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x-0.1,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==37){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x+0.1,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==32){
		if(sceneThreeJs.objects[2][moveData.i]===null){
			createCabine();
		}
		moveData.pointsABouger=[],
		moveData.bouge=[],
		moveData.tabline=[],
		moveData.line= null,
		moveData.pt=null,
		moveData.pointEnSelection=false,
		moveData.H=null,
		moveData.ctrl=false,
		moveData.move=false,
		moveData.lastPos=null,
		moveData.large=0,
		moveData.i++;
		sceneThreeJs.objects[1].push(null);
		initCabine();
		moveData.paint=true;
		sceneThreeJs.camera.position.set(0,0,1);
		sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
	}else if(event.keyCode==90){
		if(moveData.ctrl){
			if(sceneThreeJs.objects[1].length>=2){
				sceneThreeJs.sceneGraph.remove(sceneThreeJs.objects[1][sceneThreeJs.objects[1].length-2]);
				sceneThreeJs.objects[1][sceneThreeJs.objects[1].length-2]=null;
				sceneThreeJs.objects[1].pop();
			}
		}
	}
	render(sceneThreeJs);
}

function onKeyUpCabine(event) {
	const keyCode = event.code;
	moveData.ctrl=false;
	sceneThreeJs.controls.enabled=false;
}

function onWheelCabine(event) {
	if(!moveData.ctrl && !moveData.paint){
		var delta = event.wheelDelta ? event.wheelDelta : -event.detail;
		if(delta>0){
			moveData.large+=0.01;
		}else if(delta<0){
			if(moveData.large-0.01>0){
				moveData.large=moveData.large-0.01;
			}
		}
		sceneThreeJs.sceneGraph.remove(sceneThreeJs.objects[1][moveData.i]);
		sceneThreeJs.objects[1][moveData.i]=null;
		createCabine();
	}
}

function isInsidePolygon(point,line){
	if(point!=null){
		const raycaster = new THREE.Raycaster();
		raycaster.set(new Vector3(point.x,point.y,0),new THREE.Vector3(0,1,0));
		var hits = raycaster.intersectObject(line,true);
		return hits.length>=2;
	}else{
			return false;
	}
}

function insert(tab,a,i){
    var t=[];
    t=tab.slice(0,tab.length);
    t[i]=a;
    for(var j=i;j<tab.length;j++){
		t[j+1]=tab[j];
    }
    return t;
}

function RayProj3(height,xPixel,yPixel){
	const x = 2*(xPixel/window.innerWidth)-1;
	const y = 1-2*(yPixel/window.innerHeight);

	const planeXYGeometry = primitive.Quadrangle(Vector3(-2,-2,height), Vector3(2,-2,height), Vector3(2,2,height), Vector3(-2,2,height));

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(new THREE.Vector2(x,y), sceneThreeJs.camera);
	var hits = raycaster.intersectObject(new THREE.Mesh( planeXYGeometry),true);
	if(hits[0]!=null){
		return hits[0].point;
	}else{
		return null;
	}
}

function createCabine(){
	const cabShape = new THREE.Shape(moveData.pt.geometry.vertices);
	const extrudegeo = new THREE.ExtrudeGeometry(cabShape,{amount:moveData.large, bevelEnabled: false});
	const object = new THREE.Mesh(extrudegeo, meshmaterial);
	object.translateZ(-moveData.large/2);

	sceneThreeJs.objects[1][moveData.i]=object;
	sceneThreeJs.sceneGraph.add(sceneThreeJs.objects[1][moveData.i]);
	sceneThreeJs.sceneGraph.remove(moveData.line);
	sceneThreeJs.sceneGraph.remove(moveData.pt);

	render(sceneThreeJs);
}

/*----------------Ailes---------------*/

function initAile(){
	if(sceneThreeJs.objects[0][0]!=null && sceneThreeJs.objects[0][0]!=null){
		const circle = new THREE.Mesh( new THREE.CircleGeometry( 0.01, 32 ), new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
		sceneThreeJs.sceneGraph.add( circle );
		circle.visible=false;
		circle.name="circle";
		circle.rotateX(-Math.PI/2);
		moveData2.circle=circle;

		sceneThreeJs.objects[0][0].geometry.computeBoundingBox();
		sceneThreeJs.objects[1][0].geometry.computeBoundingBox();

		const sizex= (sceneThreeJs.objects[0][0].geometry.boundingBox.max.x-sceneThreeJs.objects[0][0].geometry.boundingBox.min.x)/10;
		const sizez= (sceneThreeJs.objects[0][0].geometry.boundingBox.max.z-sceneThreeJs.objects[0][0].geometry.boundingBox.min.z)*2;
		const y = sceneThreeJs.objects[1][0].geometry.boundingBox.max.y;
		moveData2.pointsABouger.push(new Vector3(-sizex,y,0));
		moveData2.pointsABouger.push(new Vector3(-sizex,y,-sizez));
		moveData2.pointsABouger.push(new Vector3(sizex,y,-sizez));
		moveData2.pointsABouger.push(new Vector3(sizex,y,0));
		moveData2.pointsABouger.push(new Vector3(sizex,y,sizez));
		moveData2.pointsABouger.push(new Vector3(-sizex,y,sizez));
		moveData2.pointsABouger.push(new Vector3(-sizex,y,0));

		const geometry2 = new THREE.Geometry();
		geometry2.setFromPoints(moveData2.pointsABouger);
		moveData2.line=new THREE.Line(geometry2, material);
		sceneThreeJs.sceneGraph.add(moveData2.line);

		const pointsMaterial = new THREE.PointsMaterial( {color: 0xFF582A, size: 5, sizeAttenuation: false} );
		moveData2.pt = new THREE.Points(geometry2,pointsMaterial);
		sceneThreeJs.sceneGraph.add(moveData2.pt);

		for (var i=0; i<geometry2.length-1;i++){
			var point1=moveData2.pointsABouger[i];
			var point2=moveData2.pointsABouger[i+1];
			var ligne=new THREE.Line3(point1,point2);
			moveData2.tabline.push(ligne);
		}

		moveData2.H=moveData2.pointsABouger[0];
		moveData2.large=0.01;
	}
}

function onMouseDownAile(event) {
    // Coordonnées du clic de souris en pixel
    const xPixel = event.clientX;
    const yPixel = event.clientY;
	if(moveData2.paint){
		var point = RayProj2(sceneThreeJs.objects[1][0].geometry.boundingBox.max.y,xPixel,yPixel);

		// Recherche si la souris est proche d'un des points existants
		if(isInsidePolygon2(point,moveData2.line)){
			moveData2.move=true;
			moveData2.lastPos=point;
		}
		moveData2.pointEnSelection=false;
		if(!moveData2.ctrl && point!=null){
			for (var i=0; i < moveData2.pointsABouger.length;i++){
				const pts=moveData2.pointsABouger[i];
				if ((point.x-pts.x)*(point.x-pts.x)+(point.z-pts.z)*(point.z-pts.z) < (moveData2.radius+0.005)*(moveData2.radius+0.005)) {
					moveData2.bouge[i]=true;
					moveData2.bouge[moveData2.pointsABouger.length-i-1]=true;

					moveData2.pointEnSelection=true;
					moveData2.move=false;
				}
				else{
					moveData2.bouge[i]=false;
				}
			}
		}

		//recherche si la souris est sur un segment à partir du tableau des lignes :
		//1) Regarde dans le tableau des lignes si le point H est sa propre projection
		//2)Si oui, et que le cercle est visible, un nouveau point est crée
		if (!moveData2.pointEnSelection && !moveData2.ctrl){
			for(var i=1;i<moveData2.tabline.length;i++){
				var trav=moveData2.tabline[i].closestPointToPoint(moveData2.H)
				if(moveData2.H.x==trav.x && moveData2.H.z==trav.z && moveData2.circle.visible==true){
					moveData2.circle.material.color.set(0x66ff66);
					moveData2.pointsABouger=insert(moveData2.pointsABouger,moveData2.H,i+1);
					if(i>moveData2.pointsABouger.length/2){
						moveData2.pointsABouger=insert(moveData2.pointsABouger,new Vector3(moveData2.H.x,moveData2.H.y,-moveData2.H.z),moveData2.pointsABouger.length-i-4);
					}else{
						moveData2.pointsABouger=insert(moveData2.pointsABouger,new Vector3(moveData2.H.x,moveData2.H.y,-moveData2.H.z),moveData2.pointsABouger.length-i-1);
					}
					var newgeometry = new THREE.Geometry();
					newgeometry.vertices = moveData2.pointsABouger;
					moveData2.line.geometry = newgeometry;
					moveData2.pt.geometry = newgeometry;
					moveData2.move=false;
				}
			}
		}

		//suppression de point
		if(moveData2.ctrl && point!=null){
			for (var i=2; i < moveData2.pointsABouger.length-1;i++){
				const pts=moveData2.pointsABouger[i];
				if ((point.x-pts.x)*(point.x-pts.x)+(point.z-pts.z)*(point.z-pts.z) < (moveData2.radius+0.005)*(moveData2.radius+0.005) ) {
					moveData2.pointsABouger.splice(i,1);
					if(i>moveData2.pointsABouger.length/2){
						moveData2.pointsABouger.splice(moveData2.pointsABouger.length-i-2,1);
					}else{
						moveData2.pointsABouger.splice(moveData2.pointsABouger.length-i-1,1);
					}

					var newgeometry = new THREE.Geometry();
					newgeometry.vertices = moveData2.pointsABouger;
					moveData2.line.geometry = newgeometry;
					moveData2.pt.geometry = newgeometry;
				}
			}
			moveData2.move=false;
		}

		moveData2.pt.geometry.vertices=moveData2.pointsABouger;
	}else if(!moveData2.paint && !moveData2.ctrl){
		var point = RayProj2(sceneThreeJs.objects[1][0].geometry.boundingBox.max.y,xPixel,yPixel);
		if(isInsidePolygon2(point,moveData2.line)){
			moveData2.pickingData.pickable=true;
			moveData2.lastPos=point;
		}
	}
	render(sceneThreeJs);
}

function onMouseReleaseAile(event) {

	moveData2.pointEnSelection=false;
	moveData2.move=false;
	for (var i=0;i<moveData2.bouge.length;i++){
		moveData2.bouge[i]=false;
	}
	moveData2.tabline=[];
	for (var j=0; j<moveData2.pointsABouger.length-1;j++){
		var point1=moveData2.pointsABouger[j];
		var point2=moveData2.pointsABouger[j+1];
		moveData2.tabline.push(new THREE.Line3(point1,point2 ));
	}
	if(!moveData2.paint){
		moveData2.pickingData.pickable=false;
	}
	render(sceneThreeJs);
}

function onMouseMoveAile(event) {
    const xPixel = event.clientX;
    const yPixel = event.clientY;

	if(moveData2.paint){
		var point = RayProj2(sceneThreeJs.objects[1][0].geometry.boundingBox.max.y,xPixel,yPixel);
		//parcours des booléens associés auc points
		if(moveData2.move && point!=null){
			for(var i=0; i<moveData2.pointsABouger.length;i++){
				var trans = new THREE.Vector3(point.x-moveData2.lastPos.x,0,0);
				moveData2.pointsABouger[i].add(trans);
			}
			moveData2.lastPos=point;
		}else if(point!=null){
			for (var i=0;i<moveData2.bouge.length;i++){
				if (moveData2.bouge[i]) {
					if(i==0 || i==1 || i==moveData2.bouge.length-1){
						moveData2.pointsABouger[i].x=point.x;
						moveData2.pointsABouger[moveData2.pointsABouger.length-i-1].x=point.x;
					}
					else{
						moveData2.pointsABouger[i].x=point.x;
						moveData2.pointsABouger[i].z=point.z;

						moveData2.pointsABouger[moveData2.pointsABouger.length-i-1].x=point.x;
						moveData2.pointsABouger[moveData2.pointsABouger.length-i-1].z=-point.z;
					}
				}
			}

			var troploin=true;

			for(var i=1;i<moveData2.tabline.length;i++){
				const li=moveData2.tabline[i];
				var proj=li.closestPointToPoint(Vector3(point.x,0,point.z),true);
				const dist1=Math.pow(point.x-proj.x,2)+Math.pow(point.z-proj.z,2);
				const dist2=Math.pow(dist1,0.5);
				if(Math.abs(dist2)<0.005){
					moveData2.circle.visible=true;
					moveData2.circle.position.set(proj.x,proj.y,proj.z);
					moveData2.H=proj;
					troploin=false;
				}
			}

			if (troploin) {
				moveData2.circle.visible=false;
			}
			troploin=true;

			if (moveData2.pointEnSelection){
				moveData2.circle.material.color.set(0x66ff66);
			}else{
				moveData2.circle.material.color.set(0xffff00);
			}

			//couleur du cercle
			for (var i=0; i < moveData2.pointsABouger.length;i++){
				const pts=moveData2.pointsABouger[i];
				if ( (point.c-pts.x)*(point.x-pts.x)+(point.z-pts.z)*(point.z-pts.z) < (moveData2.radius+0.005)*(moveData2.radius+0.005) ) {
					moveData2.circle.material.color.set(0x66ff66);
				}
			}

		}
		var newgeometry = new THREE.Geometry();
		newgeometry.vertices = moveData2.pointsABouger;
		moveData2.line.geometry = newgeometry;
		moveData2.pt.geometry = newgeometry;
	}else if(!moveData2.paint && moveData2.pickingData.pickable && !moveData2.ctrl){
		var point = RayProj2(sceneThreeJs.objects[1][0].geometry.boundingBox.max.y,xPixel,yPixel);
		if(point!=null){
			for(var i=0; i<moveData2.pointsABouger.length;i++){
				var trans = new THREE.Vector3(point.x-moveData2.lastPos.x,0,point.z-moveData2.lastPos.z);
				moveData2.pointsABouger[i].add(trans);
			}
			sceneThreeJs.objects[2][moveData2.i].translateX(point.x-moveData2.lastPos.x);
			sceneThreeJs.objects[2][moveData2.i].translateZ(-point.z+moveData2.lastPos.z);
			moveData2.lastPos=point;
			var newgeometry = new THREE.Geometry();
			newgeometry.vertices = moveData2.pointsABouger;
			moveData2.line.geometry = newgeometry;
			moveData2.pt.geometry = newgeometry;
		}
	}
	render(sceneThreeJs);
}

function onKeyDownAile(event) {
    const keyCode = event.code;
    if(event.ctrlKey){
		moveData2.ctrl=true;
		if(!moveData2.paint){
			sceneThreeJs.controls.enabled=true;
			moveData2.pickingData.pickable=false;
		}
    }else if (event.keyCode==13) {
		if(sceneThreeJs.objects[2][moveData2.i]===null){
			moveData2.paint=false;
			moveData2.circle.visible=false;
			createAile();
			moveData2.pickingData.pickable=false;
			sceneThreeJs.camera.position.set(0,0,1);
			sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
		}else{
			sceneThreeJs.sceneGraph.remove(sceneThreeJs.objects[2][moveData2.i]);
			sceneThreeJs.objects[2][moveData2.i]=null;
			sceneThreeJs.sceneGraph.add(moveData2.line);
			sceneThreeJs.sceneGraph.add(moveData2.pt);
			sceneThreeJs.camera.position.set(0,1,0);
			sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
			moveData2.paint=true;
		}
	}else if(event.keyCode==107){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y-0.1,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==109){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y+0.1,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==40){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z+0.1);
	}else if(event.keyCode==38){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z-0.1);
	}else if(event.keyCode==39){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x-0.1,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==37){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x+0.1,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==32){
		if(sceneThreeJs.objects[2][moveData2.i]===null){
			createAile();
		}
		moveData2.pointsABouger=[],
		moveData2.bouge=[],
		moveData2.tabline=[],
		moveData2.line= null,
		moveData2.pt=null,
		moveData2.pointEnSelection=false,
		moveData2.H=null,
		moveData2.ctrl=false,
		moveData2.move=false,
		moveData2.lastPos=null,
		moveData2.large=0,
		moveData2.i++;
		sceneThreeJs.objects[2].push(null);
		initAile();
		moveData2.paint=true;
		sceneThreeJs.camera.position.set(0,1,0);
		sceneThreeJs.camera.lookAt(new THREE.Vector3(0,0,0));
	}else if(event.keyCode==90){
		if(moveData2.ctrl){
			if(sceneThreeJs.objects[2].length>=2){
				sceneThreeJs.sceneGraph.remove(sceneThreeJs.objects[2][sceneThreeJs.objects[2].length-2]);
				sceneThreeJs.objects[2][sceneThreeJs.objects[2].length-2]=null;
				sceneThreeJs.objects[2].pop();
			}
		}
	}
	render(sceneThreeJs);
}

function onKeyUpAile(event) {
	const keyCode = event.code;
	moveData2.ctrl=false;
	sceneThreeJs.controls.enabled=false;
}

function onWheelAile(event) {
	if(!moveData2.ctrl && !moveData2.paint){
		var delta = event.wheelDelta ? event.wheelDelta : -event.detail;
		if(delta>0){
			moveData2.large+=0.01;
		}else if(delta<0){
			if(moveData2.large-0.01>0){
				moveData2.large=moveData2.large-0.01;
			}
		}
		sceneThreeJs.sceneGraph.remove(sceneThreeJs.objects[2][moveData2.i]);
		sceneThreeJs.objects[2][moveData2.i]=null;
		createAile();
	}
}

function isInsidePolygon2(point,line){
	if(point!=null){
		const raycaster = new THREE.Raycaster();
		raycaster.set(new Vector3(point.x,0,point.y),new THREE.Vector3(0,0,1));
		var hits = raycaster.intersectObject(line,true);
		return hits.length>=2;
	}else{
		return false;
	}
}

function RayProj2(height,xPixel,yPixel){
	const x = 2*(xPixel/window.innerWidth)-1;
	const y = 1-2*(yPixel/window.innerHeight);

	const planeXZGeometry = primitive.Quadrangle(Vector3(-2,height,-2), Vector3(-2,height,2), Vector3(2,height,2), Vector3(2,height,-2));

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(new THREE.Vector2(x,y), sceneThreeJs.camera);
	var hits = raycaster.intersectObject(new THREE.Mesh( planeXZGeometry),true);
	if(hits[0]!=null){
		return hits[0].point;
	}else{
		return null;
	}
}

function createAile(){
	const cabShape = new THREE.Shape(moveData2.pt.geometry.rotateX(Math.PI/2).vertices);
	const extrudegeo = new THREE.ExtrudeGeometry(cabShape,{amount:moveData2.large, bevelEnabled: false});
	const object = new THREE.Mesh(extrudegeo, meshmaterial);
	object.translateY(-moveData.large/2);
	object.rotateX(-Math.PI/2);
	moveData2.pt.geometry.rotateX(-Math.PI/2)

	sceneThreeJs.objects[2][moveData2.i]=object;
	sceneThreeJs.sceneGraph.add(sceneThreeJs.objects[2][moveData2.i]);
	sceneThreeJs.sceneGraph.remove(moveData2.line);
	sceneThreeJs.sceneGraph.remove(moveData2.pt);

	render(sceneThreeJs);
}

/*----------------Hélice---------------*/

function initHelice(){
	sceneThreeJs.sceneGraph.add(sceneThreeJs.helice);
	sceneThreeJs.helice.visible=false;
	render(sceneThreeJs);
}

function onMouseDownHelice(event) {
	if(!heliceData.ctrl && heliceData.ok){
		var helice = sceneThreeJs.helice.clone();
		sceneThreeJs.objects[3][sceneThreeJs.objects[3].length-1]=helice;
		sceneThreeJs.sceneGraph.add(sceneThreeJs.objects[3][sceneThreeJs.objects[3].length-1]);
		sceneThreeJs.objects[3].push(null);
	}
}

function onMouseMoveHelice(event) {
	if(!heliceData.ctrl){
		const xPixel = event.clientX;
		const yPixel = event.clientY;

		const x = 2*(xPixel/window.innerWidth)-1;
		const y = 1-2*(yPixel/window.innerHeight);

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(new THREE.Vector2(x,y),sceneThreeJs.camera);

		var objects=[];
		for(var i=0; i<sceneThreeJs.objects.length; i++){
			for(var j=0; j<sceneThreeJs.objects[i].length; j++){
				if(sceneThreeJs.objects[i][j]!=null){
					objects.push(sceneThreeJs.objects[i][j]);
				}
			}
		}
		const intersects = raycaster.intersectObjects(objects);
		if(intersects[0]!=null){
			heliceData.ok=true;
			var normal = intersects[0].face.normal;
			var newPoint = new THREE.Vector3(intersects[0].point.x + normal.x,intersects[0].point.y + normal.y,intersects[0].point.z + normal.z);
			sceneThreeJs.helice.lookAt(newPoint);
			sceneThreeJs.helice.position.set(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z);
			sceneThreeJs.helice.visible=true;
		}else{
			sceneThreeJs.helice.visible=false;
			heliceData.ok=false;
		}
	}
	render(sceneThreeJs);
}

function onKeyDownHelice(event) {
    const keyCode = event.code;
	if(event.keyCode==107){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y-0.1,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==109){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y+0.1,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==40){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z+0.1);
	}else if(event.keyCode==38){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z-0.1);
	}else if(event.keyCode==39){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x-0.1,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==37){
		sceneThreeJs.camera.position.set(sceneThreeJs.camera.position.x+0.1,sceneThreeJs.camera.position.y,sceneThreeJs.camera.position.z);
	}else if(event.keyCode==90 && event.ctrlKey){
		if(sceneThreeJs.objects[3].length>=2){
			sceneThreeJs.sceneGraph.remove(sceneThreeJs.objects[3][sceneThreeJs.objects[3].length-2]);
			sceneThreeJs.objects[3][sceneThreeJs.objects[3].length-2]=null;
			sceneThreeJs.objects[3].pop();
			console.log("ok");
		}
	}else if(event.ctrlKey){
		heliceData.ctrl=true;
		sceneThreeJs.controls.enabled=true;
		sceneThreeJs.helice.visible=false;
	}
	render(sceneThreeJs);
}

function onKeyUpHelice(event) {
	const keyCode = event.code;
	heliceData.ctrl=false;
	sceneThreeJs.controls.enabled=false;
}

function onWheelHelice(event) {
	if(!heliceData.ctrl){
		var delta = event.wheelDelta ? event.wheelDelta : -event.detail;
		if(delta>0){
			heliceData.scale+=0.005;
		}else if(delta<0){
			if(heliceData.scale-0.01>0){
				heliceData.scale=heliceData.scale-0.005;
			}
		}
		sceneThreeJs.helice.scale.set(heliceData.scale,heliceData.scale,heliceData.scale);
		render(sceneThreeJs);
	}
}

function Vector3(x,y,z) {
    return new THREE.Vector3(x,y,z);
}
function Vector2(x,y) {
    return new THREE.Vector2(x,y);
}

function MaterialRGB(r,g,b) {
    const c = new THREE.Color(r,g,b);
    return new THREE.MeshLambertMaterial( {color:c} );
}



init();
