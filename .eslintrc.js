module.exports = {
    "root": true,
    "installedESLint": false,
    "parser": 'babel-eslint',
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": 'module'
    },
    "extends": "eslint:recommended",
    "env": {
        "browser": true,
        "es6": true,
    },
    "ecmaFeatures": {
        "arrowFunctions": true,
        "binaryLiterals": true,
        "blockBindings": true,
        "classes": true,
        "defaultParams": true,
        "destructuring": true,
        "forOf": true,
        "generators": true,
        "modules": true,
        "objectLiteralComputedProperties": true,
        "objectLiteralDuplicateProperties": true,
        "objectLiteralShorthandMethods": true,
        "objectLiteralShorthandProperties": true,
        "octalLiterals": true,
        "regexUFlag": true,
        "regexYFlag": true,
        "spread": true,
        "superInFunctions": true,
        "templateStrings": true,
        "unicodeCodePointEscapes": true,
        "globalReturn": true
     },
    // add your custom rules here
    "rules": {
        // allow paren-less arrow functions
        "arrow-parens": 0,
        // allow async-await
        "generator-star-spacing": 0,
        // allow debugger during development
        "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,

        "no-console": 0
    },
    "globals": {
        module: true,
        jQuery: true
    }
};
