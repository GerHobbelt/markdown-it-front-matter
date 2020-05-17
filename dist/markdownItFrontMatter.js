/*! markdown-it-front-matter 0.2.1-2 https://github.com//GerHobbelt/markdown-it-front-matter @license MIT */

'use strict';

module.exports = function front_matter_plugin(md, opts) {
  opts = Object.assign({}, opts);
  let min_markers = 3,
      marker_str = '-',
      marker_char = marker_str.charCodeAt(0),
      marker_len = marker_str.length;

  function frontMatter(state, startLine, endLine, silent) {
    let pos,
        nextLine,
        marker_count,
        token,
        old_parent,
        old_line_max,
        start_content,
        auto_closed = false,
        start = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    if (startLine !== 0 || marker_char !== state.src.charCodeAt(0)) {
      return false;
    }

    for (pos = start + 1; pos <= max; pos++) {
      if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
        start_content = pos + 1;
        break;
      }
    }

    marker_count = Math.floor((pos - start) / marker_len);

    if (marker_count < min_markers) {
      return false;
    }

    pos -= (pos - start) % marker_len;

    if (silent) {
      return true;
    }

    nextLine = startLine;

    for (;;) {
      nextLine++;

      if (nextLine >= endLine) {
        break;
      }

      if (state.src.slice(start, max) === '...') {
        break;
      }

      start = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (start < max && state.sCount[nextLine] < state.blkIndent) {
        break;
      }

      if (marker_char !== state.src.charCodeAt(start)) {
        continue;
      }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        continue;
      }

      for (pos = start + 1; pos <= max; pos++) {
        if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
          break;
        }
      }

      if (Math.floor((pos - start) / marker_len) < marker_count) {
        continue;
      }

      pos -= (pos - start) % marker_len;
      pos = state.skipSpaces(pos);

      if (pos < max) {
        continue;
      }

      auto_closed = true;
      break;
    }

    old_parent = state.parentType;
    old_line_max = state.lineMax;
    state.parentType = 'container';
    state.lineMax = nextLine;
    token = state.push('front_matter', null, 0);
    token.hidden = true;
    token.markup = state.src.slice(startLine, pos);
    token.block = true;
    token.map = [startLine, pos];
    token.meta = state.src.slice(start_content, start - 1);
    state.parentType = old_parent;
    state.lineMax = old_line_max;
    state.line = nextLine + (auto_closed ? 1 : 0);

    if (opts.callback) {
      opts.callback.call(opts, token.meta, token, state);
    }

    return true;
  }

  md.block.ruler.before('table', 'front_matter', frontMatter, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
};
//# sourceMappingURL=markdownItFrontMatter.js.map
