### User Behavior Logger

#### Tiny, very simple library to log user events in a web page.

### Description
This is a tiny, very simple library to log user events in a web page. You only have to add custom
attributes to the DOM elements that you what to track and will be notified when user events are
generated on those elements.

#### Getting started
1. Build the library
```bash
  npm install
  npm run build
```
2. Include the library into the html.
```html
  <script src="/path/to/lib/UserBehaviorLogger.min.js"></script>
```
3. Init the library.
```html
  <script>
    window.addEventListener("load", function(event) {
        UBL.init();
    });
  </script>
```

#### Documentation

By default, the library search by elements with the *ubl-id* attribute and set up handlers to the events
specified in the *ubl-on* attribute. Some elements should omit the *ubl-on* attribute and will get handlers
for predefined events:

1. *Input* and *TextArea*: focus blur change copy cut paste
2. *Select*: focus blur change
3. *A* and *Button*: click
4. *Form*: submit invalid copy cut paste

##### Options
Also, the library supports passing some options to init method to control the library behavior.

This are the default options:
```javascript
    {
      // Prefix used in attributes (ubl-id ubl-on)
      prefix: 'ubl',

      // Interval to send events to backend (via POST method)
      intervalTime: 5000,

      // Endpoint to which send the events
      endpoint: 'user_behavior',

      // Create a log with document referrer info.
      referrer: true,

      // Log URL hash changes
      hashChange: true,

      // Log copy, cut and paste events captured at document level
      copyOnDocument: true,
      cutOnDocument: true,
      pasteOnDocument: true,

      // Log document scroll events (percentage)
      scrollOnDocument: true,

      // Send all unsent remaining events before the user leaves the page.
      beforeUnload: true
    }
```

##### Events
The events sent to the backend endpoint (via POST) are grouped by the *ubl-id* and have the
following structure:
```javascript
  {
    data: {value: 'Hello'}              // Data captured in the event (Ex: value after 'change' event).
    ublId: 'my-input'                   // Value of the ubl-id attribute.
    path: '/test/index.html'            // Value of the document.location.pathname.
    target: "#document"                 // Target of the event.
    targetHTML: '<input type="text" />' // HTML representation of the target element.
    timeStamp: '16981.6450'             // Timestamp of the event
    type: 'change'                      // Type of the event
  }
```
