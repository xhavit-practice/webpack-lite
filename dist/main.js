(function (modules) {
    function require(filename) {
        var fn = modules[filename];
        var module = { exports: {} };

        fn(require, module, module.exports);

        return module.exports;
    }

    require('be3e3347-53e4-41d4-b936-d7b9e727ba71');
})({
    /* ./example/index.js */
    'be3e3347-53e4-41d4-b936-d7b9e727ba71': function (
        require,
        module,
        exports
    ) {
        'use strict';

        var _fa269353B8cf44baA51fD9d5292b = _interopRequireDefault(
            require('fa269353-b8cf-44ba-a51f-d9d5292b6884')
        );

        var _ce9fF29845b4Be6cF5fc61c0a4be = _interopRequireDefault(
            require('4819ce9f-f298-45b4-be6c-f5fc61c0a4be')
        );

        var _b3ee5b03052d42de9f9b9b92f1eb24ba = _interopRequireDefault(
            require('b3ee5b03-052d-42de-9f9b-9b92f1eb24ba')
        );

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }

        console.log(
            (0, _fa269353B8cf44baA51fD9d5292b['default'])('webpack-lite')
        );
        console.log(
            (0, _ce9fF29845b4Be6cF5fc61c0a4be['default'])('webpack-lite')
        );
        console.log(
            (0, _b3ee5b03052d42de9f9b9b92f1eb24ba['default'])('webpack-lite')
        );
    },
    /* ./a.js */
    'fa269353-b8cf-44ba-a51f-d9d5292b6884': function (
        require,
        module,
        exports
    ) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
            value: true,
        });
        exports['default'] = a;

        var _e37d8c86Db114d1382deD01fdf159df = _interopRequireDefault(
            require('e37d8c86-db11-4d13-82de-d01fdf159df1')
        );

        var _ca19eD70e43558543194f7cc = _interopRequireDefault(
            require('164ca19e-d70e-4355-8543-194f7cc75965')
        );

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }

        function a(name) {
            return ''
                .concat(
                    (0, _e37d8c86Db114d1382deD01fdf159df['default'])(name),
                    ' '
                )
                .concat(
                    (0, _ca19eD70e43558543194f7cc['default'])(name),
                    ' - a'
                );
        }
    },
    /* ./b.js */
    'e37d8c86-db11-4d13-82de-d01fdf159df1': function (
        require,
        module,
        exports
    ) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
            value: true,
        });
        exports['default'] = b;

        function b(name) {
            return ''.concat(name, ' - b');
        }
    },
    /* ./d.js */
    '164ca19e-d70e-4355-8543-194f7cc75965': function (
        require,
        module,
        exports
    ) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
            value: true,
        });
        exports['default'] = d;

        function d(name) {
            return ''.concat(name, ' - d');
        }
    },
    /* ./c.js */
    '4819ce9f-f298-45b4-be6c-f5fc61c0a4be': function (
        require,
        module,
        exports
    ) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
            value: true,
        });
        exports['default'] = c;

        function c(name) {
            return ''.concat(name, ' - c');
        }
    },
    /* ./e.js */
    'b3ee5b03-052d-42de-9f9b-9b92f1eb24ba': function (
        require,
        module,
        exports
    ) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
            value: true,
        });
        exports['default'] = e;

        function e(name) {
            return ''.concat(name, ' - e');
        }
    },
});
