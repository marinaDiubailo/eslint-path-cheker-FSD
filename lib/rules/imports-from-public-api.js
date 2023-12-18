/**
 * @fileoverview imports from public api
 * @author Marina Diubailo
 */
'use strict';
const micromatch = require('micromatch');
const { isPathRelative } = require('../helpers');
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        messages: {
            importsShouldBeFromPublicApi:
                'imports from modules should be performed via public api (index.ts)',
            testingDataShouldBeFromPublicApi:
                'testing data should be performed via public api (testing.ts)',
        },
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'feature sliced imports from public api',
            recommended: false,
            url: null,
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string',
                    },
                    testFilesPatterns: {
                        type: 'array',
                    },
                },
            },
        ],
    },

    create(context) {
        const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};

        const avalibleLayers = {
            entities: 'entities',
            features: 'features',
            widgets: 'widgets',
            pages: 'pages',
        };

        return {
            ImportDeclaration(node) {
                const value = node.source.value;
                const importTo = alias ? value.replace(`${alias}/`, '') : value;

                if (isPathRelative(importTo)) return;

                const segments = importTo.split('/');
                const layer = segments[0];
                const slice = segments[1];

                if (!avalibleLayers[layer]) return;

                const isImportNotFromPublicApi = segments.length > 2;
                const isTestingPublicApi =
                    segments[2] === 'testing' && segments.length < 4;

                if (isImportNotFromPublicApi && !isTestingPublicApi) {
                    context.report({
                        node,
                        messageId: 'importsShouldBeFromPublicApi',
                        fix: (fixer) => {
                            return fixer.replaceText(
                                node.source,
                                `'${alias}/${layer}/${slice}'`
                            );
                        },
                    });
                }

                if (isTestingPublicApi) {
                    const currentFilePath = context.filename;
                    const isCurrentFileTesting = testFilesPatterns.some(
                        (pattern) =>
                            micromatch.isMatch(currentFilePath, pattern)
                    );

                    if (!isCurrentFileTesting) {
                        context.report({
                            node,
                            messageId: 'testingDataShouldBeFromPublicApi',
                        });
                    }
                }
            },
        };
    },
};
