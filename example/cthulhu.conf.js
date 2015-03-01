
module.exports = {

  port: 3000,

  views: './views',

  log: {
    dir: './logs',
    file: './all-logs.log'
  },

  middleware: [
    function(req, res) {
      return res.render('index');
    }
  ]

};
