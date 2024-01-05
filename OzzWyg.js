/**
 * Ozz Wysiwyg Editor JS
 * The wysiwyg editor plugin for vanilla JS
 * 
 * Author: A.W.M. Shakir
 * Email: shakeerwahid@gmail.com
 */

class OzzWyg {
  constructor(options) {
    this.options = { ...OzzWyg.defaults, ...options };
    this.editors = document.querySelectorAll(this.options.selector).length > 0 ? document.querySelectorAll(this.options.selector) : false;

    // Tools
    this.tools = {
      'headings': {
        name: 'Headings',
        dom: '<div class="ozz-wyg__tool-headings-trigger"><button>Headings</button><div class="ozz-wyg__tool-headings-setting"></div></div>',
        child: {
          'h1': {
            name: 'Heading 1',
            dom: '<button data-action="formatBlock" data-value="h1">Heading 1</button>'
          },
          'h2': {
            name: 'Heading 2',
            dom: '<button data-action="formatBlock" data-value="h2">Heading 2</button>'
          },
          'h3': {
            name: 'Heading 3',
            dom: '<button data-action="formatBlock" data-value="h3">Heading 3</button>'
          },
          'h4': {
            name: 'Heading 4',
            dom: '<button data-action="formatBlock" data-value="h4">Heading 4</button>'
          },
          'h5': {
            name: 'Heading 5',
            dom: '<button data-action="formatBlock" data-value="h5">Heading 5</button>'
          },
          'h6': {
            name: 'Heading 6',
            dom: '<button data-action="formatBlock" data-value="h6">Heading 6</button>'
          },
          'paragraph': {
            name: 'Paragraph',
            dom: '<button data-action="formatBlock" data-value="P">Normal Text</button>'
          },
          'quote': {
            name: 'Quote',
            dom: '<button data-action="quote">Quote</button>'
          },
          'code': {
            name: 'Code',
            dom: '<button data-action="code">Code</button>'
          },
        }
      },
      'bold': {
        name: 'Bold',
        dom: '<button data-action="bold">Bold</button>'
      },
      'italic': {
        name: 'Italic',
        dom: '<button data-action="italic">Italic</button>'
      },
      'underline': {
        name: 'Underline',
        dom: '<button data-action="underline">Underline</button>',
        child: {
          'strikethrough': {
            name: 'Strikethrough',
            dom: '<button data-action="strikethrough">Strikethrough</button>',
          },
          'subscript': {
            name: 'Subscript',
            dom: '<button data-action="subscript">Subscript</button>',
          },
          'superscript': {
            name: 'Superscript',
            dom: '<button data-action="superscript">Superscript</button>',
          },
        }
      },
      'link': {
        name: 'Link',
        dom: '<div class="ozz-wyg__tool-link-trigger"><button data-action="link">Link</button><div class="ozz-wyg__tool-link-setting" role="dialog"></div></div>'
      },
      'table': {
        name: 'Table',
        dom: '<div class="ozz-wyg__tool-table-trigger"><button data-action="table">Table</button><div class="ozz-wyg__tool-table-setting"></div></div>'
      },
      'ol': {
        name: 'Ordered List',
        dom: '<button data-action="insertOrderedList">Ordered List</button>'
      },
      'ul': {
        name: 'Un-ordered List',
        dom: '<button data-action="insertUnorderedList">Un-ordered List</button>'
      },
      'alignLeft': {
        name: 'Align Left',
        dom: '<button data-action="justifyLeft">Align Left</button>',
        child: {
          'alignRight': {
            name: 'Align Right',
            dom: '<button data-action="justifyRight">Align Right</button>'
          },
          'alignCenter': {
            name: 'Align Center',
            dom: '<button data-action="justifyCenter">Align Center</button>'
          },
          'justify': {
            name: 'Justify',
            dom: '<button data-action="justifyFull">Justify</button>'
          },
          'indentIncrease': {
            name: 'Indent Increase',
            dom: '<button data-action="indent">Indent Increase</button>'
          },
          'indentDecrease': {
            name: 'Indent Decrease',
            dom: '<button data-action="outdent">Indent Decrease</button>'
          },
        }
      },
      'media': {
        name: 'Media',
        dom: '<div class="ozz-wyg__tool-media-trigger"><button data-action="media">Media</button><div class="ozz-wyg__tool-media-setting"></div></div>'
      },
      'codeView': {
        name: 'Code View',
        dom: '<button data-action="codeView">Code View</button>'
      }
    };

    // Initiate Each Editors
    if (this.editors) {
      this.editors.forEach(editor => {
        this.editorID = `i-${this.randomId()}`;
        editor.setAttribute('data-editor', this.editorID);
        this.editor = editor;
        this.initEditor();
      });
    }
  }

