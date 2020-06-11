"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// https://github.com/umdjs/umd/blob/master/templates/nodeAdapter.js
(function (define) {
  define(function (require, exports, module) {
    var cheerio = require("cheerio");
    var processElement = require("./processElement.js");

    var parseMedium = function parseMedium(html) {
      var $ = cheerio.load(html);
      var title = $("h1").first().text();
      var headline = $(".p-summary").text();
      var author = $(".p-author").text();
      var publishedTime = $(".dt-published").attr("datetime");
      var markdown = $(".section-inner").contents().toArray().map(processElement).join("\n").replace(/\n\n\n/g, "\n\n");

      return {
        title: title,
        headline: headline,
        author: author,
        publishedTime: publishedTime,
        markdown: markdown
      };
    };

    return parseMedium;
  });
})(
// Help Node out by setting up define.
(typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports && typeof define !== "function" ? function (factory) {
  module.exports = factory(require, exports, module);
} : define);