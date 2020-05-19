const path = require('path');

/**
 * 判断传入的模块路径是否是相对路径
 * @param {String} p 当前模块的路径
 * @return {Boolean}
 */
function isRelativePath(p) {
    return /^\./.test(p);
}

/**
 * 判断传入的模块路径是否是绝对路径
 * @param {String} p 当前模块的路径
 * @return {Boolean}
 */
function isAbsolutePath(p) {
    return path.isAbsolute(p);
}

/**
 * 判断传入的模块路径是否是npm路径
 * @param {String} p 当前模块的路径
 * @return {Boolean}
 */
function isModulePath(p) {
    return !isAbsolutePath(p) && !isRelativePath(p);
}

/**
 * 返回filename的相关信息
 * @param {String} filename 被依赖的模块文件名
 * @param {String} dependentFilename 依赖的模块文件名
 * @return {Object<originalFilename, filename, absoluteFilename, isNpmModule>}
 */
function getFilenameInfo(filename, dependentFilename) {
    const parsedFilename = path.parse(filename);
    const originalFilename = filename;
    let actualFilename = originalFilename;

    if (!parsedFilename.ext) {
        actualFilename = `${actualFilename}.js`;
    }

    let absoluteFilename = actualFilename;
    let isNpmModule = false;

    if (isModulePath(actualFilename)) {
        isNpmModule = true;
    } else if (isRelativePath(actualFilename)) {
        const dependentFileDir = path.dirname(dependentFilename);
        absoluteFilename = path.join(dependentFileDir, actualFilename);
    }

    return {
        originalFilename,
        filename: actualFilename,
        absoluteFilename,
        isNpmModule,
    };
}

exports.isRelativePath = isRelativePath;
exports.isAbsolutePath = isAbsolutePath;
exports.isModulePath = isModulePath;
exports.getFilenameInfo = getFilenameInfo;
