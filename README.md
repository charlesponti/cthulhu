
![cthulhu](http://img3.wikia.nocookie.net/__cb20120509185304/powerlisting/images/9/90/Great-cthulhu.jpg)

An Express Server with all the fixings.

========

## Installation

1. Install NPM dependencies

  ```
    npm install cthulhu
  ```

2. Edit `.json` files in `server/config/environments` and remove `.example` from names

## Features

### Database: MongoDB w/ Mongoose
I chose to use MongoDB for the database because it's the most common NoSQL DB
and the easiest to use when bootstrapping a new project.

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
