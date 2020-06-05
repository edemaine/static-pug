Package.describe({
  name: 'edemaine:static-pug',
  summary: "Render static .pug files as static HTML in Meteor",
  version: '0.0.0',
  git: 'https://github.com/edemaine/static-pug.git',
  documentation: 'README.md',
});

Package.registerBuildPlugin({
  name: 'compileStaticPug',
  use: [
    'caching-compiler@1.2.2',
    'ecmascript@0.14.3',
    'templating-tools@1.1.2',
    'tmeasday:check-npm-versions@0.3.0',
  ],
  sources: [
    'static-pug.js',
  ],
});

Package.onUse(function(api) {
  api.use('isobuild:compiler-plugin@1.0.0', 'server');
  // ecmascript features we use:
  api.imply('modules', 'server');
  api.imply('ecmascript-runtime', 'server');
  api.imply('babel-runtime', 'server');
  // `Meteor.startup` needed to implement <head> or <body> attributes
  // (as in `static-html` package)
  api.imply('meteor@1.2.17', 'client');
});
