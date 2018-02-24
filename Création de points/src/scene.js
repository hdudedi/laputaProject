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

//Sphère pour un point
const radius = 0.015; // Rayon de la sphère
var geometry = new THREE.CircleGeometry( 0.03, 32 );
var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var circle = new THREE.Mesh( geometry, material );
sceneGraph.add( circle );
circle.visible=false;
circle.name="circle";



//Création des points initiaux
var pointsABouger=[];
const p3=Vector3(0, 0.3,0);
const p0=Vector3(0, 0,0);
const p1=Vector3(0.3, 0,0);
const p2=Vector3(0.3, 0.3,0);
//création des booléens associées au points.
const bouge=[];

pointsABouger.push(
  p0,
  p1,
  p2,
  p3,
  p0,
);


//Création des lignes rejoignant les points
const material2 = new THREE.LineBasicMaterial({color:0xff0000});
var geometry2 = [];
geometry2.push(
  p0,
  p1,
  p2,
  p3,
  p0,
);

// const line=new THREE.Line(geometry2, material2);
// line.name="line";
// sceneGraph.add(line);
//line.visible=true;
//console.log(geometry2);


var crea=false;

var maj=false;

var geom=new THREE.Geometry();
geom.setFromPoints(geometry2);
var line=new THREE.Line(geom,material2);
sceneGraph.add(line);





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
let xstock=0;
let ystock=0;
const zstock=0;

var H=p0;

var tabline=[];
for (var i=0; i<pointsABouger.length-1;i++){
  var point1=pointsABouger[i];
  var point2=pointsABouger[i+1];
  var ligne=new THREE.Line3(point1,point2 )
  tabline.push(ligne);
}
//console.log(tabline);

function render() {
      //mettre à jour la figure

      //sceneGraph.remove(line);

      //var line=new THREE.Line(geometry2, material2);

      // console.log(line);
      //sceneGraph.add(line);
      //console.log(line);

      tabline=[];
      for (var i=0; i<pointsABouger.length-1;i++){
        var point1=pointsABouger[i];
        var point2=pointsABouger[i+1];
        tabline.push(new THREE.Line3(point1,point2 ));
      }
      //console.log(tabline);

      var geom=new THREE.Geometry();
      geom.setFromPoints(geometry2);
      var pt=new THREE.Points(geom);
      //sceneGraph.add(pt);

      if(maj){
        console.log(sceneGraph);
        sceneGraph.remove(line);
        line=new THREE.Line(geom,material2);
        line.name="line";
        sceneGraph.add(line);
        line.geometry.verticesNeedUpdate=true;
        console.log(sceneGraph,line);
        maj=false;
      }



      renderer.render(sceneGraph, camera);
}

render();





// Fonction appelée lors du clic de la souris
function onMouseDown(event) {
    //console.log('Mouse down');

    // Coordonnées du clic de souris en pixel
    const xPixel = event.clientX;
    const yPixel = event.clientY;

    // Conversion des coordonnées pixel en coordonnées relatives par rapport à la fenêtre (ici par rapport au canvas de rendu).
    // Les coordonnées sont comprises entre -1 et 1
    const x1 = 2*(xPixel/canvasSize)-1;
    const y1 = 1-2*(yPixel/canvasSize);


    // Recherche si la souris est proche d'un des points existants
    var essai=false;
    for (var i=0; i < pointsABouger.length;i++){
      const pts=pointsABouger[i];
        if ( (x1-pts.x)*(x1-pts.x)+(y1-pts.y)*(y1-pts.y) < (radius+0.05)*(radius+0.05) ) {
            //object.material.color.set(0xff0000);
            bouge[i]=true;
            essai=true;
        }
        else{
            bouge[i]=false;
            //console.log(essai);
        }
    }

    //recherche si la souris est sur un segment

    for(var i=0;i<tabline.length;i++){
      var trav=tabline[i].closestPointToPoint(H)
      console.log(trav,H,H.x==trav.x);
      if(H.x==trav.x && H.y==trav.y && crea){
          H.y+=0.1;
          pointsABouger=insert(pointsABouger,H,i+1);
          //sceneGraph.add.push(H);
          geometry2=insert(geometry2,H,i+1);
          maj=true;
          console.log(i,pointsABouger,geometry2);
      }
    }


    // MAJ de l'image
    render();
}



// Fonction appelée lors du relachement de la souris
function onMouseUp(event) {
    //object.visible=false;
    //console.log('Mouse up');
    for (var i=0;i<bouge.length;i++){
      bouge[i]=false;
    }
    //object.material.color.set(0xaaffff);
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

    const mouse=new THREE.Vector2(x1,y1);

    //parcours des booléens associés auc points
    for (var i=0;i<bouge.length;i++){
      if (bouge[i]) {
        const pts=pointsABouger[i]
        pts.x=xstock;
        pts.y=ystock;
        pts.z=zstock;
        render();

      }
    }



    const li=tabline[0];
    H=li.closestPointToPoint(Vector3(x1,y1,0),true);
    const dist1=Math.pow(x1-H.x,2)+Math.pow(y1-H.y,2);
    const dist2=Math.pow(dist1,0.5);
    if(Math.abs(dist2)<0.1){
      circle.visible=true;
      crea=true;
      const cycle2=circle.clone();
      circle.position.set(H.x,H.y,H.z);
      render();
      //circle.position.set(sol[0][0],sol[1][0]/lg,0);

    }
    //render();

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


function insert(tab,a,i){
    var t=[];
    t=tab.slice(0,tab.length);
    t[i]=a;
    for(var j=i;j<tab.length;j++){
      t[j+1]=tab[j];
    }
    return t;
}

var tab=[];
tab.push(
  p0,
  p1,
  p2,
  p3
);

tab=insert(tab,p0,2);
//console.log(tab);

window.requestAnimationFrame(render);
