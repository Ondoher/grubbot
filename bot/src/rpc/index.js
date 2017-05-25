var Rpc = require('sapphire-rpc').Rpc;
global.SERVER =  new Rpc();
SERVER.start('grub');
SERVER.start('vote');
require('./grub');
require('./vote');
