var Rpc = require('sapphire-rpc').Rpc;
var redisHost = process.env.redis_host || '127.0.0.1';
var redisPort = process.env.redis_port || 6379;
global.SERVER =  new Rpc({host: redisHost, port: redisPort});
SERVER.start('grub');
SERVER.start('vote');
require('./grub');
require('./vote');
