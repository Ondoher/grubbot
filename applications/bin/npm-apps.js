const child = require('child_process');
var Q = require('q');
var fs = require('fs');
var path = require('path');

function getDir(path)
{
	return fs.readdirSync(path);
}

function hasPackage(path)
{
	return fs.existsSync(path + '/package.json');
}

function isDirectory(path)
{
	var stats = fs.statSync(path);
	return stats && stats.isDirectory();
}

var root = process.cwd() + '/apps';

var apps = getDir(root);
var install = [];

apps.forEach(function(dir)
{
	var path = root + '/' + dir;
	if (isDirectory(path) && hasPackage(path))
		install.push(path);
});
var cwd = process.cwd();

install.forEach(function(path) {
	process.chdir(path);
	console.log(process.cwd(), 'npm install');
	child.execSync('npm install');
});

process.chdir(cwd);
