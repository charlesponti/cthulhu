'use strict';

var $ = require('jquery');

function APIService() {

  /**
   * Make AJAX request to `/api`
   * @param  {Object} options
   * @param  {String} options.path
   * @param  {String} options.method
   * @param  {Object} options.data
   * @return {jQuery.Deferred}
   */
  this.request = function apiRequest(options) {
    var deferred = new jQuery.Deferred();

    $.ajax({
      url: '/api/'+path,
      method: options.method,
      data: options.data || {}
    })
    .done(function(data) {
      deferred.resolve(data);
    })
    .fail(function(data) {
      deferred.reject(data);
    });

    return deferred.promise();
  };

  /**
   * Make GET request to `/api`
   * @param  {String} path
   * @param  {Object} data [description]
   * @return {jQuery.Deferred}
   */
  this.get = function(path, data) {
    return this.request({ path: path, method: 'GET', data: data });
  };

  /**
   * Make POST request to `/api`
   * @param  {String} path
   * @param  {Object} data [description]
   * @return {jQuery.Deferred}
   */
  this.post = function(path, data) {
    return this.request({ path: path, method: 'POST', data: data });
  };

  /**
   * Make PUT request to `/api`
   * @param  {String} path
   * @param  {Object} data [description]
   * @return {jQuery.Deferred}
   */
  this.put = function(path, data) {
    return this.request({ path: path, method: 'PUT', data: data });
  };

  /**
   * Make PATCH request to `/api`
   * @param  {String} path
   * @param  {Object} data [description]
   * @return {jQuery.Deferred}
   */
  this.patch = function(path, data) {
    return this.request({ path: path, method: 'PATCH', data: data });
  };

  /**
   * Make DELETE request to `/api`
   * @param  {String} path
   * @param  {Object} data [description]
   * @return {jQuery.Deferred}
   */
  this.delete = function(path, data) {
    return this.request({ path: path, method: 'DELETE', data: data });
  };

};

module.exports = new APIService();
