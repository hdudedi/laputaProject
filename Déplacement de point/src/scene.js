"use strict";

// ****************************** //
//  Creation de la scène
// ****************************** //

const sceneGraph = new THREE.Scene();

// Creation d'une caméra Orthographique (correspondance simple entre la position de la souris et la position dans l'espace (x,y))
const camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);

const renderer = new THREE.WebGLRenderer( { antialias: true,alpha:false } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor(0xeeeeee,1.0);

// Force la zone de rendu à être de taille carré
let canvasSize = Math.min(window.innerWidth, window.innerHeight);
renderer.setSize( canvasSize,canvasSize );

const baliseHtml = document.querySelector("#AffichageScene3D");
baliseHtml.appendChild(renderer.domElement);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0,0,1);
sceneGraph.add(spotLight);

// ****************************** //
//  Ajout de l'objet
// ****************************** //

const radius = 0.015; // Rayon de la sphère
const geometry = new THREE.CircleGeometry( radius,32,32 );
const material = new THREE.MeshLambertMaterial( {color:0xaaffff} );
const object = new THREE.Mesh( geometry, material );
//object.position.set(new THREE.Vector3(0,0,0));

const pointsABouger=[];
const point=Vector3(0, 0.3,0);
const point0=Vector3(0, 0,0);
const point1=Vector3(0.3, 0,0);
const point2=Vector3(0.3, 0.3,0);

pointsABouger.push(
  point0,
  point1,
  point2,
  point,
  point0,
);


const material2 = new THREE.LineBasicMaterial({color:0xff0000});
const geometry2 = new THREE.Geometry();
geometry2.vertices.push(
  point0,
  point1,
  point2,
  point,
  point0,
);
const line=new THREE.Line(geometry2, material2);
sceneGraph.add(line);

object.position.set(point.x,point.y,0 );
object.visible=false;

sceneGraph.add(object);

// ****************************** //
//  Fonctions de rappels évènementielles
// ****************************** //

// Bouton de la souris enclanché
window.addEventListener('mousedown', onMouseDown);

// Bouton de la souris relaché
window.addEventListener('mouseup', onMouseUp);

// Souris qui se déplace
window.addEventListener('mousemove', onMouseMove);

// Touche de clavier enfoncé
window.addEventListener('keydown', onKeyDown);

// Touche de clavier relaché
window.addEventListener('keyup', onKeyUp);

// Redimensionnement de la fenêtre
window.addEventListener('resize',onResize);



// ****************************** //
//  Rendu
// ****************************** //


function render() {

    line.geometry.vertices[3]=point;
    line.geometry.verticesNeedUpdate=true;
    //sceneGraph.add(line);


    renderer.render(sceneGraph, camera);
}

render();


let xstock=0;
let ystock=0;
const zstock=0;
let Bool=false;


// Fonction appelée lors du clic de la souris
function onMouseDown(event) {
    console.log('Mouse down');

    // Coordonnées du clic de souris en pixel
    const xPixel = event.clientX;
    const yPixel = event.clientY;

    // Conversion des coordonnées pixel en coordonnées relatives par rapport à la fenêtre (ici par rapport au canvas de rendu).
    // Les coordonnées sont comprises entre -1 et 1
    const x1 = 2*(xPixel/canvasSize)-1;
    const y1 = 1-2*(yPixel/canvasSize);


    // Recherche si le clic est à l'intérieur ou non de la sphère
    for(var obj in pointsABouger){
      console.log(x1-obj.position.x);
        if ( (x1-obj.position.x)*(x1-obj.position.x)+(y1-obj.position.y)*(y1-obj.position.y) < (radius+0.05)*(radius+0.05) ) {
            object.material.color.set(0xff0000);
            Bool=true;
        }
    }



    // MAJ de l'image
    render();
}



// Fonction appelée lors du relachement de la souris
function onMouseUp(event) {
    object.visible=false;
    console.log('Mouse up');
    Bool=false;
    object.material.color.set(0xaaffff);
    render();
}

// Fonction appelée lors du déplacement de la souris
function onMouseMove(event) {
    const xPixel = event.clientX;
    const yPixel = event.clientY;

  // Conversion des coordonnées pixel en coordonnées relatives par rapport à la fenêtre (ici par rapport au canvas de rendu).
  // Les coordonnées sont comprises entre -1 et 1
    const x1 = 2*(xPixel/canvasSize)-1;
    const y1 = 1-2*(yPixel/canvasSize);
    //console.log(x1,y1);
    xstock=x1;
    ystock=y1;

    if (Bool) {
      object.visible=true;
      const position=object.position.clone();
      const diffpos=(new THREE.Vector3(xstock,ystock,zstock)).sub(position);
      const matrix=new THREE.Matrix4().makeTranslation(diffpos.x,diffpos.y,diffpos.z);
      //console.log(matrix);

      object.applyMatrix(matrix);
      point.x=xstock;
      point.y=ystock;
      point.z=zstock;
      render();

    }
}

// Fonction appelée lors de l'appuis sur une touche du clavier
function onKeyDown(event) {

    const keyCode = event.code;
    console.log("Touche ",keyCode," enfoncé");
}

// Fonction appelée lors du relachement d'une touche du clavier
function onKeyUp(event) {
	const keyCode = event.code;
	console.log("Touche ",keyCode," relaché");
}

// Fonction appelée lors du redimmensionnement de la fenetre
function onResize(event) {

    // On force toujours le canvas à être carré
    canvasSize = Math.min(window.innerWidth, window.innerHeight);
    renderer.setSize( canvasSize,canvasSize );
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
