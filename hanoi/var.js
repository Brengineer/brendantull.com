// Default options
let options = {
    quantity: 6,
    color: 0,
    // animation: 0,
    keys: 0,
    clock: 1,
    count: 1
};


// Top controls
const btnRestart = document.getElementById('restart-button');
const btnUndo = document.getElementById('undo-button');
const btnRedo = document.getElementById('redo-button');
const btnOptions = document.getElementById('options-button');


// Footer controls
const btnSave = document.getElementById('save-button');
const btnHelp = document.getElementById('help-button');


// Panes
const divOptions = document.getElementById('options-div');
const divHelp = document.getElementById('help-div');
const divMessage = document.getElementById('message-div');
const pgfMessage = document.getElementById('message-pgf');
const btnMessage = document.getElementById('message-button');


// Option controls
const btnQuantDn = document.getElementById('quantity-button-down');
const btnQuantUp = document.getElementById('quantity-button-up');
const numQuant = document.getElementById('quantity-num');
const spnQuant = document.getElementById('quantity-span');

const btnsColors = [
    document.getElementById('cb0'),
    document.getElementById('cb1'),
    document.getElementById('cb2')
];

// var sltAnim = document.getElementById('animation-select');

const sltKeys = document.getElementById('keys-select');
const keySets = [
    ['ArrowLeft', 'ArrowDown', 'ArrowRight'],
    ['z', 'x', 'c'],
    ['1', '2', '3']
];

const chkClock = document.getElementById('clock-checkbox');
const chkCount = document.getElementById('count-checkbox');

const btnDone = document.getElementById('done-button');


// Stats
const pgfClock = document.getElementById('clock-pgf');
const pgfCount = document.getElementById('count-pgf');

const spnClock = document.getElementById('clock-span');
const spnCount = document.getElementById('count-span');
const spnTarg = document.getElementById('target-span');


// Game elements
const posts = Array.from(document.getElementsByClassName('post'));
const disks = document.getElementsByClassName('disk');
