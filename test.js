const fse = require('fs-extra');
var path = require('path');
// var exec = require('child_process').exec;

const filterFuc = (src, dest) => {
    const nodeCopyDir = ["node_modules", "template"];
    for (ncd in nodeCopyDir) {
        console.log("src", src)
        if (src.indexOf(ncd) > -1) {
            console.log(src, "false");
            return false;
        }
    }
    console.log(src, "true");
    return true;
}

fse.copy("/tmp/test/a", "/tmp/test/b", {filter: filterFuc}, err => {
    if (err) return console.error(err);
    console.log("success!");
})