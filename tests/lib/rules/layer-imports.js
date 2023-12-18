/**
 * @fileoverview correct imports between layers
 * @author Marina Diubailo
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/layer-imports'),
    RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const aliasOptions = [
    {
        alias: '@',
    },
];

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('layer-imports', rule, {
    valid: [
        {
            filename:
                'D:\\Projects\\Production-project\\src\\features\\Article',
            code: "import { Button } from '@/shared/Button.tsx'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\features\\Article',
            code: "import { Article } from '@/entities/Article'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'D:\\Projects\\Production-project\\src\\app\\providers',
            code: "import { SideBar } from '@/widgets/SideBar'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'D:\\Projects\\Production-project\\src\\widgets\\Pages',
            code: "import { useLocation } from 'react-router-dom'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'D:\\Projects\\Production-project\\src\\app\\providers',
            code: "import { Redux } from 'redux'",
            errors: [],
            options: aliasOptions,
        },
        {
            filename: 'D:\\Projects\\Production-project\\src\\index.tsx',
            code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
            errors: [],
            options: aliasOptions,
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\Article.tsx',
            code: "import { StateSchema } from '@/app/providers/StoreProvider'",
            errors: [],
            options: [
                {
                    alias: '@',
                    ignoreImportPatterns: ['**/StoreProvider'],
                },
            ],
        },
    ],

    invalid: [
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\Notifications',
            code: "import { Article} from '@/features/Article'",
            errors: [
                {
                    message: 'a layer should import only underlying layers',
                },
            ],
            options: aliasOptions,
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\features\\AddNewComment',
            code: "import { SideBar } from '@/widgets/SideBar'",
            errors: [
                {
                    message: 'a layer should import only underlying layers',
                },
            ],
            options: aliasOptions,
        },
        {
            filename:
                'D:\\Projects\\Production-project\\src\\entities\\Article',
            code: "import { NavBar } from '@/widgets/NavBar'",
            errors: [
                {
                    message: 'a layer should import only underlying layers',
                },
            ],
            options: aliasOptions,
        },
    ],
});
