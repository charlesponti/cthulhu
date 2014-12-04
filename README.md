#### An Express Server with all the fixings.

![cthulhu](http://img3.wikia.nocookie.net/__cb20120509185304/powerlisting/images/9/90/Great-cthulhu.jpg)

This project started about a year ago when I was looking for a great boilerplate setup for a NodeJS application. I was coming from the Rails community and was hoping that someone would have created something like Rails in NodeJS.

I started building a whole slew of NodeJS applications and kept a boilerplate project on the side where I would store all of the best practices I had learned. That boilerplate become pretty large, monolithic, and opinionated, which were all of the things that I had hated about working with a run-of-the-mill Rails application. (Yes, I know there are ways of modularized Rails apps, but let's be honest with ourselves: Most Rails apps, even those written by companies, are big, monolithic nightmares.)

So, after taking studying true software modularity from UNIX, computer science research papers, and the NodeJS community, I have decided to ditch the whole boilerplate idea and instead break up all the best practices I have learned into independent modules. The point of these modules are to capture everything I learn on my journey as a software developer.

Cthulhu is just the server portion, packed with all the stuff that I wish, and I'm sure many other people wished as well, had come with the Express server.

---

## USAGE

1. **Install**

```
  npm install cthulhu --save
```

2. **Configure**

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

3. **Add Some Routes**

```js
var router = app.Router();

router.get('*', function(req, res, next) {
  res.render('index');
});

app.use(router)
```

4. **Start Her Up**

```js
app.start();
```

This command will start server, along with starting Socket.io.

## Features

1. **Socket.io**  
  What application these days doesn't need to be real-time?

2. **Security:** Lusca  
  I chose to use the Lusca module for security because if it's secure enough for PayPal than it's secure enough for me.

3. **Templating:** Swig  
  I chose Swig because it provides a comfortable development environment for front-end developers that work mostly with HTML.
