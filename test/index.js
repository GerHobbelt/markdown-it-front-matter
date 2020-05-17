/* eslint-env node, mocha */

const assert = require('assert');

describe('Markdown It Front Matter', () => {

  let foundFrontmatter;
  const md = require('@gerhobbelt/markdown-it')()
    .use(require('../'), {
      callback: fm => { foundFrontmatter = fm; }
    });

  beforeEach(() => {
    foundFrontmatter = undefined;
  });

  it('should parse empty front matter', () => {
    assert.equal(
      md.render([
        '---',
        '---',
        '# Head'
      ].join('\n')),
      '\n<h1>Head</h1>\n');

    assert.equal(foundFrontmatter, '');
  });

  it('should parse basic front matter', () => {
    assert.equal(
      md.render([
        '---',
        'x: 1',
        '---',
        '# Head'
      ].join('\n')),
      '\n<h1>Head</h1>\n');

    assert.equal(foundFrontmatter, 'x: 1');
  });

  it('should parse until triple dots', () => {
    assert.equal(
      md.render([
        '---',
        'x: 1',
        '...',
        '# Head'
      ].join('\n')),
      '\n<h1>Head</h1>\n');

    assert.equal(foundFrontmatter, 'x: 1');
  });

  it('should parse front matter with indentation', () => {
    const frontmatter = [
      'title: Associative arrays',
      'people:',
      '    name: John Smith',
      '    age: 33',
      'morePeople: { name: Grace Jones, age: 21 }'
    ].join('\n');

    assert.equal(
      md.render([
        '---',
        frontmatter,
        '---',
        '# Head'
      ].join('\n')),
      '\n<h1>Head</h1>\n');

    assert.equal(foundFrontmatter, frontmatter);
  });

  it('should ignore spaces after front matter delimiters', () => {
    assert.equal(
      md.render([
        '---   ',
        'x: 1',
        '---  ',
        '# Head'
      ].join('\n')),
      '\n<h1>Head</h1>\n');

    assert.equal(foundFrontmatter, '  \nx: 1');
  });

  it('should ignore front matter with less than 3 opening dashes', () => {
    assert.equal(
      md.render([
        '--',
        'x: 1',
        '---',
        '# Head'
      ].join('\n')),
      '<h2>--\nx: 1</h2>\n<h1>Head</h1>\n');

    assert.equal(foundFrontmatter, undefined);
  });

  it('should require front matter have matching number of opening and closing dashes', () => {
    assert.equal(
      md.render([
        '----',
        'x: 1',
        '---',
        '# Head'
      ].join('\n')),
      '');

    assert.equal(foundFrontmatter, 'x: 1\n---');
  });

  it('can use custom members of its options object in the user-defined callback', () => {
    const options = {
      foo: 1,
      bar: 2,
      callback: function (fm, token, state) {
        // Note: we reference `this`, hence cannot use a lambda function like in the other tests above,
        // as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        /* eslint consistent-this:off */
        foundFrontmatter = this;
        this.foo = fm;

          // test the additional callback parameters:
        assert.equal(token.type, 'front_matter');
        assert.equal(token.meta, fm);
        assert.equal(state.src, '----\nx: 3\n---\n# Head');
        assert.equal(!!state.env, true);
        assert.equal(typeof state.env, 'object');
      }
    };
    const md = require('@gerhobbelt/markdown-it')()
      .use(require('../'), options);

    assert.equal(
      md.render([
        '----',
        'x: 3',
        '---',
        '# Head'
      ].join('\n')),
      '');

    // options object HAS been copied inside markdown-it-front-matter:
    assert.notEqual(foundFrontmatter, options);

    assert.equal(foundFrontmatter.foo, 'x: 3\n---');
    assert.equal(foundFrontmatter.bar, 2);
    assert.equal(typeof foundFrontmatter.callback, 'function');
  });


});
