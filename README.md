node-geohash-int
================

A basic wrapper for the C [`geohash-int`](https://github.com/yinqiwen/geohash-int) library.

This module will allow you to encode and decode Geolocation integer hashes up to 52 bits, instead of the more standard base32 hashes that would be produced by other modules such as [`node-geohash`](https://github.com/sunng87/node-geohash).

This opens up many doors for leveraging sorted sets in Redis, or for doing other number based operations on the geohashes.

## example
``` js
var geohashInt = require('geohash-int');

var latitude = 43.6667;
var longitude = -79.4167;

var hash = geohashInt.encode(latitude, longitude);
console.log("Integer Hash is: ", hash.bits);

var area = geohashInt.decode(hash.bits);
console.log("Decoded Area is: ", area);

var neighbors = geohashInt.get_neighbors(hash.bits);
console.log("Neighbours are: "neighbors);
```

# methods
## encoding
``` js
geohashInt.encode(latitude, longitude, bitDepth, latitude_range, longitude_range);
```
Arguments:
- `latitude`: a number between -90 and 90
- `longitude`: a number between -180 and 180
- `bitDepth`(optional): bitDepth of the hash (must be even). `default: 52`
- `latitude_range`(optional): an object with `max` and `min` latitudinal ranges. `default: {min:-90, max:90}`
- `longitude_range`(optional): an object with `max` and `min` longitudinal ranges. `default: {min:-180, max:180}`

Returns a `hash` object with the following properties:
- `bits`: the hash in integer form.
- `step`: the step count of the hash to be used when decoding.

### example
```js
var latitude_range = {min:-90, max:90};
var longitude_range = {min:-180, max:180};
var latitude = 43.6667;
var longitude = -79.4167;
var step = 26; //must be your desired bit count divided by 2.

var hash = geohashInt.encode(latitude, longitude, step, latitude_range, longitude_range);
console.log("Integer Hash is: ", hash.bits);
``` 

## decoding
``` js
geohashInt.decode(hashBits, hashBitDepth, latitude_range, longitude_range);
```
Arguments:
- `hashBits`: the geohash bits to be decoded
- `hashBitDepth`(optional): bitDepth of the passed in geohash (must be even). `default: 52`
- `latitude_range`(optional): an object with `max` and `min` latitudinal ranges. `default: {min:-90, max:90}`
- `longitude_range`(optional): an object with `max` and `min` longitudinal ranges. `default: {min:-180, max:180}`

Returns an `area` object with the following properties:
- `hash`: the original passed in geohash.
- `latitude`: an object with `min` and `max` latitudinal value ranges.
- `longitude`: an object with `min` and `max` longitudinal value ranges.

## neighbours
``` js
geohashInt.get_neighbors(hashBits, hashBitDepth);
```
Arguments:
- `hashBits`: the geohash bits used to find its nearest cardinal neighbours.
- `hashBitDepth`(optional): bitDepth of the passed in hash (must be even). `default: 52`

The `neighbor` (US spelling ;) method finds cardinal neighbour hashes to the passed in hashed bits (the integer hash value) and also optionally takes the step count of that integer hash.

Returns a `neighbor` object with hashes for `north`, `east`, `south`, `west`, `north_west`, `north_east`, `south_west` and `south_east` neighbours.


# issues
Currently there are a few issues with this wrapper. It makes heavy use of `node-ffi` to make use of an the C library `geohash-int` by [`yin qiwen`](https://github.com/yinqiwen).
It was made as a temporary solution and a personal experiment in bridging c++ libraries into node.

- For now the user must compile the Shared Object (.so) file from the source in order for this module to work.
- The returned results directly from the functions include a reference buffer and are not inherently editable in a natural JS based way. So the native objects need to be parsed and properly converted to standard JS objects. This makes things not 100% optimal performance-wise.
