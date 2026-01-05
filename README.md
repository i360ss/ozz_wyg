# OzzWyg - WYSIWYG Editor

A simple, lightweight, and feature-rich WYSIWYG (What You See Is What You Get) editor built with vanilla JavaScript. No dependencies required!

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Available Tools](#available-tools)
- [API Reference](#api-reference)
- [Events](#events)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Examples](#examples)
- [Styling](#styling)
- [Browser Support](#browser-support)
- [License](#license)

## Features

- 🎨 **Rich Text Formatting** - Bold, italic, underline, strikethrough, subscript, superscript
- 📝 **Text Blocks** - Headings (H1-H6), paragraphs, quotes, code blocks
- 🔗 **Links** - Insert and edit links with URL and target options
- 📊 **Tables** - Create and manage tables with header/footer options, add/remove rows and columns
- 🖼️ **Media** - Insert images, videos, YouTube, and Vimeo embeds
- 📋 **Lists** - Ordered and unordered lists
- 📐 **Alignment** - Left, center, right, and justify alignment
- ⌨️ **Keyboard Shortcuts** - Common shortcuts like Ctrl+B for bold
- 🎯 **Smart Paste** - Automatically cleans pasted content from Word, Google Docs, etc.
- 🔄 **Toolbar State** - Highlights active formatting buttons based on cursor position
- 👁️ **Code View** - Toggle between visual and HTML code view
- 📡 **Event System** - Comprehensive event system for integration
- 🎨 **Customizable** - Configure which tools appear in the toolbar
- 🔌 **No Dependencies** - Pure vanilla JavaScript

## Installation

### Download

Download the files:
- `OzzWyg.js` - The main JavaScript file
- `OzzWyg.css` - The stylesheet (or use `OzzWyg.scss` for SCSS)

### Include in Your Project

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/OzzWyg.css">
</head>
<body>
  <div data-ozz-wyg></div>
  
  <script src="path/to/OzzWyg.js"></script>
  <script>
    const editor = new OzzWyg();
  </script>
</body>
</html>
```

## Quick Start

### Basic Usage

```html
<div data-ozz-wyg></div>

<script>
  const editor = new OzzWyg();
</script>
```

### Custom Selector

```html
<div class="my-editor"></div>

<script>
  const editor = new OzzWyg({
    selector: '.my-editor'
  });
</script>
```

### Get Editor Content

```javascript
const content = editor.getValue();
console.log(content); // HTML string
```

## Configuration

### Options

```javascript
const editor = new OzzWyg({
  selector: '[data-ozz-wyg]',  // CSS selector for editor elements
  tools: [                      // Array of tools to include
    'headings',
    'bold',
    'italic',
    // ... see Available Tools section
  ]
});
```

### Default Configuration

```javascript
OzzWyg.defaults = {
  selector: '[data-ozz-wyg]',
  tools: [
    'headings', 'paragraph', 'code', 'quote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript',
    'alignLeft', 'alignRight', 'alignCenter', 'justify', 'indent', 'outdent',
    'ol', 'ul', 'link', 'table', 'media', 'codeView'
  ]
};
```

## Available Tools

### Text Formatting

- `bold` - Make text bold
- `italic` - Make text italic
- `underline` - Underline text
- `strikethrough` - Strikethrough text
- `subscript` - Subscript text
- `superscript` - Superscript text

### Text Blocks

- `headings` - Dropdown menu with heading options
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Individual heading levels
- `paragraph` - Normal paragraph text
- `quote` - Blockquote with footer
- `code` - Inline code formatting

### Lists

- `ol` - Ordered (numbered) list
- `ul` - Unordered (bulleted) list

### Alignment

- `alignLeft` - Left align text
- `alignRight` - Right align text
- `alignCenter` - Center align text
- `justify` - Justify text
- `indent` - Increase indent
- `outdent` - Decrease indent

### Media & Links

- `link` - Insert/edit hyperlinks
- `media` - Insert images, videos, YouTube, Vimeo embeds
- `table` - Create and manage tables

### Other

- `codeView` - Toggle between visual and HTML code view

### Custom Toolbar

```javascript
const editor = new OzzWyg({
  tools: [
    'headings',
    'bold',
    'italic',
    'link',
    'table'
    // Only these tools will appear
  ]
});
```

## API Reference

### Instance Methods

#### `getValue(editorID)`

Get the HTML content from the editor.

**Parameters:**
- `editorID` (string, optional) - Specific editor ID. If not provided, returns first editor's content.

**Returns:** HTML string

**Example:**
```javascript
// Get content from first editor
const content = editor.getValue();

// Get content from specific editor (when multiple editors exist)
const content = editor.getValue('i-abc123');
```

#### `getEditorInstance(editorID)`

Get editor instance object by editor ID.

**Parameters:**
- `editorID` (string) - Editor ID

**Returns:** Object with `id`, `element`, `playGround`, `ozzWygInstance` or `null`

**Example:**
```javascript
const instance = editor.getEditorInstance('i-abc123');
console.log(instance.element); // Editor DOM element
console.log(instance.playGround); // Editable area element
```

#### `getAllEditorInstances()`

Get all editor instances managed by this OzzWyg instance.

**Returns:** Map of all editor instances

**Example:**
```javascript
const instances = editor.getAllEditorInstances();
instances.forEach((instance, editorID) => {
  console.log(`Editor ${editorID}:`, instance);
});
```

#### `on(editorID, eventName, callback)`

Bind event to specific editor instance.

**Parameters:**
- `editorID` (string) - Editor ID
- `eventName` (string) - Event name without 'ozzwyg:' prefix (e.g., 'input', 'focus')
- `callback` (Function) - Event callback function

**Example:**
```javascript
editor.on('i-abc123', 'input', (e) => {
  console.log('Content changed:', e.detail.content);
});
```

#### `off(editorID, eventName, callback)`

Unbind event from specific editor instance.

**Parameters:**
- `editorID` (string) - Editor ID
- `eventName` (string) - Event name without 'ozzwyg:' prefix
- `callback` (Function) - Event callback function (must be same reference as used in `on`)

**Example:**
```javascript
const handler = (e) => console.log('Input:', e.detail);
editor.on('i-abc123', 'input', handler);
// Later...
editor.off('i-abc123', 'input', handler);
```

### Static Methods

#### `OzzWyg.getInstance(selector)`

Get OzzWyg instance from DOM element or selector. Useful when you don't have direct reference to the editor instance.

**Parameters:**
- `selector` (string|HTMLElement) - CSS selector or DOM element

**Returns:** OzzWyg instance or `null`

**Example:**
```javascript
// Get instance by selector
const instance = OzzWyg.getInstance('.my-editor');

// Get instance by element
const element = document.querySelector('.my-editor');
const instance = OzzWyg.getInstance(element);

if (instance) {
  const content = instance.getValue();
}
```

#### `OzzWyg.getValue(selector)`

Get value from editor by selector without needing the instance reference.

**Parameters:**
- `selector` (string|HTMLElement) - CSS selector or DOM element

**Returns:** HTML string

**Example:**
```javascript
// Get value directly without instance reference
const content = OzzWyg.getValue('.my-editor');

// Or by element
const element = document.querySelector('.my-editor');
const content = OzzWyg.getValue(element);
```

#### `OzzWyg.on(selector, eventName, callback)`

Bind event to editor by selector without needing the instance reference.

**Parameters:**
- `selector` (string|HTMLElement) - CSS selector or DOM element
- `eventName` (string) - Event name without 'ozzwyg:' prefix
- `callback` (Function) - Event callback function

**Example:**
```javascript
// Bind event without instance reference
OzzWyg.on('.my-editor', 'input', (e) => {
  console.log('Content changed:', e.detail.content);
});

// Or by element
const element = document.querySelector('.my-editor');
OzzWyg.on(element, 'focus', (e) => {
  console.log('Editor focused');
});
```

#### `OzzWyg.off(selector, eventName, callback)`

Unbind event from editor by selector.

**Parameters:**
- `selector` (string|HTMLElement) - CSS selector or DOM element
- `eventName` (string) - Event name without 'ozzwyg:' prefix
- `callback` (Function) - Event callback function

**Example:**
```javascript
const handler = (e) => console.log('Input:', e.detail);
OzzWyg.on('.my-editor', 'input', handler);
// Later...
OzzWyg.off('.my-editor', 'input', handler);
```

### Multiple Editors

The editor supports multiple instances on the same page:

```html
<div class="editor-1" data-ozz-wyg></div>
<div class="editor-2" data-ozz-wyg></div>

<script>
  const editor = new OzzWyg({
    selector: '[data-ozz-wyg]'
  });
  
  // Get value from specific editor
  const editor1Content = editor.getValue('i-abc123');
</script>
```

### Accessing Already Initialized Editors

You can access and interact with editors that were initialized elsewhere:

```html
<!-- Editor initialized in another script -->
<div class="my-editor" data-ozz-wyg></div>

<script>
  // Get the instance
  const instance = OzzWyg.getInstance('.my-editor');
  
  // Get value
  const content = OzzWyg.getValue('.my-editor');
  
  // Bind events
  OzzWyg.on('.my-editor', 'input', (e) => {
    console.log('Content:', e.detail.content);
  });
  
  // Or use instance methods
  if (instance) {
    const element = document.querySelector('.my-editor');
    const editorID = element.getAttribute('data-editor');
    instance.on(editorID, 'focus', () => {
      console.log('Editor focused!');
    });
  }
</script>
```

## Events

OzzWyg emits custom events that you can listen to. All events are prefixed with `ozzwyg:`.

### Available Events

#### `ozzwyg:focus`

Fired when the editor gains focus.

```javascript
editorElement.addEventListener('ozzwyg:focus', (e) => {
  console.log('Editor focused', e.detail);
  // e.detail contains: editorID, editor, playGround, event
});
```

#### `ozzwyg:blur`

Fired when the editor loses focus.

```javascript
editorElement.addEventListener('ozzwyg:blur', (e) => {
  console.log('Editor blurred', e.detail);
});
```

#### `ozzwyg:input`

Fired on every content change (typing, deleting, formatting, etc.).

```javascript
editorElement.addEventListener('ozzwyg:input', (e) => {
  console.log('Content changed:', e.detail.content);
  // e.detail contains: editorID, editor, playGround, content, event
});
```

#### `ozzwyg:change`

Fired when the editor loses focus after content has changed.

```javascript
editorElement.addEventListener('ozzwyg:change', (e) => {
  console.log('Content saved:', e.detail.content);
  // Save content to server, etc.
});
```

#### `ozzwyg:paste`

Fired when content is pasted into the editor.

```javascript
editorElement.addEventListener('ozzwyg:paste', (e) => {
  console.log('Original:', e.detail.originalContent);
  console.log('Cleaned:', e.detail.cleanedContent);
  // e.detail contains: editorID, originalContent, cleanedContent, event
});
```

#### `ozzwyg:keydown`

Fired when a key is pressed in the editor.

```javascript
editorElement.addEventListener('ozzwyg:keydown', (e) => {
  console.log('Key:', e.detail.key);
  console.log('Ctrl:', e.detail.ctrlKey);
  // e.detail contains: editorID, key, ctrlKey, metaKey, shiftKey, event
});
```

### Event Detail Properties

All events include these properties in `e.detail`:

- `editorID` - Unique identifier for the editor instance
- `editor` - Reference to the editor DOM element
- `playGround` - Reference to the editable area DOM element
- `event` - Original browser event (if applicable)
- Additional properties specific to each event type

### Complete Example

```javascript
const editor = new OzzWyg({
  selector: '.wysiwyg-editor'
});

const editorElement = document.querySelector('.wysiwyg-editor');

// Focus event
editorElement.addEventListener('ozzwyg:focus', (e) => {
  console.log('Editor focused');
});

// Input event - auto-save on change
editorElement.addEventListener('ozzwyg:input', (e) => {
  // Auto-save functionality
  saveContent(e.detail.content);
});

// Change event - final save on blur
editorElement.addEventListener('ozzwyg:change', (e) => {
  // Final save when user leaves editor
  saveContent(e.detail.content);
});

function saveContent(content) {
  // Your save logic here
  fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ content })
  });
}
```

## Keyboard Shortcuts

OzzWyg supports the following keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Bold |
| `Ctrl/Cmd + I` | Italic |
| `Ctrl/Cmd + U` | Underline |
| `Ctrl/Cmd + K` | Insert/Edit Link |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + Y` | Redo |

## Examples

### Basic Editor

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="OzzWyg.css">
</head>
<body>
  <div data-ozz-wyg></div>
  
  <button onclick="getContent()">Get Content</button>
  <div id="output"></div>
  
  <script src="OzzWyg.js"></script>
  <script>
    const editor = new OzzWyg();
    
    function getContent() {
      document.getElementById('output').innerHTML = editor.getValue();
    }
  </script>
</body>
</html>
```

### Custom Toolbar

```javascript
const editor = new OzzWyg({
  selector: '.editor',
  tools: [
    'headings',
    'bold',
    'italic',
    'underline',
    'link',
    'table'
  ]
});
```

### With Event Listeners

```javascript
const editor = new OzzWyg({
  selector: '.editor'
});

const editorElement = document.querySelector('.editor');

// Listen for content changes
editorElement.addEventListener('ozzwyg:input', (e) => {
  const content = e.detail.content;
  // Do something with content
  updatePreview(content);
});

// Listen for paste events
editorElement.addEventListener('ozzwyg:paste', (e) => {
  console.log('Pasted content cleaned:', e.detail.cleanedContent);
});
```

### Accessing Already Initialized Editor

```javascript
// Editor was initialized elsewhere, you just have the DOM element
const editorElement = document.querySelector('.my-editor');

// Method 1: Using static methods (recommended)
// Get value
const content = OzzWyg.getValue('.my-editor');

// Bind events
OzzWyg.on('.my-editor', 'input', (e) => {
  console.log('Content changed:', e.detail.content);
});

// Method 2: Get instance first, then use instance methods
const instance = OzzWyg.getInstance('.my-editor');
if (instance) {
  const editorID = editorElement.getAttribute('data-editor');
  
  // Get value
  const content = instance.getValue(editorID);
  
  // Bind events
  instance.on(editorID, 'focus', () => {
    console.log('Editor focused!');
  });
}
```

### Form Integration

```html
<form id="myForm">
  <div data-ozz-wyg></div>
  <button type="submit">Submit</button>
</form>

<script>
  const editor = new OzzWyg();
  
  document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const content = editor.getValue();
    
    // Add content to form
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'content';
    hiddenInput.value = content;
    e.target.appendChild(hiddenInput);
    
    // Submit form
    e.target.submit();
  });
