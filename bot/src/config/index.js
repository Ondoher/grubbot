fs = require('fs');

var corp = 'corporate.symphony.com';
var nexus2 = 'nexus2.symphony.com';

function base64EncodeUrl(str){
	return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

var nexusThreadId = base64EncodeUrl('pnTN05AkpGivKFCNzEWkk3///qTgBnUtdA=='); //nexus2


module.exports = {
	bots: {
/*
		1045: {
			keyUrl: 'https://' + corp + ':8444/keyauth',
			sessionUrl: 'https://' + corp + ':8444/sessionauth',
			agentUrl: 'https://' + corp + ':443/agent',
			podUrl: 'https://' + corp + ':443/pod',
			auth: {
				cert: fs.readFileSync(__dirname + '/certs/bot.user1-cert.pem', {encoding: 'utf-8'}),
				key: fs.readFileSync(__dirname + '/certs/bot.user1-key.pem', {encoding: 'utf-8'}),
				passphrase: 'changeit',
			},

		},
*/
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
			threadId: nexusThreadId,
		}
	}
}
