/**
 * Ozz Wysiwyg Editor JS
 * The wysiwyg editor plugin for vanilla JS
 * 
 * Author: A.W.M. Shakir
 * Email: shakeerwahid@gmail.com
 */

class OzzWyg {
  // Static registry to track all editor instances
  static instances = new Map();

  constructor(options) {
    this.options = { ...OzzWyg.defaults, ...options };
    const editorElements = document.querySelectorAll(this.options.selector);
    this.editors = editorElements.length > 0 ? editorElements : false;

    // Tools
    this.tools = {
      'headings': {
        name: 'Headings',
        dom: '<div class="ozz-wyg__tool-headings-trigger"><button type="button">Headings</button><div class="ozz-wyg__tool-headings-setting"></div></div>',
        child: {
          'h1': {
            name: 'Heading 1',
            dom: '<button type="button" data-action="formatBlock" data-value="h1">Heading 1</button>'
          },
          'h2': {
            name: 'Heading 2',
            dom: '<button type="button" data-action="formatBlock" data-value="h2">Heading 2</button>'
          },
          'h3': {
            name: 'Heading 3',
            dom: '<button type="button" data-action="formatBlock" data-value="h3">Heading 3</button>'
          },
          'h4': {
            name: 'Heading 4',
            dom: '<button type="button" data-action="formatBlock" data-value="h4">Heading 4</button>'
          },
          'h5': {
            name: 'Heading 5',
            dom: '<button type="button" data-action="formatBlock" data-value="h5">Heading 5</button>'
          },
          'h6': {
            name: 'Heading 6',
            dom: '<button type="button" data-action="formatBlock" data-value="h6">Heading 6</button>'
          },
          'paragraph': {
            name: 'Paragraph',
            dom: '<button type="button" data-action="formatBlock" data-value="P">Normal Text</button>'
          },
          'quote': {
            name: 'Quote',
            dom: '<button type="button" data-action="quote">Quote</button>'
          },
          'code': {
            name: 'Code',
            dom: '<button type="button" data-action="code">Code</button>'
          },
        }
      },
      'bold': {
        name: 'Bold',
        dom: '<button type="button" data-action="bold">Bold</button>'
      },
      'italic': {
        name: 'Italic',
        dom: '<button type="button" data-action="italic">Italic</button>'
      },
      'underline': {
        name: 'Underline',
        dom: '<button type="button" data-action="underline">Underline</button>',
        child: {
          'strikethrough': {
            name: 'Strikethrough',
            dom: '<button type="button" data-action="strikethrough">Strikethrough</button>',
          },
          'subscript': {
            name: 'Subscript',
            dom: '<button type="button" data-action="subscript">Subscript</button>',
          },
          'superscript': {
            name: 'Superscript',
            dom: '<button type="button" data-action="superscript">Superscript</button>',
          },
        }
      },
      'link': {
        name: 'Link',
        dom: '<div class="ozz-wyg__tool-link-trigger"><button type="button" data-action="link">Link</button><div class="ozz-wyg__tool-link-setting"></div></div>'
      },
      'table': {
        name: 'Table',
        dom: '<div class="ozz-wyg__tool-table-trigger"><button type="button" data-action="table">Table</button><div class="ozz-wyg__tool-table-setting"></div></div>'
      },
      'ol': {
        name: 'Ordered List',
        dom: '<button type="button" data-action="insertOrderedList">Ordered List</button>'
      },
      'ul': {
        name: 'Un-ordered List',
        dom: '<button type="button" data-action="insertUnorderedList">Un-ordered List</button>'
      },
      'alignLeft': {
        name: 'Align Left',
        dom: '<button type="button" data-action="justifyLeft">Align Left</button>',
        child: {
          'alignRight': {
            name: 'Align Right',
            dom: '<button type="button" data-action="justifyRight">Align Right</button>'
          },
          'alignCenter': {
            name: 'Align Center',
            dom: '<button type="button" data-action="justifyCenter">Align Center</button>'
          },
          'justify': {
            name: 'Justify',
            dom: '<button type="button" data-action="justifyFull">Justify</button>'
          },
          'indentIncrease': {
            name: 'Indent Increase',
            dom: '<button type="button" data-action="indent">Indent Increase</button>'
          },
          'indentDecrease': {
            name: 'Indent Decrease',
            dom: '<button type="button" data-action="outdent">Indent Decrease</button>'
          },
        }
      },
      'media': {
        name: 'Media',
        dom: '<div class="ozz-wyg__tool-media-trigger"><button type="button" data-action="media">Media</button><div class="ozz-wyg__tool-media-setting"></div></div>'
      },
      'codeView': {
        name: 'Code View',
        dom: '<button type="button" data-action="codeView">Code View</button>'
      }
    };

    // Initiate Each Editors
    this.editorInstances = new Map();
    if (this.editors) {
      this.editors.forEach(editor => {
        const editorID = `i-${this.randomId()}`;
        editor.setAttribute('data-editor', editorID);
        const instance = {
          id: editorID,
          element: editor,
          playGround: null,
          ozzWygInstance: this
        };
        this.editorInstances.set(editorID, instance);
        this.currentEditorID = editorID;
        this.editor = editor;
        this.editorID = editorID;
        this.initEditor();
        instance.playGround = this.playGround;
        
        // Register instance in static registry
        OzzWyg.instances.set(editor, this);
        OzzWyg.instances.set(editorID, this);
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
    
    // Initialize child tool dropdowns
    this.editor.querySelectorAll('.ozz-wyg__tool-has-child').forEach(parent => {
      const trigger = parent.querySelector('.more-tools-trigger');
      const childMenu = parent.parentElement.querySelector('.ozz-wyg__tool-child');
      if (trigger && childMenu) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          childMenu.classList.toggle('active');
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.ozz-wyg__tool-has-child')) {
        this.editor.querySelectorAll('.ozz-wyg__tool-child').forEach(menu => {
          menu.classList.remove('active');
        });
      }
    });
    
    this.playGround = this.editor.querySelector('[data-editor-area]');
    
    // Initialize event listeners
    this.initEventListeners();
  }

  /**
   * Initialize all event listeners for the editor
   */
  initEventListeners() {
    // Input event - fires on content change
    this.playGround.addEventListener('input', (e) => {
      this.handleInput(e);
    });

    // Focus event - when editor gains focus
    this.playGround.addEventListener('focus', (e) => {
      this.emitEvent('focus', { editorID: this.editorID, event: e });
      this.editor.classList.add('ozz-wyg--focused');
    });

    // Blur event - when editor loses focus
    this.playGround.addEventListener('blur', (e) => {
      this.emitEvent('blur', { editorID: this.editorID, event: e });
      this.editor.classList.remove('ozz-wyg--focused');
      this.emitEvent('change', { 
        editorID: this.editorID, 
        content: this.playGround.innerHTML,
        event: e 
      });
    });

    // Paste event - clean pasted content
    this.playGround.addEventListener('paste', (e) => {
      this.handlePaste(e);
    });

    // Keyboard shortcuts
    this.playGround.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // Selection change - update toolbar states
    document.addEventListener('selectionchange', () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const commonAncestor = range.commonAncestorContainer;
        const node = commonAncestor.nodeType === 3 ? commonAncestor.parentElement : commonAncestor;
        if (node && this.playGround.contains(node)) {
          this.updateToolbarStates();
        }
      }
    });

    // Click event - update toolbar states when clicking in editor
    this.playGround.addEventListener('click', () => {
      setTimeout(() => this.updateToolbarStates(), 10);
    });

    // Mouseup event - update toolbar states after selection
    this.playGround.addEventListener('mouseup', () => {
      setTimeout(() => this.updateToolbarStates(), 10);
    });

    // Keyup event - update toolbar states after keyboard actions
    this.playGround.addEventListener('keyup', () => {
      setTimeout(() => this.updateToolbarStates(), 10);
    });

    // Keydown event - update toolbar states for arrow keys and other navigation
    this.playGround.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        setTimeout(() => this.updateToolbarStates(), 10);
      }
    });
  }

  /**
   * Handle input event
   */
  handleInput(e) {
    // Modify tables
    const tables = this.playGround.querySelectorAll('table');
    tables.forEach((table) => {
      // Wrap table
      if (!table.closest('.ozz-wyg-table-wrapper')) {
        const tableWrapped = document.createElement('div');
        tableWrapped.classList.add('ozz-wyg-table-wrapper');
        tableWrapped.innerHTML = table.outerHTML;
        table.outerHTML = tableWrapped.outerHTML;
      }

      // Clear inline styles
      table.removeAttribute('style');
      const tItems = table.querySelectorAll('tbody, thead, tfoot, tr, td, th');
      tItems.forEach(item => {
        item.removeAttribute('style');
      });
    });

    // Emit custom input event
    this.emitEvent('input', { 
      editorID: this.editorID, 
      content: this.playGround.innerHTML,
      event: e 
    });
  }

  /**
   * Handle paste event - clean pasted content
   */
  handlePaste(e) {
    e.preventDefault();
    
    // Get pasted content
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
    
    // Clean the pasted content
    const cleanedContent = this.cleanPastedContent(pastedData);
    
    // Insert cleaned content
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Delete selected content (deleteContents is a Range method, not Selection)
      range.deleteContents();
      
      // Insert cleaned content
      if (cleanedContent) {
        // If it's HTML, use fragment
        if (pastedData.includes('<')) {
          const fragment = range.createContextualFragment(cleanedContent);
          range.insertNode(fragment);
          
          // Move cursor to end of inserted content
          if (fragment.lastChild) {
            range.setStartAfter(fragment.lastChild);
          } else {
            range.setStartAfter(fragment);
          }
        } else {
          // Plain text
          const textNode = document.createTextNode(cleanedContent);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
        }
        range.collapse(true);
        
        // Update selection
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      // No selection, insert at cursor position
      const range = document.createRange();
      range.selectNodeContents(this.playGround);
      range.collapse(false);
      
      if (cleanedContent) {
        if (pastedData.includes('<')) {
          const fragment = range.createContextualFragment(cleanedContent);
          range.insertNode(fragment);
        } else {
          const textNode = document.createTextNode(cleanedContent);
          range.insertNode(textNode);
        }
      }
    }

    // Emit paste event
    this.emitEvent('paste', { 
      editorID: this.editorID, 
      originalContent: pastedData,
      cleanedContent: cleanedContent,
      event: e 
    });

    // Trigger input event manually
    this.playGround.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /**
   * Clean pasted content - remove unwanted styles and tags
   */
  cleanPastedContent(content) {
    // Create temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Remove unwanted attributes
    const unwantedAttributes = ['style', 'class', 'id', 'width', 'height', 'border'];
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      unwantedAttributes.forEach(attr => {
        el.removeAttribute(attr);
      });
    });

    // Remove script and style tags
    const scripts = tempDiv.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());

    // Clean up empty elements
    const emptyElements = tempDiv.querySelectorAll('p:empty, div:empty, span:empty');
    emptyElements.forEach(el => {
      if (el.textContent.trim() === '') {
        el.remove();
      }
    });

    return tempDiv.innerHTML || tempDiv.textContent;
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeydown(e) {
    // Ctrl/Cmd + B - Bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      this.exeCMD('bold');
      this.updateToolbarStates();
      return;
    }

    // Ctrl/Cmd + I - Italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      this.exeCMD('italic');
      this.updateToolbarStates();
      return;
    }

    // Ctrl/Cmd + U - Underline
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      this.exeCMD('underline');
      this.updateToolbarStates();
      return;
    }

    // Ctrl/Cmd + K - Link
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const linkBtn = this.editor.querySelector('button[data-action="link"]');
      if (linkBtn) linkBtn.click();
      return;
    }

    // Ctrl/Cmd + Z - Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      // Allow default undo behavior
      setTimeout(() => this.updateToolbarStates(), 10);
      return;
    }

    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
    if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
        ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
      // Allow default redo behavior
      setTimeout(() => this.updateToolbarStates(), 10);
      return;
    }

    // Emit keydown event
    this.emitEvent('keydown', { 
      editorID: this.editorID, 
      key: e.key,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
      event: e 
    });
  }

  /**
   * Update toolbar button states based on current selection
   */
  updateToolbarStates() {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
      // Clear all active states if no selection
      this.clearAllToolbarStates();
      return;
    }

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;
    
    // Check if selection is within this editor
    const node = commonAncestor.nodeType === 3 ? commonAncestor.parentElement : commonAncestor;
    if (!node || !this.playGround.contains(node)) {
      this.clearAllToolbarStates();
      return;
    }

    // Store current focus to restore later
    const wasFocused = document.activeElement === this.playGround;
    
    // Temporarily focus playground for queryCommandState to work correctly
    if (!wasFocused) {
      this.playGround.focus();
    }

    // Update bold button
    const boldBtn = this.editor.querySelector('button[data-action="bold"]');
    if (boldBtn) {
      try {
        const isBold = document.queryCommandState('bold');
        boldBtn.classList.toggle('active', isBold);
      } catch (e) {
        // Fallback: check if parent is strong or b tag
        const parent = this.getParentTag(range, ['strong', 'b']);
        boldBtn.classList.toggle('active', !!parent);
      }
    }

    // Update italic button
    const italicBtn = this.editor.querySelector('button[data-action="italic"]');
    if (italicBtn) {
      try {
        const isItalic = document.queryCommandState('italic');
        italicBtn.classList.toggle('active', isItalic);
      } catch (e) {
        const parent = this.getParentTag(range, ['em', 'i']);
        italicBtn.classList.toggle('active', !!parent);
      }
    }

    // Update underline button
    const underlineBtn = this.editor.querySelector('button[data-action="underline"]');
    if (underlineBtn) {
      try {
        const isUnderline = document.queryCommandState('underline');
        underlineBtn.classList.toggle('active', isUnderline);
      } catch (e) {
        const parent = this.getParentTag(range, ['u']);
        underlineBtn.classList.toggle('active', !!parent);
      }
    }

    // Update strikethrough button
    const strikeBtn = this.editor.querySelector('button[data-action="strikethrough"]');
    if (strikeBtn) {
      try {
        const isStrike = document.queryCommandState('strikethrough');
        strikeBtn.classList.toggle('active', isStrike);
      } catch (e) {
        const parent = this.getParentTag(range, ['s', 'strike', 'del']);
        strikeBtn.classList.toggle('active', !!parent);
      }
    }

    // Update subscript button
    const subBtn = this.editor.querySelector('button[data-action="subscript"]');
    if (subBtn) {
      try {
        const isSub = document.queryCommandState('subscript');
        subBtn.classList.toggle('active', isSub);
      } catch (e) {
        const parent = this.getParentTag(range, ['sub']);
        subBtn.classList.toggle('active', !!parent);
      }
    }

    // Update superscript button
    const supBtn = this.editor.querySelector('button[data-action="superscript"]');
    if (supBtn) {
      try {
        const isSup = document.queryCommandState('superscript');
        supBtn.classList.toggle('active', isSup);
      } catch (e) {
        const parent = this.getParentTag(range, ['sup']);
        supBtn.classList.toggle('active', !!parent);
      }
    }

    // Update format block (headings, paragraph)
    this.updateFormatBlockState(range);

    // Update list buttons
    const olBtn = this.editor.querySelector('button[data-action="insertOrderedList"]');
    if (olBtn) {
      try {
        const isOL = document.queryCommandState('insertOrderedList');
        olBtn.classList.toggle('active', isOL);
      } catch (e) {
        const parent = this.getParentTag(range, ['ol']);
        olBtn.classList.toggle('active', !!parent);
      }
    }

    const ulBtn = this.editor.querySelector('button[data-action="insertUnorderedList"]');
    if (ulBtn) {
      try {
        const isUL = document.queryCommandState('insertUnorderedList');
        ulBtn.classList.toggle('active', isUL);
      } catch (e) {
        const parent = this.getParentTag(range, ['ul']);
        ulBtn.classList.toggle('active', !!parent);
      }
    }

    // Update alignment buttons
    const alignLeftBtn = this.editor.querySelector('button[data-action="justifyLeft"]');
    if (alignLeftBtn) {
      try {
        const isLeft = document.queryCommandState('justifyLeft');
        alignLeftBtn.classList.toggle('active', isLeft);
      } catch (e) {
        alignLeftBtn.classList.remove('active');
      }
    }

    const alignCenterBtn = this.editor.querySelector('button[data-action="justifyCenter"]');
    if (alignCenterBtn) {
      try {
        const isCenter = document.queryCommandState('justifyCenter');
        alignCenterBtn.classList.toggle('active', isCenter);
      } catch (e) {
        alignCenterBtn.classList.remove('active');
      }
    }

    const alignRightBtn = this.editor.querySelector('button[data-action="justifyRight"]');
    if (alignRightBtn) {
      try {
        const isRight = document.queryCommandState('justifyRight');
        alignRightBtn.classList.toggle('active', isRight);
      } catch (e) {
        alignRightBtn.classList.remove('active');
      }
    }

    const justifyBtn = this.editor.querySelector('button[data-action="justifyFull"]');
    if (justifyBtn) {
      try {
        const isJustify = document.queryCommandState('justifyFull');
        justifyBtn.classList.toggle('active', isJustify);
      } catch (e) {
        justifyBtn.classList.remove('active');
      }
    }
  }

  /**
   * Get parent element with specific tag names
   */
  getParentTag(range, tagNames) {
    let node = range.commonAncestorContainer;
    if (node.nodeType === 3) {
      node = node.parentElement;
    }
    
    while (node && node !== this.playGround) {
      if (node.nodeType === 1 && tagNames.includes(node.tagName.toLowerCase())) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  /**
   * Update format block state (headings, paragraph)
   */
  updateFormatBlockState(range) {
    let node = range.commonAncestorContainer;
    if (node.nodeType === 3) {
      node = node.parentElement;
    }
    
    // Find the block-level element
    let blockTag = null;
    while (node && node !== this.playGround) {
      if (node.nodeType === 1) {
        const tagName = node.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'pre', 'code', 'div'].includes(tagName)) {
          blockTag = tagName;
          break;
        }
      }
      node = node.parentElement;
    }
    
    // Update heading/format buttons
    const headingBtns = this.editor.querySelectorAll('button[data-action="formatBlock"]');
    headingBtns.forEach(btn => {
      const value = btn.getAttribute('data-value');
      if (value) {
        const valueLower = value.toLowerCase();
        // Handle paragraph - can be 'p' or 'P'
        if (valueLower === 'p' && (blockTag === 'p' || blockTag === 'div' || !blockTag)) {
          btn.classList.toggle('active', true);
        } else if (valueLower === blockTag) {
          btn.classList.toggle('active', true);
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }

  /**
   * Clear all toolbar button active states
   */
  clearAllToolbarStates() {
    const allButtons = this.editor.querySelectorAll('button[data-action]');
    allButtons.forEach(btn => btn.classList.remove('active'));
  }

  /**
   * Emit custom event
   */
  emitEvent(eventName, data = {}) {
    const event = new CustomEvent(`ozzwyg:${eventName}`, {
      detail: {
        editorID: this.editorID,
        editor: this.editor,
        playGround: this.playGround,
        ...data
      },
      bubbles: true,
      cancelable: true
    });
    
    // Dispatch on both the editor element and the playground
    this.editor.dispatchEvent(event);
    this.playGround.dispatchEvent(event);
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
      this.linkPopUp(event);
    } else if (action == 'table') {
      // Create Table
      this.tablePopUp(event);
    } else if (action == 'media') {
      // insert Media
      this.mediaPopUp(event);
    } else if (action == 'quote') {
      this.quoteText();
    } else if (action == 'code') {
      this.codeText();
    } else if (action == 'codeView') {
      this.toggleCodeView();
    } else {
      this.exeCMD(action, value);
    }

    // Update toolbar states after action
    setTimeout(() => this.updateToolbarStates(), 10);
  }

  /**
   * Link Tool Popup
   */
  linkPopUp(ev) {
    const linkCls = 'ozz-wyg__tool-link-',
      parent = ev.target.closest(`.${linkCls}trigger`);
    
    if (!parent) return;
    
    const settingsDOM = parent.querySelector(`.${linkCls}setting`);
    if (!settingsDOM) return;
    
    const selection = window.getSelection();

    // Store selection
    let sRange = false;
    let selectionStr = selection.toString();
    if (selection.getRangeAt && selection.rangeCount) {
      sRange = selection.getRangeAt(0).cloneRange();
    }

    // Check if there's an existing anchor link
    let existingAnchor = null;
    if (selection.anchorNode) {
      const parent = selection.anchorNode.parentElement;
      if (parent && parent.tagName === 'A') {
        existingAnchor = parent;
      } else if (parent && parent.closest('a')) {
        existingAnchor = parent.closest('a');
      }
    }
    const existingURL = existingAnchor ? existingAnchor.href : '';
    const existingTarget = existingAnchor ? existingAnchor.target : '';

    settingsDOM.innerHTML = `
      <label>URL:</label> <input type="text" id="url-${this.editorID}" value="${existingURL}"><br>
      <label>Target:</label> <input type="text" id="target-${this.editorID}" value="${existingTarget ? existingTarget : '_blank'}"><br>
      <button type="button" class="ozz-wyg-regular-btn" id="insertLinkTrigger-${this.editorID}">${existingAnchor ? 'Update' : 'Insert'}</button>`;
    settingsDOM.classList.toggle('active');

    // Insert or update link
    const insertLinkTrigger = settingsDOM.querySelector('#insertLinkTrigger-' + this.editorID);
    insertLinkTrigger.addEventListener('click', () => {
      const urlInput = settingsDOM.querySelector('#url-' + this.editorID).value;
      const targetInput = settingsDOM.querySelector('#target-' + this.editorID).value;

      if (urlInput && targetInput) {
        if (existingAnchor) {
          // Update existing anchor
          existingAnchor.href = urlInput;
          existingAnchor.target = targetInput;
        } else {
          // Create new anchor
          const anchor = document.createElement('a');
          anchor.href = urlInput;
          anchor.target = targetInput;
          anchor.textContent = selectionStr || urlInput;
          
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
      // Only add listeners if not already added
      if (anchor.hasAttribute('data-link-handled')) {
        return;
      }
      anchor.setAttribute('data-link-handled', 'true');
      
      anchor.addEventListener('click', (e) => {
        if (anchor.getAttribute('role') !== 'popover') {
          e.preventDefault();
          e.stopPropagation();
          const popoverDOM = document.createElement('span');
          popoverDOM.setAttribute('contenteditable', false);
          popoverDOM.classList.add('ozz-wyg-popover');
          popoverDOM.innerHTML = `
          <a href="${anchor.href}" role="popover" target="_blank">${anchor.href}</a>
          <button type="button" class="ozz-wyg-editlink"></button>
          <button type="button" class="ozz-wyg-unlink"></button>`;

          if (this.editor.querySelectorAll('.ozz-wyg-popover').length === 0) {
            anchor.insertAdjacentElement('afterend', popoverDOM);

            // Position popover element
            let {rx, ry} = 0;
            if (popoverDOM.closest('.ozz-wyg-table-wrapper')) {
              const cTbl = popoverDOM.closest('.ozz-wyg-table-wrapper');
              ry = cTbl.getBoundingClientRect().y;
              rx = cTbl.getBoundingClientRect().x;
            }
            popoverDOM.style.top = `${e.clientY - ry}px`;
            popoverDOM.style.left = `${e.clientX - rx}px`;
          }

          const removePopoverEv = (ev) => {
            if (!anchor.contains(ev.target) && !popoverDOM.contains(ev.target)) {
              popoverDOM.remove();
              document.removeEventListener('click', removePopoverEv);
            }
          };
          document.addEventListener('click', removePopoverEv);

          // Unlink
          popoverDOM.querySelector('.ozz-wyg-unlink').addEventListener('click', (ev) => {
            ev.stopPropagation();
            const textNode = document.createTextNode(anchor.textContent);
            anchor.parentNode.replaceChild(textNode, anchor);
            popoverDOM.remove();
            document.removeEventListener('click', removePopoverEv);
          });

          // Edit this link
          popoverDOM.querySelector('.ozz-wyg-editlink').addEventListener('click', () => {
            const linkBtn = this.editor.querySelector('button[data-action="link"]');
            setTimeout(() => { linkBtn.click() }, 1);
          });
        }
      });
    });
  }

  /**
   * Table Popup
   */
  tablePopUp(ev) {
    const tableCls = 'ozz-wyg__tool-table-',
      parent = ev.target.closest(`.${tableCls}trigger`);
    
    if (!parent) return;
    
    const settingsDOM = parent.querySelector(`.${tableCls}setting`);
    if (!settingsDOM) return;
    
    const selection = window.getSelection();

    // Store selection
    let sRange = false;
    if (selection.getRangeAt && selection.rangeCount) {
      sRange = selection.getRangeAt(0).cloneRange();
    }

    settingsDOM.innerHTML = `
      <input type="number" min="1" max="100" value="2" placeholder="X" id="row-${this.editorID}">
      <input type="number" min="1" max="100" value="2" placeholder="Y" id="column-${this.editorID}">
      <span class="sub-options">
        <span>
          <input type="checkbox" id="has-th-${this.editorID}">
          <label for="has-th-${this.editorID}">No Header</label>
        </span>
        <span>
          <input type="checkbox" id="has-footer-${this.editorID}">
          <label for="has-footer-${this.editorID}">No Footer</label>
        </span>
      </span>
      <button type="button" class="ozz-wyg-regular-btn" id="insertTableTrigger-${this.editorID}">Insert</button>`;
    settingsDOM.classList.toggle('active');

    // Insert or update Table
    const insertTableTrigger = settingsDOM.querySelector('#insertTableTrigger-' + this.editorID);
    insertTableTrigger.addEventListener('click', () => {
      let rows = settingsDOM.querySelector('#row-' + this.editorID).value,
      columns = settingsDOM.querySelector('#column-' + this.editorID).value,
      noHead = settingsDOM.querySelector('#has-th-' + this.editorID).checked,
      noFooter = settingsDOM.querySelector('#has-footer-' + this.editorID).checked;
      rows = (rows > 100) ? 100 : rows;
      columns = (columns > 100) ? 100 : columns;

      // Create Table
      const table = document.createElement('table');
      // Table Head
      if (noHead === false) {
        const tHead = table.createTHead();
        const headerRow = tHead.insertRow();
        for (let i = 0; i < columns; i++) {
          const th = document.createElement('th');
          headerRow.appendChild(th);
        }
      }

      // Table Body
      const tBody = table.createTBody();
      for (let i = 0; i < rows; i++) {
        const tRows = tBody.insertRow(i);
        for (let j = 0; j < columns; j++) {
          tRows.insertCell(j);
        }
      }

      // Table Footer
      if (noFooter === false) {
        const tFoot = table.createTFoot();
        const footRow = tFoot.insertRow();
        for (let i = 0; i < columns; i++) {
          footRow.insertCell(i);
        }
      }

      // Set Range Again
      if (sRange) {
        selection.removeAllRanges();
        selection.addRange(sRange);
      }

      // Create Table Wrapper
      const $table = document.createElement('div');
      $table.classList.add('ozz-wyg-table-wrapper');
      $table.innerHTML = table.outerHTML;
      document.execCommand('insertHTML', false, `<br>${$table.outerHTML}<br>`);
      this.tableActions(); // Table Actions
    });

    // Close popup
    document.addEventListener('click', (e) => {
      if (!parent.contains(e.target)) {
        settingsDOM.classList.remove('active');
      }
    });
  }

  /**
   * Table actions
   */
  tableActions() {
    const $table = this.playGround.querySelectorAll('.ozz-wyg-table-wrapper');
    $table.forEach(tbl => {
      // Only add listeners if not already added
      if (tbl.hasAttribute('data-table-handled')) {
        return;
      }
      tbl.setAttribute('data-table-handled', 'true');
      
      tbl.addEventListener('mouseover', () => {
        let tblTools = tbl.querySelectorAll('.ozz-wyg-table-actions');
        if (tblTools.length === 0) {
          const actions = document.createElement('div');
          actions.setAttribute('contenteditable', false);
          actions.classList.add('ozz-wyg-table-actions');
          actions.innerHTML = `
          <span class="ozz-wyg-table-actions__row">
            <button type="button" title="Add Row" data-tbl-action="addrow">Add Row</button>
            <button type="button" title="Remove Row" data-tbl-action="deleterow">Delete Row</button>
          </span>
          <span class="ozz-wyg-table-actions__column">
            <button type="button" title="Add Column" data-tbl-action="addcol">Add Column</button>
            <button type="button" title="Remove Column" data-tbl-action="deletecol">Delete Column</button>
          </span>`;

          // Perform Table Actions
          actions.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const action = e.target.getAttribute('data-tbl-action');
              switch (action) {
                case 'addrow':
                  this.addTableRow(tbl);
                  break;
                case 'deleterow':
                  this.deleteTableRow(tbl);
                  break;
                case 'addcol':
                  this.addTableCol(tbl);
                  break;
                case 'deletecol':
                  this.deleteTableCol(tbl);
                  break;
                default:
                  break;
              }
            });
          });
          tbl.appendChild(actions);
        }
      });

      tbl.addEventListener('mouseleave', () => {
        const tblTools = tbl.querySelectorAll('.ozz-wyg-table-actions');
        if (tblTools.length > 0) {
          tblTools[0].remove();
        }
      });
    });
  }

  /**
   * Add Table Row
   * @param table_wrap
   */
  addTableRow(table_wrap) {
    if (!table_wrap) return;
    const tbody = table_wrap.querySelector('tbody');
    if (tbody) {
      const firstRow = tbody.querySelector('tr');
      const cellsCount = firstRow ? firstRow.querySelectorAll('td, th').length : 1;
      const newRow = tbody.insertRow(-1);
      for (let i = 0; i < cellsCount; i++) {
        const td = document.createElement('td');
        td.innerHTML = '<br>';
        newRow.appendChild(td);
      }
    }
  }

  /**
   * Delete Table Row
   * @param table_wrap
   */
  deleteTableRow(table_wrap) {
    if (!table_wrap) return;
    const table = table_wrap.querySelector('table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    if (tbody && tbody.rows.length > 1) {
      tbody.deleteRow(-1);
    }
  }

  /**
   * Add Table Column
   * @param table_wrap
   */
  addTableCol(table_wrap) {
    if (!table_wrap) return;
    const thead = table_wrap.querySelector('thead');
    const tbody = table_wrap.querySelector('tbody');
    const tfoot = table_wrap.querySelector('tfoot');

    const addCellToRows = (rows, newCellIndex, type='td') => {
      if (!rows || rows.length === 0) return;
      rows.forEach((row) => {
        const td = document.createElement(type);
        td.innerHTML = '<br>';
        if (newCellIndex < row.cells.length) {
          row.insertBefore(td, row.cells[newCellIndex]);
        } else {
          row.appendChild(td);
        }
      });
    }

    if (thead) {
      const headerRows = thead.querySelectorAll('tr');
      if (headerRows.length > 0) {
        const firstRow = headerRows[0];
        const newCellIndex = firstRow ? firstRow.querySelectorAll('th, td').length : 0;
        addCellToRows(headerRows, newCellIndex, 'th');
      }
    }

    if (tbody) {
      const bodyRows = tbody.querySelectorAll('tr');
      if (bodyRows.length > 0) {
        const firstRow = bodyRows[0];
        const newCellIndex = firstRow ? firstRow.querySelectorAll('td').length : 0;
        addCellToRows(bodyRows, newCellIndex);
      }
    }

    if (tfoot) {
      const footerRows = tfoot.querySelectorAll('tr');
      if (footerRows.length > 0) {
        const firstRow = footerRows[0];
        const newCellIndex = firstRow ? firstRow.querySelectorAll('td').length : 0;
        addCellToRows(footerRows, newCellIndex);
      }
    }
  }

  /**
   * Delete Table Column
   * @param table_wrap
   */
  deleteTableCol(table_wrap) {
    if (!table_wrap) return;
    const thead = table_wrap.querySelector('thead');
    const tbody = table_wrap.querySelector('tbody');
    const tfoot = table_wrap.querySelector('tfoot');

    const deleteLastCell = (rows) => {
      if (!rows || rows.length === 0) return;
      const firstRow = rows[0];
      if (!firstRow) return;
      const lastCellIndex = firstRow.cells.length - 1;
      if (lastCellIndex >= 0) {
        rows.forEach((row) => {
          if (row.cells.length > 1) {
            row.deleteCell(lastCellIndex);
          }
        });
      }
    }

    if (thead) {
      deleteLastCell(thead.querySelectorAll('tr'));
    }

    if (tbody) {
      deleteLastCell(tbody.querySelectorAll('tr'));
    }

    if (tfoot) {
      deleteLastCell(tfoot.querySelectorAll('tr'));
    }
  }

  /**
   * Insert Media
   */
  mediaPopUp(ev) {
    const linkCls = 'ozz-wyg__tool-media-',
      parent = ev.target.closest(`.${linkCls}trigger`);
    
    if (!parent) return;
    
    const settingsDOM = parent.querySelector(`.${linkCls}setting`);
    if (!settingsDOM) return;
    
    const selection = window.getSelection();

    // Store selection
    let sRange = false;
    if (selection.getRangeAt && selection.rangeCount) {
      sRange = selection.getRangeAt(0).cloneRange();
    }

    // Get Selected Media element tp update - To Do
    let existingURL = '';
    let existingALT = '';

    settingsDOM.innerHTML = `
      <label>Upload:</label> <input type="file" accept="image/*,video/*" id="file-${this.editorID}"><br>
      <label>Media URL:</label> <input type="text" id="url-${this.editorID}" value="${existingURL}"><br>
      <label>Alt:</label> <input type="text" id="alt-${this.editorID}" value="${existingALT}"><br>
      <button type="button" class="ozz-wyg-regular-btn" id="insertMediaTrigger-${this.editorID}">${existingURL ? 'Update' : 'Insert'}</button>`;
    settingsDOM.classList.toggle('active');

    // Insert Media
    const insertMediaTrigger = settingsDOM.querySelector('#insertMediaTrigger-' + this.editorID);
    insertMediaTrigger.addEventListener('click', () => {
      const files = settingsDOM.querySelector('#file-' + this.editorID).files;
      const url = settingsDOM.querySelector('#url-' + this.editorID).value;
      const alt = settingsDOM.querySelector('#alt-' + this.editorID).value;
      let altText = alt;
      let fileType = 'unknown';

      // Set Range Again
      if (sRange) {
        selection.removeAllRanges();
        selection.addRange(sRange);
      }

      if (files.length > 0) {
        // File (DataURI)
        const file = files[0];
        fileType = file.type.split('/')[0];
        if (fileType === 'image' || fileType === 'video') {
          const reader = new FileReader();
          reader.onload = function (event) {
            altText = altText == '' ? file.name : altText;
            processAndInsertMediaElement(fileType, event.target.result, altText);
          };
          reader.readAsDataURL(file);
        }
      } else if (url !== '') {
        // URL attachment
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
        const fileExt = filename.includes('.') ? filename.split('.').pop().toLowerCase() : '';

        // Determine file type based on the file extension or URL
        if (['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(fileExt)) {
          fileType = 'image';
        } else if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(fileExt)) {
          fileType = 'video';
        } else if (this.isYouTubeURL(url)) {
          fileType = 'youtube';
        } else if (this.isVimeoURL(url)) {
          fileType = 'vimeo';
        }

        altText = (altText !== '') ? altText : filename;
        processAndInsertMediaElement(fileType, url, altText);
      }
    });

    // Process and Insert Media Element
    const processAndInsertMediaElement = (fileType, mediaItem, altText) => {
      let mediaElement;
      if (fileType === 'image') {
        mediaElement = `<img src="${mediaItem}" class="align-center" alt="${altText}">`;
      } else if (fileType === 'video') {
        mediaElement = `<br><div class="media-wrapper"><video src="${mediaItem}" controls></video></div><br>`;
      } else if (fileType === 'youtube') {
        mediaElement = `<br>${this.getYouTubeEmbedCode(mediaItem)}<br>`;
      } else if (fileType === 'vimeo') {
        mediaElement = `<br>${this.getVimeoEmbedCode(mediaItem)}<br>`;
      } else {
        mediaElement = false;
      }

      // Insert Media
      if (mediaElement !== false) {
        document.execCommand('insertHTML', false, `<br>${mediaElement}<br>`);
        settingsDOM.classList.remove('active'); // Close PopUp

        this.mediaPopover(); // Config Media Popover
      }
    }

    // Close popup
    document.addEventListener('click', (e) => {
      if (!parent.contains(e.target)) {
        settingsDOM.classList.remove('active');
      }
    });
  }

  /**
   * Media Popover
   */
  mediaPopover() {
    // Use event delegation to prevent duplicate listeners
    const mediaItems = this.playGround.querySelectorAll('img, .media-wrapper');
    mediaItems.forEach(mediaItem => {
      // Remove existing click handlers by cloning
      if (mediaItem.hasAttribute('data-media-handled')) {
        return;
      }
      mediaItem.setAttribute('data-media-handled', 'true');
      mediaItem.addEventListener('click', (e) => {
        const popoverDOM = document.createElement('div');
        popoverDOM.setAttribute('contenteditable', false);
        popoverDOM.classList.add('ozz-wyg-media-actions');

        // Set Selected Width
        const regex = /^w-\d+/;
        const widthClass = Array.from(mediaItem.classList).find(className => regex.test(className));
        let options = '<option value="auto">Auto</option>';
        for (let i = 1; i < 21; i++) {
          const clsName = 'w-'+i * 5;
          if (clsName == widthClass) {
            options += `<option selected value="${clsName}">${i * 5}%</option>`;
          } else {
            options += `<option value="${clsName}">${i * 5}%</option>`;
          }
        }
        popoverDOM.innerHTML = `
          <button type="button" title="Align Left" data-media-action="align-left">Align Left</button>
          <button type="button" title="Align Center" data-media-action="align-center">Align Center</button>
          <button type="button" title="Align Right" data-media-action="align-right">Align Right</button>
          <button type="button" title="Inline" data-media-action="inline">Inline</button>
          <select data-media-action="width">${options}</select>
          <button type="button" title="Delete" data-media-action="delete">Delete</button>
        `;

        if (this.editor.querySelectorAll('.ozz-wyg-media-actions').length === 0) {
          mediaItem.insertAdjacentElement('afterend', popoverDOM);

          // Position popover element
          popoverDOM.style.top = `${e.clientY}px`;
          popoverDOM.style.left = `${e.clientX}px`;

          // Media Actions
          popoverDOM.querySelectorAll('button, select').forEach(actionTrigger => {
            if (actionTrigger.tagName === 'SELECT') {
              actionTrigger.addEventListener('change', () => {
                const action = actionTrigger.value;
                mediaItem.classList.remove(...Array.from(mediaItem.classList).filter(className => className.startsWith('w-')));
                if (action !== 'auto') {
                  mediaItem.classList.add(action);
                }
              });
            } else {
              actionTrigger.addEventListener('click', () => {
                const action = actionTrigger.getAttribute('data-media-action');
                if (action == 'align-left' || action == 'align-right' || action == 'align-center') {
                  mediaItem.classList.remove(...Array.from(mediaItem.classList).filter(className => className.startsWith('align-')));
                  mediaItem.classList.add(action);
                } else if (action == 'inline') {
                  mediaItem.classList.toggle(action);
                } else if (action == 'delete') {
                  mediaItem.remove();
                  popoverDOM.remove();
                }
              });
            }
          });
        }

        // Close popover
        const tempCloseEvent = (ev) => {
          if (!popoverDOM.contains(ev.target) && ev.target !== popoverDOM && ev.target !== mediaItem) {
            this.editor.querySelector('.ozz-wyg-media-actions')?.remove();
            document.removeEventListener('click', tempCloseEvent);
          }
        };
        document.addEventListener('click', tempCloseEvent);
      });
    });
  }

  /**
   * Is Youtube URL
   * @param {string} url
   * @return
   */
  isYouTubeURL(url) {
    return (
      url.includes('youtube.com/watch') ||
      url.includes('youtu.be') ||
      url.includes('youtube.com/embed')
    );
  }

  /**
   * Is Vimeo URL
   * @param {string} url
   * @returns
   */
  isVimeoURL(url) {
    return (
      url.includes('vimeo.com') ||
      url.includes('player.vimeo.com/video')
    );
  }

  /**
   * Get Embed code (Youtube)
   * @param {string} url
   * @returns 
   */
  getYouTubeEmbedCode(url) {
    const videoID = this.extractYouTubeVideoID(url);
    return `<div class="media-wrapper"><span class="height-holder"></span><iframe src="https://www.youtube.com/embed/${videoID}" frameborder="0" allowfullscreen></iframe></div>`;
  }

  /**
   * Extract Youtube video ID
   * @param {string} url 
   * @returns 
   */
  extractYouTubeVideoID(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  /**
   * Get Embed code (Vimeo)
   * @param {string} url 
   * @returns 
   */
  getVimeoEmbedCode(url) {
    const videoID = this.extractVimeoVideoID(url);
    return `<div class="media-wrapper"><span class="height-holder"></span><iframe src="https://player.vimeo.com/video/${videoID}" frameborder="0" allowfullscreen></iframe></div>`;
  }

  /**
   * Extract Vimeo video ID
   * @param {string} url 
   * @returns 
   */
  extractVimeoVideoID(url) {
    const regex = /vimeo\.com\/(?:video\/)?(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
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
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const quote = '<blockquote><p>' + (selectedText === '' ? '<br>' : selectedText) + 
      '</p><footer class="blockquote-footer">--Footer, <cite>cite</cite></footer></blockquote><br>';

    document.execCommand('insertHTML', false, quote);
  }

  /**
   * Add Code
   */
  codeText() {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (selectedText === '') {
      // If no selection, insert empty code tag
      document.execCommand('insertHTML', false, '<code></code>');
    } else {
      const code = '<code>' + selectedText + '</code>';
      document.execCommand('insertHTML', false, code);
    }
  }

  /**
   * Toggle Code and visual view
   */
  toggleCodeView() {
    if (this.isHTML()) {
      this.playGround.classList.remove('ozz-wyg-html-view');
      // Parse HTML from text content
      const htmlContent = this.playGround.textContent;
      this.playGround.innerHTML = htmlContent;
      this.tableActions(); // Init table Actions
      this.mediaPopover(); // Config Media Popover
    } else {
      this.playGround.querySelectorAll('[contenteditable="false"]').forEach(element => {
        element.remove();
      });
      this.playGround.classList.add('ozz-wyg-html-view');
      this.playGround.textContent = this.playGround.innerHTML;
    }
  }

  /**
   * Get value from editor
   * @param {string} editorID - Optional editor ID, if not provided returns first editor's value
   */
  getValue(editorID = null) {
    if (editorID && this.editorInstances.has(editorID)) {
      return this.editorInstances.get(editorID).playGround.innerHTML;
    }
    // Return first editor's value for backward compatibility
    if (this.editorInstances.size > 0) {
      const firstInstance = this.editorInstances.values().next().value;
      return firstInstance.playGround.innerHTML;
    }
    return this.playGround ? this.playGround.innerHTML : '';
  }

  /**
   * Get editor instance by editor ID
   * @param {string} editorID - Editor ID
   * @returns {Object|null} Editor instance or null
   */
  getEditorInstance(editorID) {
    return this.editorInstances.get(editorID) || null;
  }

  /**
   * Get all editor instances
   * @returns {Map} Map of all editor instances
   */
  getAllEditorInstances() {
    return this.editorInstances;
  }

  /**
   * Bind event to specific editor instance
   * @param {string} editorID - Editor ID
   * @param {string} eventName - Event name (without 'ozzwyg:' prefix)
   * @param {Function} callback - Event callback function
   */
  on(editorID, eventName, callback) {
    const instance = this.getEditorInstance(editorID);
    if (instance && instance.element) {
      instance.element.addEventListener(`ozzwyg:${eventName}`, callback);
    }
  }

  /**
   * Unbind event from specific editor instance
   * @param {string} editorID - Editor ID
   * @param {string} eventName - Event name (without 'ozzwyg:' prefix)
   * @param {Function} callback - Event callback function
   */
  off(editorID, eventName, callback) {
    const instance = this.getEditorInstance(editorID);
    if (instance && instance.element) {
      instance.element.removeEventListener(`ozzwyg:${eventName}`, callback);
    }
  }
}

/**
 * Static method to get OzzWyg instance from DOM element
 * @param {string|HTMLElement} selector - CSS selector or DOM element
 * @returns {OzzWyg|null} OzzWyg instance or null
 */
OzzWyg.getInstance = function(selector) {
  let element = null;
  if (typeof selector === 'string') {
    element = document.querySelector(selector);
  } else if (selector instanceof HTMLElement) {
    element = selector;
  }
  
  if (element) {
    // Check if element has data-editor attribute
    const editorID = element.getAttribute('data-editor');
    if (editorID && OzzWyg.instances.has(editorID)) {
      return OzzWyg.instances.get(editorID);
    }
    // Check if element itself is registered
    if (OzzWyg.instances.has(element)) {
      return OzzWyg.instances.get(element);
    }
  }
  return null;
};

/**
 * Static method to get value from editor by selector
 * @param {string|HTMLElement} selector - CSS selector or DOM element
 * @returns {string} Editor content or empty string
 */
OzzWyg.getValue = function(selector) {
  const instance = OzzWyg.getInstance(selector);
  if (instance) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    const editorID = element ? element.getAttribute('data-editor') : null;
    return instance.getValue(editorID);
  }
  return '';
};

/**
 * Static method to bind event to editor by selector
 * @param {string|HTMLElement} selector - CSS selector or DOM element
 * @param {string} eventName - Event name (without 'ozzwyg:' prefix)
 * @param {Function} callback - Event callback function
 */
OzzWyg.on = function(selector, eventName, callback) {
  const instance = OzzWyg.getInstance(selector);
  if (instance) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    const editorID = element ? element.getAttribute('data-editor') : null;
    if (editorID) {
      instance.on(editorID, eventName, callback);
    } else if (element) {
      // Fallback: bind directly to element
      element.addEventListener(`ozzwyg:${eventName}`, callback);
    }
  }
};

/**
 * Static method to unbind event from editor by selector
 * @param {string|HTMLElement} selector - CSS selector or DOM element
 * @param {string} eventName - Event name (without 'ozzwyg:' prefix)
 * @param {Function} callback - Event callback function
 */
OzzWyg.off = function(selector, eventName, callback) {
  const instance = OzzWyg.getInstance(selector);
  if (instance) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    const editorID = element ? element.getAttribute('data-editor') : null;
    if (editorID) {
      instance.off(editorID, eventName, callback);
    } else if (element) {
      // Fallback: unbind directly from element
      element.removeEventListener(`ozzwyg:${eventName}`, callback);
    }
  }
};

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