export default function(editor, opt = {}) {
    const c = opt;
    let bm = editor.BlockManager;
    let pm = editor.Panels;
    let blocks = c.blocks;
    let stylePrefix = c.stylePrefix;
    const flexGrid = c.flexGrid;
    const basicStyle = c.addBasicStyle;
    const rowHeight = c.rowHeight;
    const clsRow = `${stylePrefix}row`;
    const clsCell = `${stylePrefix}cell`;
    const styleRow = flexGrid ?
        `
    .${clsRow} {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      padding: 10px;
    }
    @media (max-width: 768px) {
      .${clsRow} {
        flex-wrap: wrap;
      }
    }` :
        `
    .${clsRow} {
      display: table;
      padding: 10px;
      width: 100%;
    }
    @media (max-width: 768px) {
      .${stylePrefix}cell, .${stylePrefix}cell30, .${stylePrefix}cell70 {
        width: 100%;
        display: block;
      }
    }`;
    const styleClm = flexGrid ?
        `
    .${clsCell} {
      min-height: ${rowHeight}px;
      flex-grow: 1;
      flex-basis: 100%;
    }` :
        `
    .${clsCell} {
      width: 8%;
      display: table-cell;
      height: ${rowHeight}px;
    }`;
    const styleClm30 = `
    .${stylePrefix}cell30 {
      width: 30%;
    }`;
    const styleClm70 = `
    .${stylePrefix}cell70 {
      width: 70%;
    }`;
    const styleHeader1 = `
  .${stylePrefix}header1 {
    font-size: 2em;
    text-align: center;
    font-weight: bold;
  }`

    const step = 0.2;
    const minDim = 1;
    const currentUnit = 1;
    const resizerBtm = {
        tl: 0,
        tc: 0,
        tr: 0,
        cl: 0,
        cr: 0,
        bl: 0,
        br: 0,
        minDim
    };
    const resizerRight = {
        ...resizerBtm,
        cr: 1,
        bc: 0,
        currentUnit,
        minDim,
        step
    };

    // Flex elements do not react on width style change therefore I use
    // 'flex-basis' as keyWidth for the resizer on columns
    if (flexGrid) {
        resizerRight.keyWidth = 'flex-basis';
    }

    const rowAttr = {
        class: clsRow,
        'data-gjs-droppable': `.${clsCell}`,
        'data-gjs-resizable': resizerBtm,
        'data-gjs-name': 'Row'
    };

    const colAttr = {
        class: clsCell,
        'data-gjs-draggable': `.${clsRow}`,
        'data-gjs-droppable': `.header1, .header2, .header3, .text, .image, .video, .button`,
        'data-gjs-resizable': resizerRight,
        'data-gjs-name': 'Cell'
    };

    if (flexGrid) {
        colAttr['data-gjs-unstylable'] = ['width'];
        colAttr['data-gjs-stylable-require'] = ['flex-basis'];
    }

    // Make row and column classes private
    const privateCls = [`.${clsRow}`, `.${clsCell}`];
    editor.on(
        'selector:add',
        selector =>
        privateCls.indexOf(selector.getFullName()) >= 0 &&
        selector.set('private', 1)
    );

    editor.on('load', () => {
        editor.Panels.getButton('views', 'open-blocks').set('active', 1);
    })

    const attrsToString = attrs => {
            const result = [];

            for (let key in attrs) {
                let value = attrs[key];
                const toParse = value instanceof Array || value instanceof Object;
                value = toParse ? JSON.stringify(value) : value;
                result.push(`${key}=${toParse ? `'${value}'` : `'${value}'`}`);
    }

    return result.length ? ` ${result.join(' ')}` : '';
  };

  pm.addButton('options', [{
      id: 'undo',
      className: 'fa fa-undo icon-undo',
      command: function(editor, sender) {
          sender.set('active', 0);
          editor.UndoManager.undo(1);
      },
      attributes: {
          title: 'Undo (CTRL/CMD + Z)'
      }
  }, {
      id: 'redo',
      className: 'fa fa-repeat icon-redo',
      command: function(editor, sender) {
          sender.set('active', 0);
          editor.UndoManager.redo(1);
      },
      attributes: {
          title: 'Redo (CTRL/CMD + SHIFT + Z)'
      }
  }, {
      id: 'clean-all',
      className: 'fa fa-trash icon-blank',
      command: function(editor, sender) {
          if (sender) sender.set('active', false);
          if (confirm('Are you sure to clean the canvas?')) {
              editor.DomComponents.clear();
              setTimeout(function() {
                  localStorage.clear();
              }, 0);
          }
      },
      attributes: {
          title: 'Empty canvas'
      }
  }]);
  pm.removeButton('options', 'preview');

  const toAdd = name => blocks.indexOf(name) >= 0;
  const attrsRow = attrsToString(rowAttr);
  const attrsCell = attrsToString(colAttr);

  toAdd('column1') &&
    bm.add('column1', {
      label: c.labelColumn1,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column2') &&
    bm.add('column2', {
      label: c.labelColumn2,
      attributes: { class: 'gjs-fonts gjs-f-b2' },
      category: c.category,
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column3') &&
    bm.add('column3', {
      label: c.labelColumn3,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-b3' },
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column3-7') &&
    bm.add('column3-7', {
      label: c.labelColumn37,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-b37' },
      content: `<div ${attrsRow}>
        <div ${attrsCell} style='${
        flexGrid ? 'flex-basis' : 'width'
      }: 30%;'></div>
        <div ${attrsCell} style='${
        flexGrid ? 'flex-basis' : 'width'
      }: 70%;'></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
          ${styleClm30}
          ${styleClm70}
        </style>`
          : ''
      }`
    });

    toAdd('column7-3') &&
    bm.add('column7-3', {
      label: c.labelColumn73,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-b37' },
      content: `<div ${attrsRow}>
        <div ${attrsCell} style='${
        flexGrid ? 'flex-basis' : 'width'
      }: 70%;'></div>
        <div ${attrsCell} style='${
        flexGrid ? 'flex-basis' : 'width'
      }: 30%;'></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
          ${styleClm30}
          ${styleClm70}
        </style>`
          : ''
      }`
    });

  toAdd('header1') &&
    bm.add('header1', {
      label: c.labelHeader1,
      category: c.category,
      attributes: { class: 'fa fa-header' },
      content: {
        type: 'header1',
        classes: [`header1`],
        components: `Header 1`,
        style: {'font-size': '2em', 'text-align': 'center', 'font-weight': 'bold', 'padding': '10px'},
        activeOnRender: 1
      },
    });

    toAdd('header2') &&
    bm.add('header2', {
      label: c.labelHeader2,
      category: c.category,
      attributes: { class: 'fa fa-header' },
      content: {
        type: 'header2',
        classes: ['header2'],
        content: 'Header 2',
        style: {'font-size': '1.5em', 'text-align': 'center', 'font-weight': 'bold', 'padding': '10px'},
        activeOnRender: 1
      }
    });

    toAdd('header3') &&
    bm.add('header3', {
      label: c.labelHeader3,
      category: c.category,
      attributes: { class: 'fa fa-header' },
      content: {
        type: 'header3',
        classes: ['header3'],
        content: 'Header 3',
        style:  {'font-size': '1.17em', 'text-align': 'center', 'font-weight': 'bold', 'padding': '10px'},
        activeOnRender: 1
      }
    });

    toAdd('text') &&
    bm.add('text', {
      label: c.labelText,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-text' },
      content: {
        type: 'text',
        classes: ['text'],
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. It becomes a great Proin eget rutrum enim, eu 
                  semper augue semper. Gluten. Cras id dui lectus. Sit amet, but by their ends of the bed, sit amet suscipit nibh. 
                  Sed quis urna commodo purus. But that requires no medication. No bananas soft jaws.`,
        style: { padding: '10px' },
        activeOnRender: 1
      }
    });

  // toAdd('link') &&
  //   bm.add('link', {
  //     label: c.labelLink,
  //     category: c.category,
  //     attributes: { class: 'fa fa-link' },
  //     content: {
  //       type: 'link',
  //       content: 'Link',
  //       style: { color: '#d983a6' }
  //     }
  //   });

  toAdd('image') &&
    bm.add('image', {
      label: c.labelImage,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-image' },
      content: {
        style: { color: 'black' },
        type: 'image',
        classes: ['image'],
        style: { 'width': '300px', 'height': '300px' },
        activeOnRender: 1
      }
    });

  toAdd('video') &&
    bm.add('video', {
      label: c.labelVideo,
      category: c.category,
      attributes: { class: 'fa fa-youtube-play' },
      content: {
        type: 'video',
        classes: ['video'],
        src: 'https://www.youtube.com/embed/qgcX0y1Nzhs',
        style: {
          'height': '350px',
          'width': '615px'
        }
      }
    });

  toAdd('button') &&
    bm.add('button', {
      label: c.labelButton,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-button' },
      content: {
        type: 'button',
        classes: ['button'],
        content: `<div style="display:flex; justify-content: center;"><button style="width: 70px; height: 30px;">Button</button></div>`,
      }
    });
}