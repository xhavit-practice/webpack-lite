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
 */
function getAST(absoluteFilename) {
    const source = readFileSync(absoluteFilename, 'utf-8');
    const ast = parse(source, {
        sourceType: 'module',
    });

    return ast;
}

/**
 * 根据ast解析该模块的依赖
 * @param {Object} ast ast对象
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
 * 修改ast的依赖路径为对应的索引值
 * @param {Object} ast ast对象
 * @param {Number} moduleIndex 该模块在整个模块依赖树中的索引值
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
 * @returns {Promise<String>} 格式化后的代码
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
