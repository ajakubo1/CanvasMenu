#! /usr/bin/env node

var uglify = require('uglify-js'),
    fs = require('fs');

var arguments = Array.prototype.slice.call(process.argv, 2),
    i, prefix = "src/", postfix = ".js", uglified;

for (i = 0 ; i < arguments.length; i += 1) {
    arguments[i] = prefix + arguments[i] + postfix;

    var content = fs.readFileSync(arguments[i]);
    if(i === 0) {
        fs.writeFileSync('dist/canvasmenu.js', content);
    } else {
        fs.appendFileSync('dist/canvasmenu.js', content);
    }
}

var uglified = uglify.minify(arguments, {
    "outSourceMap": 'dist/canvasmenu.map'
});

fs.writeFile('dist/canvasmenu.min.js', uglified.code, function (err){
    if(err) {
        console.log(err);
    } else {
        console.log("Minified script generated and saved:", 'dist/canvasmenu.min.js');
    }
});

fs.writeFile('dist/canvasmenu.map', uglified.map, function (err){
    if(err) {
        console.log(err);
    } else {
        console.log("Map generated and saved:", 'dist/canvasmenu.map');
    }
});