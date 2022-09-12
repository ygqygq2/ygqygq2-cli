var fs = require('fs'),
    stat = fs.stat;
/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var copy = function (src, dst, cb) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            cb(err);
        }
        var count = 0
        var checkEnd = function () {
            ++count == paths.length && cb()
        }
        paths.forEach(function (path) {
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;

            stat(_src, function (err, st) {
                if (err) {
                    cb(err);
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                    checkEnd();
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    exists(_src, _dst, copy, checkEnd);
                }
            });
        });
    });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
const exists = function (src, dst, callbackFunction, completeCallback) {
    fs.access(dst, (e) =>  {
        // 已存在
        if (e) {
            callbackFunction(src, dst, completeCallback);
        }
        // 不存在
        else {
            fs.mkdir(dst, function () {
                callbackFunction(src, dst, completeCallback);
            });
        }
    });
};

module.exports = {
    copy,
    exists
};
