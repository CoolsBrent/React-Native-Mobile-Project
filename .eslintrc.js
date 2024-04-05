module.exports = {
    env: {
        es2021: true,
        node: true,
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended',
        'universe/native',
        'universe/web',
        'prettier',
    ],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        'react/prop-types': 'off',
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'always-multiline',
            },
        ],
        semi: ['error', 'never'],
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'none',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'comma',
                    requireLast: false,
                },
                multilineDetection: 'brackets',
            },
        ],
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'prettier/prettier': [
            'error',
            {
                arrowParens: 'avoid',
                bracketSameLine: true,
                bracketSpacing: false,
                semi: false,
                singleQuote: true,
                jsxSingleQuote: false,
                quoteProps: 'as-needed',
                trailingComma: 'all',
                singleAttributePerLine: true,
                htmlWhitespaceSensitivity: 'css',
                proseWrap: 'preserve',
                insertPragma: false,
                printWidth: 120,
                requirePragma: false,
                tabWidth: 4,
                useTabs: false,
                embeddedLanguageFormatting: 'auto',
                endOfLine: 'auto',
            },
        ],
    },
}
