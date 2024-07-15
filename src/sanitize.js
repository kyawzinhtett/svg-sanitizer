const { JSDOM } = require("jsdom");

const allowedElements = [
  "svg",
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "tref",
  "textPath",
  "title",
  "desc",
  "defs",
  "symbol",
  "use",
  "image",
  "switch",
  "style",
  "foreignObject",
];

const allowedAttributes = [
  "width",
  "height",
  "x",
  "y",
  "viewBox",
  "fill",
  "stroke",
  "stroke-width",
  "transform",
  "d",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "xlink:href",
  "xml:space",
  "style",
  "class",
  "id",
  "xmlns",
  "xmlns:xlink",
  "version",
  "preserveAspectRatio",
];

function sanitizeSVG(svgContent) {
  const dom = new JSDOM(svgContent, { contentType: "image/svg+xml" });
  const document = dom.window.document;

  function sanitizeElement(element) {
    if (!allowedElements.includes(element.tagName)) {
      element.remove();
      return;
    }

    for (const attr of Array.from(element.attributes)) {
      if (!allowedAttributes.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    }

    for (const child of Array.from(element.children)) {
      sanitizeElement(child);
    }
  }

  sanitizeElement(document.documentElement);

  return document.documentElement.outerHTML;
}

module.exports = { sanitizeSVG };
