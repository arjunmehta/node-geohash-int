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

var encode_int = function(lat_range, long_range, latitude, longitude, bits){

  var latr = new GeoHashRange();
  var longr = new GeoHashRange();

  if(lat_range && long_range){
    latr.min = lat_range.min || lat_r.min;
    latr.max = lat_range.max || lat_r.max;
    longr.min = long_range.min || long_r.min;
    longr.max = long_range.max || long_r.max;
  }
  else{
    latr.min = lat_r.min;
    latr.max = lat_r.max;
    longr.min = long_r.min;
    longr.max = long_r.max;
  }

  var hash = new GeoHashBits();  
  var result = geohashInt.geohash_encode(latr.ref(), longr.ref(), latitude, longitude, bits, hash.ref());

  return hash;

  // var hash_c = JSON.parse(JSON.stringify(hash));
  // return hash_c;
};

var decode_int = function(lat_range, long_range, bits, steps){

  var latr = new GeoHashRange();
  var longr = new GeoHashRange();

  if(lat_range && long_range){
    latr.min = lat_range.min || lat_r.min;
    latr.max = lat_range.max || lat_r.max;
    longr.min = long_range.min || long_r.min;
    longr.max = long_range.max || long_r.max;
  }
  else{
    latr.min = lat_r.min;
    latr.max = lat_r.max;
    longr.min = long_r.min;
    longr.max = long_r.max;
  }
  
  var hash = new GeoHashBits(); 
  hash.bits = bits;
  hash.step = steps;

  var area = new GeoHashArea();
  var result = geohashInt.geohash_decode(latr.ref(), longr.ref(), hash.ref(), area.ref());

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
