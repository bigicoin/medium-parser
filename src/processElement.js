// https://github.com/umdjs/umd/blob/master/templates/nodeAdapter.js
(function(define) {
  define(require => {
    const cheerio = require("cheerio");

    const processElement = (element, orderedList = false) => {
      const $ = cheerio.load(element);
      const el = $(element).get(0);

      if (el.type === "text") {
        const text = $(el).text();
        const firstChar = text.substr(0, 1);
        if (["*", "-"].indexOf(firstChar) > -1) {
          return `\\${text}`;
        }
        return text;
      }

      if (el.type === "tag") {
        if (el.name === "figure") {
          const caption = $(el)
            .find("figcaption")
            .text();
          // last() because the first img is low res
          const src = $("div > img")
            .last()
            .attr("src");
          return `\n![${caption}](${src})`;
        }

        // Can't use .map() because it mutates the element
        const p = [];
        $(el)
          .contents()
          .each((i, e) => {
            p.push(processElement(e, el.name === "ol"));
          });
        const processed = p.join("");

        // const processed = children.each((i, el) => processElement(el)).join('');

        if (el.name === "em" || el.name === "i") {
          return `*${processed}*`;
        }

        if (el.name === "strong" || el.name === "b") {
          return `**${processed}**`;
        }

        if (el.name === "a") {
          const href = $(el).attr("href");
          return `[${processed}](${href})`;
        }

        if (el.name === "blockquote") {
          return `\n> ${processed}`;
        }

        // TODO Finish refactoring

        if (el.name === "h4") return `\n## ${processed}`;
        if (el.name === "h3") return `\n# ${processed}`;
        if (el.name === "ul") {
          return `\n${processed}`;
        }
        if (el.name === "ol") {
          return `\n${processed}`;
        }
        if (el.name === "li") {
          if (orderedList) {
            return `\n1. ${processed}`;
          } else {
            return `\n- ${processed}`;
          }
        }
        if (el.name === "p") {
          return `\n\n${processed}`;
        }
        if (el.name === "img") {
          const alt = $(el).attr("alt") || "";
          const src = $(el).attr("src");
          return `![${alt}](${src})`;
        }
        if (el.name === "div") return `\n${processed}`;
        if (["figure", "div", "figcaption"].indexOf(el.name) > -1) {
          return `\n${processed}`;
        }
        if (el.name === "pre") {
          // return `\n~~~\n${processed}\n~~~\n`;
          return `\n${processed}`;
        }

        if (el.name === "hr") {
          return "\n\n---\n";
        }

        if (el.name === "code" && el.classList.contains("markup--p-code")) {
          return `\`${processed}\``;
        }

        if (el.name === "code" && el.classList.contains("markup--pre-code")) {
          return `\n\`\`\`\n${processed}\n\`\`\`\n`;
        }

        console.log(`parse-medium: unprocessed tag <${el.name}>`);
        return `\n${processed}`;
      }
      return el;
    };

    return processElement;
  });
})(
  // Help Node out by setting up define.
  typeof module === "object" && module.exports && typeof define !== "function"
    ? function(factory) {
        module.exports = factory(require, exports, module);
      }
    : define
);
