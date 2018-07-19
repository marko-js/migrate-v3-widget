<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko/migrate-v3-widget
	<br/>

  <!-- Language -->
  <a href="http://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-typescript-blue.svg" alt="TypeScript"/>
  </a>
  <!-- Format -->
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with prettier"/>
  </a>
  <!-- CI -->
  <a href="https://travis-ci.org/marko-js/migrate-v3-widget">
  <img src="https://img.shields.io/travis/marko-js/migrate-v3-widget.svg" alt="Build status"/>
  </a>
  <!-- Coverage -->
  <a href="https://coveralls.io/github/marko-js/migrate-v3-widget">
    <img src="https://img.shields.io/coveralls/marko-js/migrate-v3-widget.svg" alt="Test Coverage"/>
  </a>
</h1>

Migrates a Marko **v3 widget** to a **v4 component**.

_Note: You probably want to use the [marko migrate](https://github.com/marko-js/cli/blob/master/packages/migrate/README.md) command instead of using this directly._

# Installation

```console
npm install @marko/migrate-v3-widget
```

# Example

```javascript
import migrate from "@marko/migrate-v3-widget";

migrate("./path-to-widget-file.js").then(code => {
  code; // Migrated code
});
```

## Code of Conduct

This project adheres to the [eBay Code of Conduct](./.github/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
