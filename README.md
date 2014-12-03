
![cthulhu](http://img3.wikia.nocookie.net/__cb20120509185304/powerlisting/images/9/90/Great-cthulhu.jpg)

An Express Server with all the fixings.

========

## USAGE

1. Install

  ```
    npm install cthulhu --save
  ```

2. Use

```js
  var app = require('cthulhu')({
    port: 4000,
    static: '../public',
    views: '../app/views',
    sessionSecret: 'meerkatmanorrox',
    sessionStore: 'myapp-sessions',
    appName: 'My Super Awesome App Name'
  });
```

## Features

### Socket.io

### Security: Lusca

I chose to use the Lusca module for security because if it's secure enough for
PayPal than it's secure enough for me.

### Templating: Swig  

I chose Swig because it provides a comfortable developer environment for
non-developers who are used to working with vanilla HTML and developers who are
coming from other templating frameworks in other languages.

### Remember

**Example**

```js
  app.use(Sentinal.remember({
    passRoutes: [ "auth", "login","logout", "signup","fonts","favicon"]
  }));
```
