var $ = require('jquery');

var APIService = function() {

};

APIService.prototype.get = function(path, callback) {
  var deferred = new jQuery.Deferred();

  $.get('/api/'+path)
    .done(function(data) {
      deferred.resolve(data);
    })
    .fail(function(data) {
      deferred.reject(data);
    });

  return deferred.promise();
};

APIService.prototype.post = function(path, data) {
  var deferred = new jQuery.Deferred();

  $.post('/api/'+path, data)
    .done(function(data) {
      deferred.resolve(data);
    })
    .fail(function(data) {
      deferred.reject(data);
    });

  return deferred.promise();
};

module.exports = new APIService();