  /**
   * Initialize Wysiwyg Editor
   */
  initEditor() {
    this.editor.classList.add('ozz-wyg');
    this.editor.innerHTML = this.editorDOM();
    this.editor.querySelectorAll('button[data-action]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        this.fireAction(e);
      });
    });
    this.playGround = this.editor.querySelector('[data-editor-area]');
  }

  /**
   * Setup Editor DOM
   * @returns {*} EditorDOM
   */
  editorDOM() {
    let toolsDOM = '';
    this.options.tools.forEach(tool => {
      if (this.tools[tool]) {
        let parentTool = document.createElement('div');
        parentTool.classList.add('ozz-wyg__tool', `ozz-wyg__tool--${tool}`);

        if (this.tools[tool].child) {
          parentTool.innerHTML = `<div class="ozz-wyg__tool-has-child">${this.tools[tool].dom}<span class="more-tools-trigger"></span></div>`;
          // Get Child tools
          let childElementWrapper = document.createElement('div');
          childElementWrapper.classList.add('ozz-wyg__tool-child');
          this.options.tools.forEach(child2 => {
            if (this.tools[tool].child[child2]) {
              const childItem =  this.tools[tool].child[child2];
              childElementWrapper.innerHTML += childItem.dom;
            }
          });
          parentTool.appendChild(childElementWrapper);
        } else {
          parentTool.innerHTML = this.tools[tool].dom;
        }
        toolsDOM += parentTool.outerHTML;
      }
    });

    this.toolbar = `<div class="ozz-wyg__toolbar">${toolsDOM}</div>`;
    this.editableArea = `<div class="ozz-wyg__editor-area" data-editor-area contenteditable="true"></div>`;

    return this.toolbar + this.editableArea;
  }

  /**
   * Check if HTML view enabled
   * @returns {boolean}
   */
  isHTML() {
    return this.playGround.classList.contains('ozz-wyg-html-view');
  }

  /**
   * Utility - Find nested object item
   * @param {*} obj 
   * @param {*} key 
   * @returns 
   */
  findObject(obj, key) {
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    } else {
      for (const prop in obj) {
        if (obj[prop] !== null && typeof obj[prop] === 'object') {
          const result = this.findObject(obj[prop], key);
          if (result) {
            return result;
          }
        }
      }
    }

    return null;
  }

  /**
   * Random ID
   */
  randomId(length = 6) {
    return Math.random().toString(36).substring(2, length+2);
  }

  /**
   * Fire Action
   * @param {*} event
   */
  fireAction(event) {
    const action = event.target.getAttribute('data-action');

    // Format block
    let value = (action == 'formatBlock')
      ? event.target.getAttribute('data-value')
      : null;

    if (action == 'link') {
      // Link
      this.linkPopup(event);
    }
    else if (action == 'table') {
      // Create Table
      this.tablePopup(event);
    }
    else if (action == 'media') {
      // Upload Media
    }
    else if (action == 'quote') {
      this.quoteText();
    }else if (action == 'code') {
      this.codeText();
    } else if (action == 'codeView') {
      this.toggleCodeView();
    } else {
      this.exeCMD(action, value);
    }
  }

  /**
   * Link Tool Popup
   */
  linkPopup(ev) {
    const linkCls = 'ozz-wyg__tool-link-',
      parent = ev.target.closest(`.${linkCls}trigger`),
      settingsDOM = parent.querySelector(`.${linkCls}setting`),
      selection = window.getSelection();

    // Store selection
    let sRange = false;
    let selectionStr = selection.toString();
    if (selection.getRangeAt && selection.rangeCount) {
      sRange = selection.getRangeAt(0).cloneRange();
    }

    // Check if there's an existing anchor link
    const existingAnchor = selection.anchorNode?.parentElement.tagName === 'A' ? selection.anchorNode.parentElement : null,
      existingURL = existingAnchor ? existingAnchor.href : '',
      existingTarget = existingAnchor ? existingAnchor.target : '';

    settingsDOM.innerHTML = `
      <label>URL:</label> <input type="text" id="url-${this.editorID}" value="${existingURL}"><br>
      <label>Target:</label> <input type="text" id="target-${this.editorID}" value="${existingTarget ? existingTarget : '_blank'}"><br>
      <button class="ozz-wyg-regular-btn" id="insertLinkTrigger-${this.editorID}">${existingAnchor ? 'Update' : 'Insert'}</button>`;
    settingsDOM.classList.toggle('active');

    // Insert or update link
    const insertLinkTrigger = settingsDOM.querySelector('#insertLinkTrigger-' + this.editorID);
    insertLinkTrigger.addEventListener('click', () => {
      const urlInput = settingsDOM.querySelector('#url-' + this.editorID).value;
      const targetInput = settingsDOM.querySelector('#target-' + this.editorID).value;

      if (urlInput && targetInput) {
        const anchor = existingAnchor || document.createElement('a');
        anchor.href = urlInput;
        anchor.target = targetInput;
        anchor.textContent = existingAnchor ? existingAnchor.textContent : selectionStr;

        if (!existingAnchor) {
          if (sRange) {
            selection.removeAllRanges();
            selection.addRange(sRange);
          }
          document.execCommand('insertHTML', false, anchor.outerHTML);
        }
        settingsDOM.classList.remove('active'); // Close Popup
        this.linkPopOver(); // Init Link Popover
      }
    });

    // Close popup
    document.addEventListener('click', (e) => {
      if (!parent.contains(e.target)) {
        settingsDOM.classList.remove('active');
        this.linkPopOver(); // Init Link Popover
      }
    });
  }

  /**
   * Link popover
   */
  linkPopOver() {
    this.playGround.querySelectorAll('a').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        if (anchor.getAttribute('role') !== 'popover') {
          const popoverDOM = document.createElement('span');
          popoverDOM.classList.add('ozz-wyg-popover');
          popoverDOM.innerHTML = `<a href="${anchor.href}" role="popover" target="_blank">${anchor.href}</a><button class="ozz-wyg-unlink"></button>`;
          popoverDOM.style.top = `${e.clientY}px`;
          popoverDOM.style.left = `${e.clientX}px`;

          if (this.editor.querySelectorAll('.ozz-wyg-popover').length === 0) {
            anchor.insertAdjacentElement('afterend', popoverDOM);
          }

          const removePopoverEv = document.addEventListener('click', (ev) => {
            if (!anchor.contains(ev.target) && !popoverDOM.contains(ev.target)) {
              popoverDOM.remove();
              removeEventListener('click', removePopoverEv);
            }
          });

          // Unlink
          const unlinkButton = popoverDOM.querySelector('.ozz-wyg-unlink');
          unlinkButton.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const textNode = document.createTextNode(anchor.textContent);
            anchor.parentNode.replaceChild(textNode, anchor);
            popoverDOM.remove();
            removeEventListener('click', removePopoverEv);
          });
        }
      });
    });
  }

  /**
   * Table Popup
   */
  tablePopup(ev) {
    const
      tableCls = 'ozz-wyg__tool-table-',
      parent = ev.target.closest(`.${tableCls}trigger`),
      settingsDOM = parent.querySelector(`.${tableCls}setting`);

    settingsDOM.innerHTML = `
      <input type="number" min="1" max="100" placeholder="X" name="row-${this.editorID}">
      <input type="number" min="1" max="100" placeholder="Y" name="column-${this.editorID}">
      <button class="ozz-wyg-regular-btn">Insert</button>`;
    settingsDOM.classList.toggle('active');

    // Close popup
    document.addEventListener('click', (e) => {
      if (!parent.contains(e.target)) {
        settingsDOM.classList.remove('active');
      }
    });
  }

  /**
   * Execute Command
   * @param {string} command
   * @param value
   */
  exeCMD(command, value = null) {
    document.execCommand(command, false, value);
  }

  /**
   * Quote Text
   */
  quoteText() {
    const
      selection = window.getSelection(),
      quote = '<blockquote><p>' + selection.toString() + 
      '</p><footer class="blockquote-footer">--Footer, <cite>cite</cite></footer></blockquote><br>';

    document.execCommand('insertHTML', false, quote);
  }

  /**
   * Add Code
   */
  codeText() {
    const
      selection = window.getSelection(),
      code = '<code>' + selection.toString() + '</code>';

    document.execCommand('insertHTML', false, code);
  }

  /**
   * Toggle Code and visual view
   */
  toggleCodeView() {
    if (this.isHTML()) {
      this.playGround.classList.remove('ozz-wyg-html-view');
      this.playGround.innerHTML = this.playGround.textContent;
    } else {
      this.playGround.classList.add('ozz-wyg-html-view');
      this.playGround.textContent = this.playGround.innerHTML;
    }
  }
}

// Default options for the plugin
OzzWyg.defaults = {
  pluginName: 'Ozz Wysiwyg Editor',
  selector: '[data-ozz-wyg]',
  tools: [
    'headings',
    'paragraph', 'code', 'quote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'subscript',
    'superscript',
    'alignLeft',
    'alignRight',
    'alignCenter',
    'justify',
    'indent',
    'outdent',
    'ol',
    'ul',
    'link',
    'table',
    'media',
    'codeView'
  ]
};