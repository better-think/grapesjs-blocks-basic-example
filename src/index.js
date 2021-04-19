import grapesjs from 'grapesjs';

export default grapesjs.plugins.add('gjs-blocks-basic', (editor, opts = {}) => {
    const config = {
        blocks: [
            'column1',
            'column2',
            'column3',
            'column3-7',
            'column7-3',
            'header1',
            'header2',
            'header3',
            'text',
            'link',
            'image',
            'video',
            'map',
            'button'
        ],
        flexGrid: 0,
        stylePrefix: 'gjs-',
        addBasicStyle: true,
        category: 'Basic',
        labelColumn1: 'Section',
        labelColumn2: '2 Sections',
        labelColumn3: '3 Sections',
        labelColumn37: '1/2 Sections',
        labelColumn73: '2/1 Sections',
        labelHeader1: 'Header 1',
        labelHeader2: 'Header 2',
        labelHeader3: 'Header 3',
        labelText: 'Text',
        labelLink: 'Link',
        labelImage: 'Image',
        labelVideo: 'Video',
        labelMap: 'Map',
        labelButton: 'Button',
        rowHeight: 75,
        ...opts
    };

    // Add blocks
    const loadBlocks = require('./blocks');
    loadBlocks.default(editor, config);
});