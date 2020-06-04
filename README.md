# static-pug: Render static .pug files as static HTML in Meteor

This is a simple [Meteor](https://www.meteor.com/) package that lets you
write static [Pug](https://pugjs.org/) code in `.pug` files, and automatically
compiles them to static HTML that gets pushed by Meteor in the initial bundle
(no dynamic rendering).

Like the standard package
[static-html](https://atmospherejs.com/meteor/static-html),
this is useful especially when you want to handle the DOM manually or with a
framework like Angular or React, and just need to seed the DOM with basic
content.  This package is a drop-in replacement for static-html that
supports `.pug` files instead of `.html` files.

Similar to static-html, this plugin parses all of the `.pug` files in
(the client side of) your app, and looks for all top-level `<head>` and
`<body>` tags, which get appended to the head or body section of your app's
HTML (specifically, the initial bundle sent by Meteor.
You can have multiple `<head>` and/or `<body>` tags; they get concatenated.
You can also give attributes to the `<head>` and/or `<body>` tags themselves,
though these will be applied dynamically via JavaScript.
(I believe this is a limitation of Meteor.)

## Usage

First, add the package to your app:

```
meteor add edemaine:static-pug
```

Second, add `pug` as a peer NPM dependency in your app:

```
meteor npm install pug
```

Then write `.pug` files in your `client` directory (say).  For example:

```pug
head
  title My Meteor App
  meta(name="viewport", content="width=device-width, initial-scale=1")
body(style="background: purple")
  h1 Welcome to My Meteor App!
  #target
```

## Imports

Files ending in `.import.pug` will be treated as imports, and not
automatically converted to HTML.  You can use Pug's
[include](https://pugjs.org/language/includes.html) feature to include such
files within a regular `.pug` file.
