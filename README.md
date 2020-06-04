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

Like static-html, this plugin parses all of the `.pug` files in (the client
side of) your app, and looks for all top-level `<head>` and `<body>` tags,
which get appended to the head or body section of your HTML.
(You can even have multiple `<head>` and/or `<body>` tags; they get
concatenated.)
You can also give `<head>` and/or `<body>` tags attributes, though these will
be applied dynamically via JavaScript.

## Usage

First add the package to your project:

> `meteor add edemaine:static-pug`

Then write `.pug` files in your `client` directory (say).  For example:

```pug
head
  title My Meteor App
  meta(name="viewport", content="width=device-width, initial-scale=1")
body(style="background: purple")
  h1 Welcome to My Meteor App!
  #target
```
