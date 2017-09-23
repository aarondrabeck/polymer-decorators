⚠ **Experimental!** This repository is a work in progress and may not work as expected. ⚠

[![Travis Build Status](https://travis-ci.org/Polymer/polymer-decorators.svg?branch=master)](https://travis-ci.org/Polymer/polymer-decorators)

# polymer-decorators

TypeScript decorators for Polymer 2.0 and 3.0.

## Installation

The Polymer Decorators are available in two forms:

1. An HTML Imports version for Polymer 2.0 projects. This version defines the
   `Polymer.decorators` global.

2. An ES Modules version for Polymer 3.0 projects. This version can also be
   used for Polymer 2.0 projects that are configured to load or bundle external
   modules (e.g. using WebPack).

### Installation with HTML Imports + Bower

- Install the decorators:
  ```sh
  bower install --save Polymer/polymer-decorators
  ```

- Import the decorator library in each of your component definitions:
  ```html
  <link rel="import" href="/bower_components/polymer-decorators/polymer-decorators.html">
  ```

- Include the decorator type declarations in one of the source files in your
  TypeScript project (be sure to update the reference below with the correct
  relative path):
  ```ts
  /// <reference path="../bower_components/polymer-decorators/global.d.ts" />
  ```

- Alternatively, configure your `tsconfig.json` to always include the type
  declarations:
  ```js
  {
    "compilerOptions": {
      "typeRoots": [
        "bower_components"
      ],
      "types": [
        "polymer-decorators/global"
      ]
    }
  }
  ```

- Define a custom element:
  ```ts
  @Polymer.decorators.customElement('my-element')
  class MyElement extends Polymer.Element {

    @Polymer.decorators.property({type: String})
    myProperty: string = 'Hello';
  }
  ```

- Optional: [configure Metadata Reflection](#metadata-reflection-api) to define
  properties more concisely.


### Installation with ES Modules + NPM/Yarn

- Install the `@polymer/decorators` package. (Caution: the
  <strike>`polymer-decorators`</strike> NPM package is not associated with this
  repository).
  ```sh
  yarn add --flat @polymer/decorators
  ```

- Import the decorator functions and define a custom element:
  ```ts
  import {customElement, property} from '@polymer/decorators';

  @customElement('my-element')
  class MyElement extends PolymerElement {

    @property({type: String})
    myProperty: string = 'Hello';
  }
  ```

- Optional: [configure Metadata Reflection](#metadata-reflection-api) to define
  properties more concisely.


## <strike>Polymer 1.0</strike>

This library is **not** compatible with Polymer 1.0 or earlier, because it
depends on the ES6 class-based component definition style introduced in Polymer
2.0. Community-maintained TypeScript decorator options for Polymer 1.0 include
[nippur72/PolymerTS](https://github.com/nippur72/PolymerTS) and
[Cu3PO42/polymer-decorators](https://github.com/Cu3PO42/polymer-decorators).

## Metadata Reflection API

To annotate your Polymer property types more concisely, you may configure
experimental support for the [Metadata Reflection
API](https://rbuckton.github.io/reflect-metadata/). Note that this API is [not
yet a formal ECMAScript
proposal](https://github.com/rbuckton/reflect-metadata/issues/9), but a
polyfill is available, and TypeScript has experimental support.

```ts
// Without Metadata Reflection, the type must be passed explicitly to the
// decorator factory, because type information is not available at runtime.
@property({type: String})
myProperty: string;

// With Metadata Reflection, the TypeScript type annotation is sufficient,
// because the compiler will emit type information automatically.
@property()
myProperty: string;
```

To enable Metadata Reflection:

- Enable the
  [`emitDecoratorMetadata`](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)
  TypeScript compiler setting. Use the `--emitDecoratorMetadata` flag, or update your
  `tsconfig.json`:
  ```js
  "compilerOptions": {
    "emitDecoratorMetadata": true
  }
  ```

- Install the Metadata Reflection API runtime polyfill from
  [rbuckton/reflect-metadata](https://github.com/rbuckton/reflect-metadata):
  ```sh
  bower install --save rbuckton/reflect-metadata
  ```

- Load the polyfill at the top-level of your application, and in your tests:
  ```html
  <script src="/bower_components/reflect-metadata/Reflect.js"></script>
  ```

## Example

```typescript
import {customElement, property, query, queryAll, observe} from '../polymer-decorators/typescript/decorators.js';

// This sets the static `is` property and registers the element
@customElement('test-element')
class TestElement extends Polymer.Element {

  // @property replaces the static `property` getter.
  // The type is read from the type annotation, `notify` is the same as in
  // plain Polymer
  @property({notify: true})
  foo: number = 42;

  // This property doesn't fire bar-changed events
  @property()
  bar: string = 'yes';

  // @query replaces the property with a getter that querySelectors() in
  // the shadow root. Use this for type-safe access to internal nodes.
  @query('h1')
  header: HTMLHeadingElement;

  @queryAll('input')
  allInputs: HTMLInputElement[];

  // This method will be called when `foo` changes
  @observe('foo')
  private _fooChanged(newValue: number) {
    console.log(`foo is now: ${newValue}`);
  }

  // @observe can take an array of properties
  @observe(['foo', 'bar'])
  private _fooBarChanged(newFoo: number, newBar: string) {
    console.log(`foo is now: ${newFoo}, bar is now ${newBar}`);
  }

}
```
