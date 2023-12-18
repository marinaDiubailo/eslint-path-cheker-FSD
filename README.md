# eslint-plugin-eslint-correct-paths-plugin

eslint plugin to correct import paths

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-eslint-correct-paths-plugin`:

```sh
npm install eslint-plugin-eslint-correct-paths-plugin --save-dev
```

## Usage

Add `eslint-correct-paths-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["eslint-correct-paths-plugin"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "eslint-correct-paths-plugin/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

TODO: Run eslint-doc-generator to generate the rules list.

<!-- end auto-generated rules list -->

1. path-checker - запрещает использовать абсолютные импорты в рамках одного модуля
2. layer-imports - проверяет корректность использования слоев с точки зрения FSD
   (например widgets нельзя использовать в features и entitites)
3. imports-from-public-api - разрешает импорт из других модулей только из public api. Имеет auto fix
