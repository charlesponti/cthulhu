[ ![Codeship Status for theponti/cthulhu](https://codeship.com/projects/424f9660-35f3-0132-cf9e-26e565296c73/status?branch=master)](https://codeship.com/projects/41262)

#### An Express Server with all the fixings.

![cthulhu](http://img3.wikia.nocookie.net/__cb20120509185304/powerlisting/images/9/90/Great-cthulhu.jpg)

This project started about a year ago when I was looking for a great boilerplate setup for a NodeJS application. I was coming from the Rails community and was hoping that someone would have created something like Rails in NodeJS.

I started building a whole slew of NodeJS applications and kept a boilerplate project on the side where I would store all of the best practices I had learned. That boilerplate became pretty large, monolithic, and opinionated, which were all of the things that I had hated about working with a run-of-the-mill Rails application. (Yes, I know there are ways of modularised Rails apps, but let's be honest with ourselves: most Rails apps, even those written by companies, are big, monolithic nightmares.)

So, after studying software modularity and the UNIX philosophy, reading a slew computer science research papers, and speaking with members of the NodeJS community, I have decided to ditch the whole boilerplate idea and instead break up all the best practices I have learned into independent modules. The point of these modules are to capture everything I learn on my journey as a software developer.

Cthulhu is just the server portion, packed with all the stuff that I wish, and I'm sure many other people wished as well, had come with the Express server.

---

## USAGE

1. **Install**

  ```
    npm install cthulhu --save
  ```

2. **Configure**

  ```js
    var app = require('cthulhu')
    app.configure({
      port: 4000,
      public: './public',
      views: './views',
      sessionSecret: 'meerkatmanorrox',
      sessionStore: 'myapp-sessions',
      appName: 'My Super Awesome App Name',
      passRoutes: ['api', 'auth']
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

## Features

#### Request body parsing (`body-parser`)

#### Resource Compression (`compression`)

#### Cookie Parser (`cookie-parser`)

#### Sessions (`express-session` and `connect-mongo`)

#### WebSockets (`socket.io`)

#### Security (`lusca`)  
  ```js
  var app = require('cthulhu')({
    // ...
    lusca: {
      csrf: true,
      // ...
    }
    // ...
  })
  ```

  I chose to use the Lusca module for security because if it's secure enough for PayPal than it's secure enough for me.

#### Templating (`swig`)
  Swig is used by default, but you can change this to whichever templating engine you prefer by specifying configuring Cthulhu in the same way you would an express application.

#### Logging (`winston`)
  ```js
    var app = require('cthulhu')({
      // ...
      logFile: './logs/all-logs.log',
      // ...
    });

    app.logger.info('Holy cow!');
    app.logger.warn('Meowzers...');
  ```

  The example above will add a logger to `app.logger`.

  **Name-spaced loggers**

  ```js
    app.addLogger('someLogger', './logs/some-logs.log');
    // NOTE: The directory './logs' must exist in order
    // for the 'some-logs.log' file to be created.

    app.loggers.someLogger.info('Meow Mix!');
  ```
  You can add a winston logger through the `app.addLogger` API. As its first argument it takes a `String` which is the path to the file you want to log to. You can also pass a config object as the second parameter like so:
  ```js
    app.addLogger('special', './logs/special.log', {
      file: {
        level: 'info',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false
      },
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      }
    });

    app.loggers.special.warn('Danger, Will Robinson!');
  ```

#### Email

  ```js
    var app = require('cthulhu')({
      // ...
      mailer: {
        service: 'gmail',
        username: 'foo@gmail.com',
        password: 'foobarbaz'
      }
      // ...
    });
  ```

  Providing a mailer configuration will allow you to send emails, using nodemailer, through `app.mailer`. If you don't provide a mailer configuration, `app.mailer` will simply not be available.

  **Sending Email**
  ```js
    app.mailer.sendMail({
      from: 'foo@gmail.com',
      to: 'bar@gmail.com',
      subject: 'Hello World',
      text: 'Hello World',
      html: '<h1>Hello World</h1>'
    });
  ```
