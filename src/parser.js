const { readFileSync } = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');
const prettier = require('prettier');
const { getFilenameInfo } = require('./util');

/**
 * 将absoluteFilename对应的文件转换成ast对象
 * @param {String} absoluteFilename
 * @return {Object} AST Object
 */
function getAST(absoluteFilename) {
    const source = readFileSync(absoluteFilename, 'utf-8');
    const ast = parse(source, {
        sourceType: 'module',
    });

    return ast;
}

/**
 * 根据当前模块的ast和绝对路径，获取当前模块的依赖
 * @param {Object} ast 当前模块对应的ast对象
 * @param {String} absoluteFilename 当前模块对应的绝对路径
 */
function getDependencies(ast, absoluteFilename) {
    const dependencies = [];

    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            dependencies.push(
                getFilenameInfo(node.source.value, absoluteFilename)
            );
        },
    });

    return dependencies;
}

/**
 * 修改当前模块ast树上的模块声明语句的路径
 * @param {Object} ast 当前模块对应的ast
 * @param {Array} dependencies 当前模块对应的依赖
 * @param {Object} modulesMap 当前entry相关的所有模块
 */
function updateAstDependencies(ast, dependencies, modulesMap) {
    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            let filename = node.source.value;

            const match = dependencies.find((dependency) => {
                return (
                    !dependency.isNpmModule &&
                    dependency.originalFilename === filename
                );
            });

            if (match) {
                filename = `${modulesMap[match.absoluteFilename].id}`;
            }

            node.source.value = filename;
        },
    });
}

/**
 * 将ast转换成源码
 * @param {Object} ast
 * @return {String} 转换后的代码
 */
function transform(ast) {
    const { code } = transformFromAst(ast, null, {
        presets: ['@babel/preset-env'],
    });

    return code;
}

/**
 * 用pritter格式化代码
 * @param {String} code 需要被格式化的代码
 * @return {Promise<String>} 格式化后的代码
 */
function formatCode(code) {
    return prettier
        .resolveConfig(path.join(__dirname, '../.prettierrc'))
        .then((options) => {
            return prettier.format(code, options);
        });
}

exports.getAST = getAST;
exports.getDependencies = getDependencies;
exports.updateAstDependencies = updateAstDependencies;
exports.transform = transform;
exports.formatCode = formatCode;
