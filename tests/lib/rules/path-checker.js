/**
 * @fileoverview feature sliced relative paths checker
 * @author Marina Diubailo
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/path-checker'),
    RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('path-checker', rule, {
    valid: [
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\Article',
            code: "import { articleActions, articleReducer } from '../../model/slices/articleSlice'",
            errors: [],
        },
    ],

    invalid: [
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\Article',
            code: "import { articleActions, articleReducer } from 'entities/Article/model/slices/articleSlice'",
            errors: [
                { message: 'within one slide, all paths must be relative' },
            ],
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\Article',
            code: "import { articleActions, articleReducer } from '@/entities/Article/model/slices/articleSlice'",
            errors: [
                { message: 'within one slide, all paths must be relative' },
            ],
            options: [
                {
                    alias: '@',
                },
            ],
        },
    ],
});
