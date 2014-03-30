var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

var GeoHashBits = Struct({
  'bits': 'uint64',
  'step': 'uint8'
});
var GeoHashBitsPtr = ref.refType(GeoHashBits);

var GeoHashRange = Struct({
  'max': 'double',
  'min': 'double'
});
var GeoHashRangePtr = ref.refType(GeoHashRange);

var GeoHashArea = Struct({
  'hash': GeoHashBits,
  'latitude': GeoHashRange,
  'longitude': GeoHashRange
});
var GeoHashAreaPtr = ref.refType(GeoHashArea);

var GeoHashNeighbors = Struct({
  'north': GeoHashBits,
  'east': GeoHashBits,
  'west': GeoHashBits,
  'south': GeoHashBits,
  'north_east': GeoHashBits,
  'south_east': GeoHashBits,
  'north_west': GeoHashBits,
  'south_west': GeoHashBits
});
var GeoHashNeighborsPtr = ref.refType(GeoHashNeighbors);

var geohashInt = ffi.Library(__dirname + '/libgeohash', {
  "geohash_encode": [ 'int', [ GeoHashRangePtr, GeoHashRangePtr, 'double', 'double', 'uint8', GeoHashBitsPtr ] ],
  "geohash_decode": [ 'int', [ GeoHashRangePtr, GeoHashRangePtr, GeoHashBitsPtr, GeoHashAreaPtr] ],
  "geohash_get_neighbors": [ 'int', [ GeoHashBitsPtr, GeoHashNeighborsPtr ] ]
});


var lat_r = new GeoHashRange();
lat_r.min = -90.0;
lat_r.max = 90.0;

var long_r = new GeoHashRange();
long_r.min = -180.0;
long_r.max = 180.0;

// var hash = new GeoHashBits();
// var result = geohashInt.geohash_encode.async(lat_r.ref(), long_r.ref(), 110, 50, 26, hash.ref(), function(err, res){
//   console.log("GEOHASH ENCODE:  " + JSON.stringify(hash));  
// });
// console.log("GEOHASH RESULT: " + result);

// geohashInt.geohash_encode(lat_r.ref(), long_r.ref(), 110, 50, 26, hash.ref());
// console.log("GEOHASH ENCODE: " + JSON.stringify(hash));  

// var area = new GeoHashArea();
// geohashInt.geohash_decode(lat_r.ref(), long_r.ref(), hash.ref(), area.ref());
// console.log("GEOHASH DECODE: " + JSON.stringify(area)); 

// var neighbors = new GeoHashNeighbors();
// geohashInt.geohash_get_neighbors(hash.ref(), neighbors.ref());
// console.log("GEOHASH NEIGHBOURS: " + JSON.stringify(neighbors)); 


var encode_int = function(lat_range, long_range, latitude, longitude, bits){
  var hash = new GeoHashBits();  
  var result = geohashInt.geohash_encode(lat_r.ref(), long_r.ref(), latitude, longitude, bits, hash.ref());

  return hash;

  // var hash_c = JSON.parse(JSON.stringify(hash));
  // return hash_c;
};

var decode_int = function(lat_range, long_range, bits, steps){
  var hash = new GeoHashBits(); 
  hash.bits = bits;
  hash.step = steps;

  var area = new GeoHashArea();
  var result = geohashInt.geohash_decode(lat_r.ref(), long_r.ref(), hash.ref(), area.ref());

  return area;

  // var area_c = JSON.parse(JSON.stringify(area));
  // return area_c;
};

var get_neighbors_int = function(bits, steps){
  var hash = new GeoHashBits(); 
  hash.bits = bits;
  hash.step = steps;

  var neighbors = new GeoHashNeighbors();
  var result = geohashInt.geohash_get_neighbors(hash.ref(), neighbors.ref());

  return neighbors;

  // var neighbors_c = JSON.parse(JSON.stringify(neighbors));
  // return neighbors_c;
};

module.exports = {
    "encode": encode_int,
    "decode": decode_int,
    "get_neighbors": get_neighbors_int
};
