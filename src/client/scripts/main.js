'use strict';

window.$ = require('jquery');
window.Backbone = require('backbone');
Backbone.$ = $;

var messages = [];
var socket = io.connect('http://localhost:4000');

socket.on('message', function (data) {
  console.log(data);
});


var AppModel = require("./app/app");
window.App = new AppModel();

App.start();
