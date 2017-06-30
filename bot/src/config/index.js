fs = require('fs');

var corp = 'corporate.symphony.com';
var corpApi = 'corporate-api.symphony.com';
var nexus = 'nexus.symphony.com';
var nexusApi = 'nexus-api.symphony.com';
var nexus2 = 'nexus2.symphony.com';
var nexus2Api = 'nexus2-api.symphony.com';
nexusApi = 'nexus-dev-ause1-all.symphony.com';
//nexus = 'nexus-dev-ause1-all.symphony.com';

function base64EncodeUrl(str){
	return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

var n1CrazyThreadId = base64EncodeUrl('9FR+lyvLNttuARgs7av3D3///rCPekXbdA=='); //nexus
var n2CrazyThreadId = base64EncodeUrl('pnTN05AkpGivKFCNzEWkk3///qTgBnUtdA=='); //nexus2
var nexusThreadId = base64EncodeUrl('pnTN05AkpGivKFCNzEWkk3///qTgBnUtdA=='); //nexus2
var n2PrivateThreadId = base64EncodeUrl('DxbnV8++z3vny/SIX7NqGX///qPFMGuYdA==');
var corpTestThreadId = base64EncodeUrl('QBsRAH+GVNvyvRsK9AVufX///qOCFrt8dA==');
var corpPAThreadId = base64EncodeUrl('lX1hwfmQ+AK/k/a/BB0y2n///q2+0KfbdA==');

module.exports = {
	bots: {
/*
		'1045': {
			keyUrl: 'https://' + corpApi + ':8444/keyauth',
			sessionUrl: 'https://' + corpApi + ':8444/sessionauth',
			agentUrl: 'https://' + corp + ':443/agent',
			podUrl: 'https://' + corp + ':443/pod',

			auth: {
				cert: fs.readFileSync(__dirname + '/certs/grub.bot-cert.pem', {encoding: 'utf-8'}),
				key: fs.readFileSync(__dirname + '/certs/grub.bot-key.pem', {encoding: 'utf-8'}),
				passphrase: 'changeit',
			},
			threadId: corpPAThreadId,
		},
/**/
		'130' : {
			keyUrl: 'https://' + nexus2 + ':8444/keyauth',
			sessionUrl: 'https://' + nexus2 + ':8444/sessionauth',
			agentUrl: 'https://' + nexus2 + ':443/agent',
			podUrl: 'https://' + nexus2 + ':443/pod',
			auth: {
				cert: fs.readFileSync(__dirname + '/certs/bot.user1-cert.pem', {encoding: 'utf-8'}),
				key: fs.readFileSync(__dirname + '/certs/bot.user1-key.pem', {encoding: 'utf-8'}),
				passphrase: 'changeit',
			},
			threadId: n2PrivateThreadId,
		},
/*
		'131' : {
			keyUrl: 'https://' + nexusApi + ':8444/keyauth',
			sessionUrl: 'https://' + nexusApi + ':8444/sessionauth',
			agentUrl: 'https://' + nexus + ':443/agent',
			podUrl: 'https://' + nexus + ':443/pod',
			auth: {
				cert: fs.readFileSync(__dirname + '/certs/bot.user1-cert.pem', {encoding: 'utf-8'}),
				key: fs.readFileSync(__dirname + '/certs/bot.user1-key.pem', {encoding: 'utf-8'}),
				passphrase: 'changeit',
			},
			threadId: n1CrazyThreadId,
		}
/**/
	},
	menuFiles: __dirname + '/../../../menus',
}
