const { existsSync, mkdirSync, writeFileSync } = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getFilenameInfo } = require('./util');
const {
    getAST,
    getDependencies,
    updateAstDependencies,
    transform,
    formatCode,
} = require('./parser');

module.exports = class Compiler {
    constructor(options) {
        const { entry, output } = options;

        this.entry = entry;
        this.output = output;
        this.modules = [];
        this.modulesMap = {};
    }

    run() {
        this.buildModules();
        this.emitFiles();

        // console.log(this.modules);
        // console.log(this.modulesMap);
    }

    buildModules() {
        this.genModules(this.entry, path.join(process.cwd(), 'index.js'));

        this.modules.forEach((m, i) => {
            updateAstDependencies(m.ast, m.dependencies, this.modulesMap);
            m.source = transform(m.ast);
        });
    }

    genModules(filename, dependentFilename) {
        const module = this.genModule(filename, dependentFilename);

        this.modules.push(module);
        this.modulesMap[module.absoluteFilename] = { id: module.id };

        if (module.dependencies.length) {
            module.dependencies.forEach((dependency) => {
                this.genModules(dependency.filename, module.absoluteFilename);
            });
        }
    }

    genModule(filename, dependentFilename) {
        const filenameInfo = getFilenameInfo(filename, dependentFilename);
        const { absoluteFilename } = filenameInfo;
        const ast = getAST(absoluteFilename);
        const dependencies = getDependencies(ast, absoluteFilename);

        console.log(uuidv4());

        return {
            ...filenameInfo,
            index: this.modules.length,
            id: uuidv4(),
            ast,
            dependencies,
        };
    }

    emitFiles() {
        const outputPath = path.join(this.output.path, this.output.filename);
        const modulesStr = this.modules.reduce((acc, m, i) => {
            const isFinal = i === this.modules.length - 1;
            const newAcc = `${acc}
                /*${m.filename}*/
                '${m.id}': function(require, module, exports) {${m.source}}`;
            return isFinal ? `{${newAcc}}` : `${newAcc},`;
        }, '');

        const bundle = `(function (modules) {
            function require(filename) {
                var fn = modules[filename];
                var module = { exports: {} };

                fn(require, module, module.exports);

                return module.exports;
            }

            require('${this.modules[0].id}');
        })(${modulesStr});`;

        if (!existsSync(outputPath)) {
            mkdirSync(path.dirname(outputPath), { recursive: true });
        }

        formatCode(bundle).then((formattedBundle) => {
            writeFileSync(outputPath, formattedBundle);
        });
    }
};
