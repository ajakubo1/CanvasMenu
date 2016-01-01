#! /usr/bin/env node

var uglify = require('uglify-js'),
    fs = require('fs'),
    path = require('path');

var args = [], prefix = "src/", postfix = ".js", destination = "", uglified, go = true;


function main() {
    var i;

    if (fs.existsSync(path.normalize(destination + 'canvasmenu.js'))) {
        fs.unlinkSync(path.normalize(destination + 'canvasmenu.js'));
    }

    if (fs.existsSync(path.normalize(destination + 'canvasmenu.map'))) {
        fs.unlinkSync(path.normalize(destination + 'canvasmenu.map'));
    }

    if (fs.existsSync(path.normalize(destination + 'canvasmenu.min.js'))) {
        fs.unlinkSync(path.normalize(destination + 'canvasmenu.min.js'));
    }

    fs.writeFileSync(path.normalize(destination + 'canvasmenu.js'), "");

    for (i = 0 ; i < args.length; i += 1) {
        fs.appendFileSync(path.normalize(destination + 'canvasmenu.js'), fs.readFileSync(args[i]));
    }

    uglified = uglify.minify(args, {
        "outSourceMap": path.normalize(destination + 'canvasmenu.map')
    });

    fs.writeFile(path.normalize(destination + 'canvasmenu.min.js'), uglified.code, function (err){
        if(err) {
            console.log(err);
        } else {
            console.log("Minified script generated and saved:", 'dist/canvasmenu.min.js');
        }
    });

    fs.writeFile(path.normalize(destination + 'canvasmenu.map'), uglified.map, function (err){
        if(err) {
            console.log(err);
        } else {
            console.log("Map generated and saved:", path.normalize(destination + 'canvasmenu.map'));
        }
    });
}

function help() {
    console.info('Applicable args:');
    console.info('\t--help - print help message');
    console.info('\t--dest=<deployment destination> - change destination for script building');
    console.info('\nArguments without -- sign will be considered as element names')
}

function applyArgument (arg) {
    switch(arg.split('=')[0]) {
        case '--dest':
            destination = arg.replace('--dest=', '');
            break;
        case '--help':
            help();
            go = false;
            break;
        default:
            console.warn('This script does not understand: ' + arg);
            help();
            go = false;
    }
}

function removeFalsy() {
    var i;
    for (i = 0 ; i < args.length; i += 1) {
        if (args[i] === false) {
            args.splice(i, 1);
            break;
        }
    }

    if(i !== args.length) {
        removeFalsy();
    }
}

function rearrangeArgs() {
    var i, temp = [];
    if (args.length > 0) {
        temp.push(undefined);
    }
    if (args.length > 1) {
        temp.push(undefined);
    }
    for (i = 0; i < args.length; i += 1) {
        if (args[i].search('menu.js') !== -1) {
            temp[0] = args[i];
        } else if (args[i].search('element.js') !== -1) {
            temp[1] = args[i];
        } else {
            temp.push(args[i]);
        }
    }

    if(temp[0] === undefined) {
        temp[0] = prefix + 'menu.js';
    }

    if(temp.length > 1 && temp[1] === undefined) {
        temp[1] = prefix + 'element.js';
    }

    args = temp;
}

function extractArguments() {
    var i, temp = process.argv.slice(2);
    for (i = 0; i < temp.length; i += 1) {
        if (temp[i].startsWith('--')) {
            applyArgument(temp[i]);
        } else {
            args.push(temp[i]);
        }
    }

    if (args.length === 0) {
        args = fs.readdirSync(path.normalize(prefix));

        for (i = 0 ; i < args.length; i += 1) {
            args[i] = path.normalize(prefix + args[i]);
        }
    } else {
        for (i = 0 ; i < args.length; i += 1) {
            args[i] = path.normalize(prefix + args[i] + postfix);

            if (!fs.existsSync(args[i])) {
                console.warn("There is no file called: " + args[i] + " - it will be ignored during library build");
                args[i] = false;
            }
        }
    }
    rearrangeArgs();
    removeFalsy();
}

extractArguments();
if (go) {
    main();
}