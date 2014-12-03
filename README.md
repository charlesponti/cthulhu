
This Is A Cthulhu Production

![cthulhu](http://img3.wikia.nocookie.net/__cb20120509185304/powerlisting/images/9/90/Great-cthulhu.jpg)

A NodeJS, ExpressJS, BackboneJS, MongoDB, & Browserify boilerplate application

========

## Installation

1. Install NPM dependencies 

  ```
    npm install
  ```

2. Install Bower dependencies

  ```
    bower install
  ```

3. Edit `.json` files in `server/config/environments` and remove `.example` from names

4. Run Gulp

  ```bash
    gulp
  ```

5. Build Awesome App!

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

## Sentinal

Sentinal is an middleware utility library that I've written. It was build to 
help not having to rewrite the same code over and over again to perform basic 
actions such as authenticating users by way of OAuth, adding CORS headers, and 
so on.

### CORS

```js
  app.user(Sentinal.cors());
```

### Remember

```js
  app.use(Sentinal.remember({
    passRoutes: [ "auth", "login","logout", "signup","fonts","favicon"]
  }));
```

`Sentinal.remember` is used to remember original destination before login. It 
requires an Object with a key `passRoutes` that is set to an array of strings.
The strings specified will be ignored. The original destination will be saved
to `req.session.returnTo`.

### Strategies

#### Facebook

```js
app.get('/auth/facebook', authmatic.Facebook.authorize)
app.get('/auth/facebook/callback', authmatic.Facebook.callback, yourCallbackHandler)
```

#### Google

```js
app.get('/auth/google', authmatic.Google.authorize)
app.get('/auth/google/callback', authmatic.Google.callback, yourCallbackHandler)
```

#### Twitter

```js
app.get('/auth/twitter', authmatic.Twitter.authorize)
app.get('/auth/twitter/callback', authmatic.Twitter.callback, yourCallbackHandler)
```

#### Foursquare

```js
app.get('/auth/foursquare', authmatic.Foursquare.authorize)
app.get('/auth/foursquare/callback', authmatic.Foursquare.callback, yourCallbackHandler)
```

#### Github

```js
app.get('/auth/github', authmatic.Github.authorize)
app.get('/auth/github/callback', authmatic.Github.callback, yourCallbackHandler)
```
