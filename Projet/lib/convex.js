/**@constructor*/
THREE.ConvexGeometry = function( vertices ) { 
	THREE.Geometry.call( this );
	var faces = [ [ 0, 1, 2 ], [ 0, 2, 1 ] ]; 
	for ( var i = 3; i < vertices.length; i++ ) {
		addPoint( i );
	}
	
	function addPoint( vertexId ) {
		var vertex = vertices[ vertexId ].clone();
		var mag = vertex.length();
		vertex.x += mag * randomOffset();
		vertex.y += mag * randomOffset();
		vertex.z += mag * randomOffset();
		var hole = [];
		for ( var f = 0; f < faces.length; ) {
			var face = faces[ f ];
			if ( visible( face, vertex ) ) {
				for ( var e = 0; e < 3; e++ ) {
					var edge = [ face[ e ], face[ ( e + 1 ) % 3 ] ];
					var boundary = true;
					for ( var h = 0; h < hole.length; h++ ) {
						if ( equalEdge( hole[ h ], edge ) ) {
							hole[ h ] = hole[ hole.length - 1 ];
							hole.pop();
							boundary = false;
							break;
						}
					}
					if ( boundary ) {
						hole.push( edge );
					}
				}
				faces[ f ] = faces[ faces.length - 1 ];
				faces.pop();
			} else { // not visible
				f++;
			}
		}
		for ( var h = 0; h < hole.length; h++ ) {
			faces.push( [ 
				hole[ h ][ 0 ],
				hole[ h ][ 1 ],
				vertexId
			] );
		}
	}
	function visible( face, vertex ) {
		var va = vertices[ face[ 0 ] ];
		var vb = vertices[ face[ 1 ] ];
		var vc = vertices[ face[ 2 ] ];
		var n = normal( va, vb, vc );
		var dist = n.dot( va );
		return n.dot( vertex ) >= dist; 
	}
	function normal( va, vb, vc ) {
		var cb = new THREE.Vector3();
		var ab = new THREE.Vector3();
		cb.sub( vc, vb );
		ab.sub( va, vb );
		cb.crossSelf( ab );
		cb.normalize();
		return cb;
	}
	function equalEdge( ea, eb ) {
		return ea[ 0 ] === eb[ 1 ] && ea[ 1 ] === eb[ 0 ]; 
	}
	function randomOffset() { 
		return ( Math.random() - 0.5 ) * 2 * 1e-6;
	}
	function vertexUv( vertex ) {
		var mag = vertex.length();
		return new THREE.UV( vertex.x / mag, vertex.y / mag );
	}
	var id = 0;
	var newId = new Array( vertices.length ); // map from old vertex id to new id
	for ( var i = 0; i < faces.length; i++ ) {
		var face = faces[ i ];
		for ( var j = 0; j < 3; j++ ) {
			if ( newId[ face[ j ] ] === undefined ) {
				newId[ face[ j ] ] = id++;
				this.vertices.push( vertices[ face[ j ] ] );
			}
			face[ j ] = newId[ face[ j ] ];
		}
	}
	for ( var i = 0; i < faces.length; i++ ) {
		this.faces.push( new THREE.Face3( 
			faces[ i ][ 0 ],
			faces[ i ][ 1 ],
			faces[ i ][ 2 ]
		) );
	}
	for ( var i = 0; i < this.faces.length; i++ ) {
		var face = this.faces[ i ];
		this.faceVertexUvs[ 0 ].push( [
			vertexUv( this.vertices[ face.a ] ),
			vertexUv( this.vertices[ face.b ] ),
			vertexUv( this.vertices[ face.c ])
		] );
	}
	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();
};
THREE.ConvexGeometry.prototype = Object.create( THREE.Geometry.prototype );