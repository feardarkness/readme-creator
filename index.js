#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var prompt = require('prompt');

path.basename = process.cwd();
console.log('*********************************************');
var readmePath = path.join(process.cwd(), 'README.md');
var templatePath = path.join(__dirname, 'template.txt');
var userArgs = process.argv[2];

if(userArgs === undefined){
	return errorMessage(new Error('Parameter --service-name or -sn is required :('));
}
var args = userArgs.split('=');
if ( args[0] !== '--service-name' && args[0] !== '-sn'){
	return errorMessage(new Error('Parameter --service-name or -sn is required :('));
}
if ( args[1] == null || args[1] === ''){ // comprueba al mismo tiempo null y undefined con ==
	return errorMessage(new Error('Parameter '+ args[0] +' must have a value :('));
}

function errorMessage(err){
	console.log('Something bad happened :(');
	console.log(err);
	console.log('*********************************************');
}

function writeFile(){
	fs.readFile(templatePath, 'UTF-8', function (err, data) {
		if(err){
			return errorMessage(err);
		}
		data = data.replace(/__SERVICE_NAME__/g, function (dato) {
			 return args[1].toUpperCase();
		});
		data = data.replace(/__service_name__/g, function (dato) {
			 return args[1].toLowerCase();
		});
		fs.writeFile(readmePath, data,function (err) {
			if(err){
				return errorMessage(err);
			}
			console.log('Everything is alright :D');
			console.log('*********************************************');
		});
	});
}

fs.stat(readmePath, (err, stats) => {
	if(err && err.code !== 'ENOENT'){
		return errorMessage(err);
	}
	if(stats === undefined){
		writeFile();
	}else{
		console.log('The file README.md already exists, continue??? (yes/no)')
		prompt.get(['continue'], function (err, result) {
			if(result.continue === 'yes'){
				writeFile();
			}else{
				console.log('Process canceled.. byeeee');
			}
		});
	}
})
