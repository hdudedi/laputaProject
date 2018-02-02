"use strict";


main();

function main() {

    const sceneThreeJs = {
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null,
    };


    initEmptyScene(sceneThreeJs);
    init3DObjects(sceneThreeJs.sceneGraph);
    animationLoop(sceneThreeJs);
}

function init3DObjects(sceneGraph,pickableObjects) {

    // Définition d'un polygon 2D
    const vectorPoints = [];
    vectorPoints.push( Vector2(0, 0) );
    vectorPoints.push( Vector2(0.65, 0) );
    vectorPoints.push( Vector2(0.8, 0.15) );
    vectorPoints.push( Vector2(0.8, 0.25) );
    vectorPoints.push( Vector2(0.65, 0.35) );
    vectorPoints.push( Vector2(0, 0.35) );
    var curve = new THREE.CatmullRomCurve3(vectorPoints, true);
    //new THREE.SplineCurve(vectorPoints);
    var points=curve.getPoints(500);
    const curveShape = new THREE.Shape(points);
    const epaisseur = 0.05;


    // Forme permettant d'afficher la triangulation (wireframe)
    const geometryWireframe = new THREE.ShapeGeometry( curveShape );
    const materialWireframe = new THREE.MeshBasicMaterial({color:0xff0000,wireframe: true,wireframeLinewidth:2});
    const objectWireframe = new THREE.Mesh(geometryWireframe, materialWireframe);
    objectWireframe.position.set(0,0,epaisseur+0.001); // translation de la triangulation sur l'avant de la face (offset pour éviter le 'Z-fighting').
    sceneGraph.add( objectWireframe );
    objectWireframe.position.set(1,1,0);
    objectWireframe.visible=false;


    // Création d'une forme extrudée
    //const extrudeSettings = { amount: epaisseur, bevelEnabled:false };
    const extrudeSettings = { amount: 0, bevelEnabled:true,bevelSegments:50,steps:50,bevelSize:0.01,bevelThickness:0.01 };
    const extrudeGeometry = new THREE.ExtrudeBufferGeometry( curveShape, extrudeSettings );
    const extrudeObject = new THREE.Mesh( extrudeGeometry, MaterialRGB(0.9,0.9,0.9) ) ;
    sceneGraph.add( extrudeObject );
    extrudeObject.visible=false;
    extrudeObject.position.set(1,1,1);



    //Création d'une pale
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
    const epaisseurpale = 0.03;

    const extrudeSettings2 = { amount:epaisseurpale , bevelEnabled:false };
    const extrudeGeometry2 = new THREE.ExtrudeBufferGeometry( curveShapepale, extrudeSettings2 );
    const pale1 = new THREE.Mesh( extrudeGeometry2, MaterialRGB(0.9,0.9,0.9) ) ;
    pale1.position.set(0,0,0);
    sceneGraph.add(pale1 );
    pale1.visible=true;

    //Création des trois autres pales
    const pale2Geometry=extrudeGeometry2.clone();
    const pale2 = new THREE.Mesh( pale2Geometry, MaterialRGB(0.9,0.9,0.9) ) ;
    pale2.geometry.rotateZ(Math.PI/2.0);
    pale2.position.set(0,0,0);
    sceneGraph.add(pale2 );

    //creation du cylindre
    const cylinderGeometry = new THREE.CylinderBufferGeometry( 0.15, 0.15, 1, 32 );
    const cylinder = new THREE.Mesh( cylinderGeometry, MaterialRGB(0.9,0.9,0.9) );
    cylinder.geometry.rotateX(Math.PI/2.0);
    cylinder.position.set(0,0,-0.35)
    sceneGraph.add( cylinder );


    // *************************************** //
    // Création d'une aile pour l'animation
    // *************************************** //
    const wingGeometry = extrudeGeometry.clone();
    const wing = new THREE.Mesh( wingGeometry, MaterialRGB(0.2,0.8,1) ) ;
    wing.name = "wing";
    // Applique une rotation
    wing.geometry.rotateX(Math.PI/2.0);
    wing.geometry.translate(0,0.025,0);
    sceneGraph.add( wing );
    wing.visible=false;

    const wingLeftGeometry = extrudeGeometry.clone();
    const wingLeft = new THREE.Mesh( wingLeftGeometry, MaterialRGB(0.2,0.8,1) ) ;
    wingLeft.name = "wingLeft";


    // Applique une rotation
    wingLeft.geometry.rotateX(Math.PI/2.0);
    wingLeft.geometry.rotateZ(Math.PI);
    wingLeft.geometry.translate(0,-0.025,0);
    sceneGraph.add( wingLeft );
    wingLeft.visible=false;


}



// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time) {

    const t = time/1000;//time in second

    const wing = sceneThreeJs.sceneGraph.getObjectByName("wing");
    const wingLeft = sceneThreeJs.sceneGraph.getObjectByName("wingLeft");

    const rotationMatrix = new THREE.Matrix4().makeRotationAxis( Vector3(0,0,1), Math.PI/6 * Math.sin(3*t*Math.PI) );
    const rotationMatrixLeftWing = new THREE.Matrix4().makeRotationAxis( Vector3(0,0,1), Math.PI/6 * Math.sin(3*t*Math.PI+Math.PI) );



    wing.setRotationFromMatrix(rotationMatrix);
    wing.position.set(0,0.75,0);

    wingLeft.setRotationFromMatrix(rotationMatrixLeftWing);
    wingLeft.position.set(0,0.75,0);


    render(sceneThreeJs);
}







// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    sceneThreeJs.camera = sceneInit.createCamera(1,1.5,3);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(1,2,2));

    sceneThreeJs.renderer = sceneInit.createRenderer();
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

    sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera );

    window.addEventListener('resize', function(event){onResize(sceneThreeJs);}, false);
}

// Fonction de gestion d'animation
function animationLoop(sceneThreeJs) {

    // Fonction JavaScript de demande d'image courante à afficher
    requestAnimationFrame(

        // La fonction (dite de callback) recoit en paramètre le temps courant
        function(timeStamp){
            animate(sceneThreeJs,timeStamp); // appel de notre fonction d'animation
            animationLoop(sceneThreeJs); // relance une nouvelle demande de mise à jour
        }

    );

}

// Fonction appelée lors du redimensionnement de la fenetre
function onResize(sceneThreeJs) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneThreeJs.camera.aspect = width / height;
    sceneThreeJs.camera.updateProjectionMatrix();

    sceneThreeJs.renderer.setSize(width, height);
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
