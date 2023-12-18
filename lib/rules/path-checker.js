/**
 * @fileoverview feature sliced relative paths checker
 * @author Marina Diubailo
 */
'use strict';
const path = require('path');
const { isPathRelative } = require('../helpers');
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        messages: {
            avoidAbsolutePath: 'within one slide, all paths must be relative',
        },
        type: null,
        docs: {
            description: 'feature sliced relative paths checker',
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
                },
            },
        ],
    },

    create(context) {
        const alias = context.options[0]?.alias || '';

        return {
            ImportDeclaration(node) {
                try {
                    const value = node.source.value;
                    const importTo = alias
                        ? value.replace(`${alias}/`, '')
                        : value;
                    const fromFileName = context.filename;

                    if (shouldBeRelative(fromFileName, importTo)) {
                        context.report({
                            node,
                            messageId: 'avoidAbsolutePath',
                            fix: (fixer) => {
                                const normalizedPath =
                                    getNormalizedCurrentFilePath(fromFileName)
                                        .split('/')
                                        .slice(0, -1)
                                        .join('/');
                                let relativePath = path
                                    .relative(normalizedPath, `/${importTo}`)
                                    .split('\\')
                                    .join('/');

                                if (!relativePath.startsWith('.')) {
                                    relativePath = `./${relativePath}`;
                                }

                                return fixer.replaceText(
                                    node.source,
                                    `'${relativePath}'`,
                                );
                            },
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            },
        };
    },
};

const layers = {
    entities: 'entities',
    features: 'features',
    shared: 'shared',
    app: 'app',
    widgets: 'widgets',
    pages: 'pages',
};

function getNormalizedCurrentFilePath(currentFilePath) {
    const normalizedPath = path.toNamespacedPath(currentFilePath);
    const projectFrom = normalizedPath.split('src')[1];
    return projectFrom?.split('\\').join('/');
}

function shouldBeRelative(from, to) {
    if (isPathRelative(to)) return false;

    const toArray = to.split('/');
    const toLayer = toArray[0];
    const toSlice = toArray[1];

    if (!toLayer || !toSlice || !layers[toLayer]) return false;

    const projectFrom = getNormalizedCurrentFilePath(from);
    const fromArray = projectFrom.split('/');
    const fromLayer = fromArray[1];
    const fromSlice = fromArray[2];

    if (!fromLayer || !fromSlice || !layers[fromLayer]) return false;

    return fromSlice === toSlice && toLayer === fromLayer;
}
