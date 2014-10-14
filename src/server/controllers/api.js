"use strict";

var _ = require("lodash");

module.exports = (function () {

  return {

    /**
     * Return user in json format
     * @param  {http.IncomingMessage} req
     * @param  {http.ServerResponse} res
     */
    getMe: function(req, res) {
      if (req.isAuthenticated()) {
        var user = _.omit(req.user.toJSON(), "hashed_password", "salt");
        res.status(200).json(user);
      } else {
        res.status(401).json({ message: "No user signed in." });
      }
    }

  };

})();
