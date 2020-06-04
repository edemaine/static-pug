import { MultiFileCachingCompiler } from 'meteor/caching-compiler';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  'pug': '3.0.0'
}, 'static-pug');

pug = require('pug');

class PugCompiler extends MultiFileCachingCompiler {
  constructor() {
    super({
      compilerName: 'static-pug',
      defaultCacheSize: 1024*1024*10,
    });
  }

  getCacheKey(inputFile) {
    return inputFile.getSourceHash();
  }

  // Treat files with names *.import.pug as imports, not root files that
  // should get converted.
  isRoot(inputFile) {
    return !inputFile.getPathInPackage().endsWith('.import.pug');
  }

  compileOneFile(inputFile) {
    // Convert PUG to HTML and dependency list
    const inputPackage = inputFile.getPackageName() || '';
    const inputPath = inputFile.getPathInPackage();
    const template = pug.compile(inputFile.getContentsAsString(), {
      filename: inputPath,
    });
    const dependencies = template.dependencies.map((relative) =>
      Plugin.path.join(`{${inputPackage}}`, relative)
    );
    const body = template({});
    // Scan HTML for <body> and <head> tags and their attributes
    const result = {
      head: '',
      body: '',
      headAttrs: {},
      bodyAttrs: {},
    };
    TemplatingTools.scanHtmlForTags({
      sourceName: inputPath,
      contents: body,
      tagNames: ['body', 'head'],
    }).forEach((tag) => {
      result[tag.tagName] += tag.contents;
      const tagAttrs = result[tag.tagName + 'Attrs'];
      Object.keys(tag.attribs).forEach((attr) => {
        const val = tag.attribs[attr];
        if (tagAttrs.hasOwnProperty(attr) && tagAttrs[attr] !== val) {
          TemplatingTools.throwCompileError(tag,
            `Multiple <${tag.tagName}> declarations have conflicting values `+
            `for the '${attr}' attribute`);
        }
        tagAttrs[attr] = val;
      });
    });
    return {
      compileResult: result,
      referencedImportPaths: dependencies,
    };
  }

  compileResultSize(compileResult) {
    return compileResult.head.length + compileResult.body.length;
  }

  addCompileResult(inputFile, result) {
    if (result.head) {
      inputFile.addHtml({
        section: 'head',
        data: result.head,
      });
    }
    if (result.body) {
      inputFile.addHtml({
        section: 'body',
        data: result.body,
      });
    }
    if (Object.keys(result.headAttrs).length ||
        Object.keys(result.bodyAttrs).length) {
      let js = `Meteor.startup(function() {`;
      if (Object.keys(result.headAttrs).length) {
        js += `
var headAttrs = ${JSON.stringify(result.headAttrs)};
for (var attr in headAttrs) {
  document.head.setAttribute(attr, headAttrs[attr]);
}`;
      }
      if (Object.keys(result.bodyAttrs).length) {
        js += `
var bodyAttrs = ${JSON.stringify(result.bodyAttrs)};
for (var attr in bodyAttrs) {
  document.body.setAttribute(attr, bodyAttrs[attr]);
}`;
      }
      js += `
});
`;
      inputFile.addJavaScript({
        path: inputFile.getPathInPackage() + '.attrs.js',
        data: js,
      });
    }
  }
}

Plugin.registerCompiler({
  extensions: ['pug'],
  archMatching: 'web',
  isTemplate: true
}, () => new PugCompiler());
