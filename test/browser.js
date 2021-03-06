const { JSDOM } = require('jsdom');

const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
enzyme.configure({ adapter: new Adapter() });

const exposedProperties = ['window', 'navigator', 'document'];

global.window = (new JSDOM('')).window;
global.document = window.document;

Object.keys(window).forEach(property => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = window[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};

global.localStorage = {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null
};

global.HTMLElement = global.window.HTMLElement;

