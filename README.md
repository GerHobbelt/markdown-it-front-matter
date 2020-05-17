# markdown-it-front-matter

[![Build Status](https://img.shields.io/travis/GerHobbelt/markdown-it-front-matter/master.svg?style=flat)](https://travis-ci.org/GerHobbelt/markdown-it-front-matter)
[![NPM version](https://img.shields.io/npm/v/@gerhobbelt/markdown-it-front-matter.svg?style=flat)](https://www.npmjs.org/package/@gerhobbelt/markdown-it-front-matter)
[![Coverage Status](https://img.shields.io/coveralls/GerHobbelt/markdown-it-front-matter/master.svg?style=flat)](https://coveralls.io/r/GerHobbelt/markdown-it-front-matter?branch=master)

> Plugin for processing front matter for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.


### Valid Front Matter

Essentially, valid front matter is a fenced block:

  * Indicated by **three** or **more** dashes: `---`
  * Opening and closing fences must be the same number of *dash* characters
  * Opening fence must begin on the first line of the markdown string/file
  * Opening fence must not be indented

```yaml
---
valid-front-matter: true
---
```

> The example above uses YAML but YAML is not required

> (bring your own front matter parser, e.g. [front-matter](https://www.npmjs.com/package/gray-matter))


### Example

  * Front Matter is not rendered.
  * Any markup inside the block is passed to the **required** callback function as the first parameter.
  * The markdown_it 'front_matter' token is passed to the callback in the second argument.
  * The markdown_it `state` object is passed in the third argument.
  * The callback's `this` references the active markdown-it-front-matter options object 
    (which is a [`Object.assign()`-ed copy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) of the options object you passed earlier into the `use()` API call).

```javascript
const md = require('@gerhobbelt/markdown-it')()
  .use(require('@gerhobbelt/markdown-it-front-matter'), {
    callback: function(fm, token, state) {
      console.log(fm);
    }
  });

let result = md.render('---\ntitle: This is the Title\n---\n# Heading\n----\nsome text');

// > title: This is the Title
```

Code heavily borrowed from [markdown-it-container](https://github.com/markdown-it/markdown-it-container)

Thank you:

- [puzrin](https://github.com/puzrin)
- [rlidwka](https://github.com/rlidwka)
