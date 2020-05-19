const path = require('path');

function isRelativePath(p) {
    return /^\./.test(p);
}

function isAbsolutePath(p) {
    return path.isAbsolute(p);
}

function isModulePath(p) {
    return !isAbsolutePath(p) && !isRelativePath(p);
}

function getAppRelativePath(p, platform) {
    const appDir = process.cwd();
    const platformRange = ['posix', 'win32'];

    if (!platformRange.includes(platform)) {
        return path.relative(appDir, p);
    }

    return path[platform].format(path.parse(path.relative(appDir, p)));
}

/**
 * 返回filename的相关信息
 * @param {String} filename 被依赖的模块文件名
 * @param {String} dependentFilename 依赖的模块文件名
 * @returns {Object<filename, absoluteFilename, isNpmModule>}
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
exports.getAppRelativePath = getAppRelativePath;
exports.getFilenameInfo = getFilenameInfo;