</script>
```

### Multiple Editors

```html
<div class="editor-1" data-ozz-wyg></div>
<div class="editor-2" data-ozz-wyg></div>

<script>
  const editor = new OzzWyg({
    selector: '[data-ozz-wyg]'
  });
  
  // Get content from all editors
  const editors = document.querySelectorAll('[data-ozz-wyg]');
  editors.forEach((el, index) => {
    const editorID = el.getAttribute('data-editor');
    const content = editor.getValue(editorID);
    console.log(`Editor ${index + 1}:`, content);
  });
</script>
```

## Features in Detail

### Smart Paste

When you paste content from external sources (Word, Google Docs, etc.), OzzWyg automatically:

- Removes unwanted inline styles
- Removes script and style tags
- Cleans up empty elements
- Preserves basic formatting (bold, italic, headings, lists)

### Table Management

Tables include:

- **Create Table** - Specify rows, columns, header, and footer
- **Add/Remove Rows** - Dynamic row management
- **Add/Remove Columns** - Dynamic column management
- **Auto-wrapping** - Tables are automatically wrapped for better styling

### Media Support

- **Images** - Upload or insert via URL
- **Videos** - Upload or insert via URL
- **YouTube** - Paste YouTube URL to auto-embed
- **Vimeo** - Paste Vimeo URL to auto-embed
- **Media Controls** - Resize, align, and delete media

### Link Management

- **Insert Links** - Add URL and target
- **Edit Links** - Click existing links to edit
- **Link Popover** - Quick access to link URL and edit/delete options

### Code View

Toggle between visual editing and HTML code view to:

- View raw HTML
- Edit HTML directly
- Switch back to visual mode

## Browser Support

OzzWyg works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

**Note:** Uses modern JavaScript features. For older browser support, consider using a transpiler like Babel.

## License

This project is open source and available for use in personal and commercial projects.

## Author

**A.W.M. Shakir**
- Email: shakeerwahid@gmail.com

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## Support

For support, email shakeerwahid@gmail.com or open an issue in the repository.

---

Made with ❤️ using vanilla JavaScript
