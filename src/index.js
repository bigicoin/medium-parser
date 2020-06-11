// https://github.com/umdjs/umd/blob/master/templates/nodeAdapter.js
(function(define) {
  define(function(require, exports, module) {
    var cheerio = require("cheerio");
    var processElement = require("./processElement.js");

    const parseMedium = html => {
      const $ = cheerio.load(html);
      const title = $("h1")
        .first()
        .text();
      const headline = $(".p-summary").text();
      const author = $(".p-author").text();
      const publishedTime = $(".dt-pubblished").attr("datetime");
      const markdown = $(".section-inner")
        .contents()
        .toArray()
        .map(processElement)
        .join("\n")
        .replace(/\n\n\n/g, "\n\n");

      return {
        title,
        headline,
        author,
        publishedTime,
        markdown
      };
    };

    return parseMedium;
  });
})(
  // Help Node out by setting up define.
  typeof module === "object" && module.exports && typeof define !== "function"
    ? function(factory) {
        module.exports = factory(require, exports, module);
      }
    : define
);
