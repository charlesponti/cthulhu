"use strict";

var AppRouter = Backbone.Router.extend({
  
  routes: {
    'account': 'onAccount',

    // Default - catch all
    '*actions': 'defaultAction'
  }

});

module.exports = AppRouter;
