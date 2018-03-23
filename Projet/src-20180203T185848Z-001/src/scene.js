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
    pale1.name="pale1";

    //Création des trois autres pales
    const pale2Geometry=extrudeGeometry2.clone();
    const pale2 = new THREE.Mesh( pale2Geometry, MaterialRGB(0.9,0.9,0.9) ) ;
    pale2.geometry.rotateZ(Math.PI/2.0);
    pale2.position.set(0,0,0);
    sceneGraph.add(pale2 );
    pale2.name="pale2";

    //creation du cylindre
    const cylinderGeometry = new THREE.CylinderBufferGeometry( 0.15, 0.15, 1, 32 );
    const cylinder = new THREE.Mesh( cylinderGeometry, MaterialRGB(0.9,0.9,0.9) );
    cylinder.geometry.rotateX(Math.PI/2.0);
    cylinder.position.set(0,0,-0.35)
    sceneGraph.add( cylinder );


}



// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time) {

    const t = time/1000;//time in second

    const pale1 = sceneThreeJs.sceneGraph.getObjectByName("pale1");
    const pale2 = sceneThreeJs.sceneGraph.getObjectByName("pale2");

    const rotationMatrix = new THREE.Matrix4().makeRotationAxis( Vector3(0,0,1),  2*t);



    pale1.setRotationFromMatrix(rotationMatrix);
    pale2.setRotationFromMatrix(rotationMatrix);



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
