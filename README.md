node-geohash-int
================

A basic wrapper for the C [`geohash-int`](https://github.com/yinqiwen/geohash-int) library.

This module will allow you to encode and decode integer hashes up to 52 bits, instead of the more standard base32 hashes that would be produced by other modules such as [`node-geohash`](https://github.com/sunng87/node-geohash).

This opens up many doors for leveraging sorted sets in Redis, or for doing other number based operations on the geohashes.

## example
``` js
var geohashInt = require('geohash-int');

var latitude_range = {min:-90, max:90};
var longitude_range = {min:-180, max:180};
var latitude = 43.6667;
var longitude = -79.4167;
var step = 26; //must be your desired bit count divided by 2.

var hash = geohashInt.encode(latitude_range, longitude_range, latitude, longitude, step);
console.log("Integer Hash is: ", hash.bits);

var area = geohashInt.decode(latitude_range, longitude_range, hash.bits, hash.step);
console.log("Decoded Area is: ", area);

var neighbors = geohashInt.get_neighbors(hash.bits, hash.step);
console.log("Neighbours are: "neighbors);
```

# methods
## encoding
``` js
geohashInt.encode(latitude_range, longitude_range, latitude, longitude, step);
```
The encoding method takes both latitudinal and longitudinal ranges, as well as the latitude and longitude to be hashed. The final argument is the step count which determines the bit depth `(step*2)`. ie. If you want a bit depth of 52, use 26. If you want 48, use 24 etc.

Ranges can be passed in as `null` and the method will default to maximum ranges.

Returns a `hash` object with the following properties:
- `bits`: the hash in integer form.
- `step`: the step count of the hash to be used when decoding.

## decoding
``` js
geohashInt.decode(latitude_range, longitude_range, hashBits, hashStep);
```
The decoding method takes both latitudinal and longitudinal ranges, as well as the hashed bits (the integer hash value) and the step count of that integer hash.

Ranges can be passed in as `null` and the method will default to maximum ranges.

Returns an `area` object with the following properties:
- `latitude`: an object with `min` and `max` latitudinal value ranges.
- `longitude`: an object with `min` and `max` longitudinal value ranges.

## neighbours
``` js
geohashInt.get_neighbors(hashBits, hashStep);
```
The neighbor (US spelling ;) method finds cardinal neighbour hashes to the passed in hashed bits (the integer hash value) and also requires the step count of that integer hash.

Returns a `neighbor` object with hashes for `north`, `east`, `south`, `west`, `north_west`, `north_east`, `south_west` and `south_east` neighbours.


# issues
Currently there are a few issues with this wrapper. It makes heavy use of `node-ffi` to make use of an the C library `geohash-int` by [`yin qiwen`](https://github.com/yinqiwen).
It was made as a temporary solution and a personal experiment in bridging c++ libraries into node.

- For now the user must compile the Shared Object (.so) file from the source in order for this module to work.
- Currently the returned results from the functions include a reference buffer. While these would likely not really be an issue when dealing with the data, it is ugly when logging :)
