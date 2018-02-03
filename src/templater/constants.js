import { CUSTOM_DRAG_EVENT } from '../eventHandling/event'

// Descriptions here are scraped from https://developer.mozilla.org/en-US/docs/Web/HTML/Element
export const ELEMENTS = [
    'a', // The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.
    'abbr', // The HTML <abbr> element represents an abbreviation and optionally provides a full description for it. If present, the title attribute must contain this full description and nothing else.
    'address', // The HTML <address> element indicates that the enclosed HTML provides contact information for a person or people, or for an organization.
    'area', // The HTML <area> element defines a hot-spot region on an image, and optionally associates it with a hypertext link. This element is used only within a <map> element.
    'article', // The HTML <article> element represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable (e.g., in syndication). Examples include: a forum post, a magazine or newspaper article, or a blog entry.
    'aside', // The HTML <aside> element represents a portion of a document whose content is only indirectly related to the document's main content.
    'audio', // The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.
    'b', // The HTML Bring Attention To element (<b>)  is used to draw the reader's attention to the element's contents, which are not otherwise granted special importance.
    'base', // The HTML <base> element specifies the base URL to use for all relative URLs contained within a document. There can be only one <base> element in a document.
    'bdi', // The HTML <bdi> element (bidirectional isolation) isolates a span of text that might be formatted in a different direction from other text outside it.
    'bdo', // The HTML Bidirectional Text Override element (<bdo>) overrides the current directionality of text, so that the text within is rendered in a different direction.
    'blockquote', // The HTML <blockquote> Element (or HTML Block Quotation Element) indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation (see Notes for how to change it). A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the <cite> element.
    'body', // The HTML <body> Element represents the content of an HTML document. There can be only one <body> element in a document.
    'br', // The HTML <br> element produces a line break in text (carriage-return). It is useful for writing a poem or an address, where the division of lines is significant.
    'button', // The HTML <button> element represents a clickable button, which can be used in forms, or anywhere in a document that needs simple, standard button functionality.
    'canvas', // Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.
    'caption', // The HTML Table Caption element (<caption>) specifies the caption (or title) of a table, and if used is always the first child of a <table>.
    'cite', // The HTML Citation element (<cite>) is used to describe a reference to a cited creative work, and must include either the title or the URL of that work.
    'code', // The HTML <code> element displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code.
    'col', // The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.
    'colgroup', // The HTML <colgroup> element defines a group of columns within a table.
    'data', // The HTML <data> element links a given content with a machine-readable translation. If the content is time- or date-related, the <time> element must be used.
    'datalist', // The HTML <datalist> element contains a set of <option> elements that represent the values available for other controls.
    'dd', // The HTML <dd> element provides the details about or the definition of the preceding term (<dt>) in a description list (<dl>).
    'del', // The HTML <del> element represents a range of text that has been deleted from a document.
    'details', // The HTML Details Element (<details>) is used to create a disclosure widget in which information is visible only when the widget is toggled into an "open" state. A summary or label can be provided using the <summary> element.
    'dfn', // The HTML Definition element (<dfn>) is used to indicate the term being defined within the context of a definition phrase or sentence.
    'div', // The HTML Content Division element (<div>) is the generic container for flow content. It has no effect on the content or layout until styled using CSS.
    'dl', // The HTML <dl> element represents a description list. The element encloses a list of groups of terms (specified using the <dt> element) and descriptions (provided by <dd> elements). Common uses for this element are to implement a glossary or to display metadata (a list of key-value pairs).
    'dt', // The HTML <dt> element specifies a term in a description or definition list, and as such must be used inside a <dl> element.
    'em', // The HTML <em> element marks text that has stress emphasis. The <em> element can be nested, with each level of nesting indicating a greater degree of emphasis.
    'embed', // The HTML <embed> element embeds external content at the specified point in the document. This content is provided by an external application or other source of interactive content such as a browser plug-in.
    'fieldset', // The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form.
    'figcaption', // The HTML <figcaption> element represents a caption or a legend associated with a figure or an illustration described by the rest of the data of the <figure> element which is its immediate ancestor.
    'figure', // The HTML <figure> element represents self-contained content, frequently with a caption (<figcaption>), and is typically referenced as a single unit.
    'footer', // The HTML <footer> element represents a footer for its nearest sectioning content or sectioning root element. A footer typically contains information about the author of the section, copyright data or links to related documents.
    'form', // The HTML <form> element represents a document section that contains interactive controls to submit information to a web server.
    'h1', // The HTML <h1>–<h6> elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.
    'h2', 
    'h3', 
    'h4',
    'h5',
    'h6',
    'head', // The HTML <head> element provides general information (metadata) about the document, including its title and links to its scripts and style sheets.
    'header', // The HTML <header> element represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also other elements like a logo, a search form, an author name, and so on.
    'hr', // The HTML <hr> element represents a thematic break between paragraph-level elements (for example, a change of scene in a story, or a shift of topic with a section); historically, this has been presented as a horizontal rule or line.
    'html', // The HTML <html> element represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.
    'i', // The HTML <i> element represents a range of text that is set off from the normal text for some reason, for example, technical terms, foreign language phrases, or fictional character thoughts. It is typically displayed in italic type.
    'iframe', // The HTML <iframe> element represents a nested browsing context, effectively embedding another HTML page into the current page. In HTML 4.01, a document may contain a head and a body or a head and a frameset, but not both a body and a frameset. However, an <iframe> can be used within a normal document body. Each browsing context has its own session history and active document. The browsing context that contains the embedded content is called the parent browsing context. The top-level browsing context (which has no parent) is typically the browser window.
    'img', // The HTML <img> element embeds an image into the document.
    'input', // The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user.
    'ins', // The HTML <ins> element represents a range of text that has been added to a document.
    'kbd', // The HTML Keyboard Input element (<kbd>) represents a span of inline text denoting textual user input from a keyboard, voice input, or any other text entry device.
    'label', // The HTML <label> element represents a caption for an item in a user interface.
    'legend', // The HTML <legend> element represents a caption for the content of its parent <fieldset>.
    'li', // The HTML <li> element is used to represent an item in a list. It must be contained in a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.
    'link', // The HTML <link> element specifies relationships between the current document and an external resource. Possible uses for this element include defining a relational framework for navigation. This element is most used to link to style sheets.
    'main', // The HTML <main> element represents the main content of the <body> of a document, portion of a document, or application. The main content area consists of content that is directly related to, or expands upon the central topic of, a document or the central functionality of an application.
    'map', // The HTML <map> element is used with <area> elements to define an image map (a clickable link area).
    'mark', // The HTML Mark Text element (<mark>) represents text which is marked or highlighted for reference or notation purposes, due to the marked passage's relevance or importance in the enclosing context.
    'meta', // The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.
    'meter', // The HTML <meter> element represents either a scalar value within a known range or a fractional value.
    'nav', // The HTML <nav> element represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Common examples of navigation sections are menus, tables of contents, and indexes.
    'noscript', // The HTML <noscript> element defines a section of HTML to be inserted if a script type on the page is unsupported or if scripting is currently turned off in the browser.
    'object', // The HTML <object> element represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.
    'ol', // The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.
    'optgroup', // The HTML <optgroup> element creates a grouping of options within a <select> element.
    'option', // The HTML <option> element is used to define an item contained in a <select>, an <optgroup>, or a <datalist> element. As such, <option> can represent menu items in popups and other lists of items in an HTML document.
    'output', // The HTML Output element (<output>) is a container element into which a site or app can inject the results of a calculation or the outcome of a user action.
    'p', // The HTML <p> element represents a paragraph of text.
    'param', // The HTML <param> element defines parameters for an <object> element.
    'picture', // The HTML <picture> element serves as a container for zero or more <source> elements and one <img> element to provide versions of an image for different display device scenarios.
    'pre', // The HTML <pre> element represents preformatted text which is to be presented exactly as written in the HTML file.
    'progress', // The HTML <progress> element displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
    'q', // The HTML <q> element  indicates that the enclosed text is a short inline quotation. Most modern browsers implement this by surrounding the text in quotation marks. 
    'rp', // The HTML Ruby Fallback Parenthesis (<rp>) element is used to provide fall-back parentheses for browsers that do not support display of ruby annotations using the <ruby> element.
    'rt', // The HTML Ruby Text (<rt>) element specifies the ruby text component of a ruby annotation, which is used to provide pronunciation, translation, or transliteration information for East Asian typography. The <rt> element must always be contained within a <ruby> element.
    'rtc', // The HTML Ruby Text Container (<rtc>) element embraces semantic annotations of characters presented in a ruby of <rb> elements used inside of <ruby> element. <rb> elements can have both pronunciation (<rt>) and semantic (<rtc>) annotations.
    'ruby', // The HTML <ruby> element represents a ruby annotation. Ruby annotations are for showing pronunciation of East Asian characters.
    's', // The HTML <s> element renders text with a strikethrough, or a line through it. Use the <s> element to represent things that are no longer relevant or no longer accurate. However, <s> is not appropriate when indicating document edits; for that, use the <del> and <ins> elements, as appropriate.
    'samp', // The HTML Sample Element (<samp>) is used to enclose inline text which represents sample (or quoted) output from a computer program.
    'script', // The HTML <script> element is used to embed or reference executable code; this is typically used to embed or refer to JavaScript code.
    'section', // The HTML <section> element represents a standalone section — which doesn't have a more specific semantic element to represent it — contained within an HTML document.
    'select', // The HTML <select> element represents a control that provides a menu of options:
    'slot', // The HTML <slot> element—part of the Web Components technology suite—is a placeholder inside a web component that you can fill with your own markup, which lets you create separate DOM trees and present them together.
    'small', // The HTML <small> element makes the text font size one size smaller (for example, from large to medium, or from small to x-small) down to the browser's minimum font size.  In HTML5, this element is repurposed to represent side-comments and small print, including copyright and legal text, independent of its styled presentation.
    'source', // The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element. It is an empty element. It is commonly used to serve the same media content in multiple formats supported by different browsers.
    'span', // The HTML <span> element is a generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes (using the class or id attributes), or because they share attribute values, such as lang.
    'strong', // The HTML Strong Importance Element (<strong>) indicates that its contents have strong importance, seriousness, or urgency. Browsers typically render the contents in bold type.
    'style', // The HTML <style> element contains style information for a document, or part of a document.
    'sub', // The HTML Subscript element (<sub>) specifies inline text which should be displayed as subscript for solely typographical reasons. Subscripts are typically rendered with a lowered baseline using smaller text.
    'summary', // The HTML Disclosure Summary element (<summary>) element specifies a summary, caption, or legend for a <details> element's disclosure box.
    'sup', // The HTML Superscript element (<sup>) specifies inline text which is to be displayed as superscript for solely typographical reasons.
    'table', // The HTML <table> element represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.
    'tbody', // The HTML Table Body element (<tbody>) encapsulates a set of table row (<tr> elements, indicating that they comprise the body of the table (<table>).
    'td', // The HTML <td> element defines a cell of a table that contains data. It participates in the table model.
    'template', // The HTML <template> element is a mechanism for holding client-side content that is not to be rendered when a page is loaded but may subsequently be instantiated during runtime using JavaScript.
    'textarea', // The HTML <textarea> element represents a multi-line plain-text editing control.
    'tfoot', // The HTML <tfoot> element defines a set of rows summarizing the columns of the table.
    'th', // The HTML <th> element defines a cell as header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.
    'thead', // The HTML <thead> element defines a set of rows defining the head of the columns of the table.
    'time', // The HTML <time> element represents either a time on a 24-hour clock or a precise date in the Gregorian calendar (with optional time and timezone information).
    'title', // The HTML Title element (<title>) defines the title of the document, shown in a browser's title bar or on the page's tab.
    'tr', // The HTML <tr> element specifies that the markup contained inside the <tr> block comprises one row of a table, inside which the <th> and <td> elements create header and data cells, respectively, within the row.
    'track', // The HTML <track> element is used as a child of the media elements <audio> and <video>. It lets you specify timed text tracks (or time-based data), for example to automatically handle subtitles. The tracks are formatted in WebVTT format (.vtt files) — Web Video Text Tracks.
    'u', // The HTML Unarticulated Annotation element (<u>) represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation.
    'ul', // The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.
    'var', // The HTML Variable element (<var>) represents the name of a variable in a mathematical expression or a programming context.
    'video', // Use the HTML <video> element to embed video content in a document.
    'wbr', // The HTML <wbr> element represents a word break opportunity—a position within text where the browser may optionally break a line, though its line-breaking rules would not otherwise create a break at that location
]
export const EVENTS = [
    CUSTOM_DRAG_EVENT,
    'click',  
    'mousedown', 
    'mouseup', 
    'mousemove', 
    'touchstart', 
    'touchend', 
    'touchmove', 
    'touchcancel'
]