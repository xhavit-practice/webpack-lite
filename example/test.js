const path = require('path');
const { getAST, getDependencies, transform } = require('../src/parser');

const ast = getAST(path.join(__dirname, './index.js'));

console.log(ast);
console.log(getDependencies(ast));
console.log(transform(ast));
