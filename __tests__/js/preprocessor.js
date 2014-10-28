// Source: https://github.com/Khan/react-components/blob/master/test/compiler.js
var fs = require('fs');
var ReactTools = require('react-tools');

var origJs = require.extensions['.js'];

function transform(module, filename) {
  var content;
  content = fs.readFileSync(filename, 'utf8');
  if (content.indexOf('@jsx') > 0) {
    var compiled = ReactTools.transform(content, {harmony: true});
    return module._compile(compiled, filename);
  } else {
    return origJs(module, filename);
  }
}

require.extensions['.js'] = transform;
