var Rpc = require('sapphire-rpc').Rpc;
global.SERVER =  new Rpc();
SERVER.start('grub');
require('./grub');
