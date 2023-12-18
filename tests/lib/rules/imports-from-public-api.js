/**
 * @fileoverview imports from public api
 * @author Marina Diubailo
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/imports-from-public-api'),
    RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const aliasOptions = [
    {
        alias: '@',
    },
];

ruleTester.run('imports-from-public-api', rule, {
    valid: [
        {
            code: "import { articleActions, articleReducer } from '../../model/slices/articleSlice'",
            errors: [],
        },
        {
            code: "import { articleActions, articleReducer } from '@/entities/Article'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\file.test.ts',
            code: "import { articleActions, articleReducer } from '@/entities/Article/testing'",
            errors: [],
            options: [
                {
                    alias: '@',
                    testFilesPatterns: [
                        '**/*.test.ts',
                        '**/*.story.ts',
                        '**/StoreDecorator.tsx',
                    ],
                },
            ],
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\StoreDecorator.tsx',
            code: "import {  articleActions, articleReducer } from '@/entities/Article/testing'",
            errors: [],
            options: [
                {
                    alias: '@',
                    testFilesPatterns: [
                        '**/*.test.ts',
                        '**/*.story.ts',
                        '**/StoreDecorator.tsx',
                    ],
                },
            ],
        },
    ],

    invalid: [
        {
            code: "import { articleActions, articleReducer } from '@/entities/Article/model/file.ts'",
            errors: [
                {
                    message:
                        'imports from modules should be performed via public api (index.ts)',
                },
            ],
            options: aliasOptions,
            output: "import { articleActions, articleReducer } from '@/entities/Article'",
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\StoreDecorator.tsx',
            code: "import { articleActions, articleReducer } from '@/entities/Article/testing/file.tsx'",
            errors: [
                {
                    message:
                        'imports from modules should be performed via public api (index.ts)',
                },
            ],
            options: [
                {
                    alias: '@',
                    testFilesPatterns: [
                        '**/*.test.ts',
                        '**/*.story.ts',
                        '**/StoreDecorator.tsx',
                    ],
                },
            ],
            output: "import { articleActions, articleReducer } from '@/entities/Article'",
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\forbidden.ts',
            code: "import { articleActions, articleReducer } from '@/entities/Article/testing'",
            errors: [
                {
                    message:
                        'testing data should be performed via public api (testing.ts)',
                },
            ],
            options: [
                {
                    alias: '@',
                    testFilesPatterns: [
                        '**/*.test.ts',
                        '**/*.story.ts',
                        '**/StoreDecorator.tsx',
                    ],
                },
            ],
            output: null,
        },
    ],
});
