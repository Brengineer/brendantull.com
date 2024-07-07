/**
 * Created by brendantull on 3/19/16.
 */

window.addEventListener('load', function() {
    setup.initAll();
}, false);

window.addEventListener('unload', function() {
    setup.save(false);
}, false);

const setup = {
    diskIndex: {},

    initAll: function () {
        // Load saved options
        if (localStorage.options) {
            options = JSON.parse(localStorage.options);
        }

        // Load saved game
        if (localStorage.game) {
            setup.diskIndex = JSON.parse(localStorage.game);
        }

        // Set default options
        numQuant.value = options.quantity;

        btnsColors[options.color].classList.add('active');

        // sltAnim.value = options.animation;

        sltKeys.value = options.keys;

        if (options.clock) {
            chkClock.checked = true;
        } else {
            pgfClock.classList.add('hide');
        }

        if (options.count) {
            chkCount.checked = true;
        } else {
            pgfCount.classList.add('hide');
        }

        // Activate top controls
        btnRestart.onclick = function () {
            setup.reset();
        };
        btnUndo.onclick = function () {
            game.undo();
        };
        btnRedo.onclick = function () {
            game.redo();
        };
        btnOptions.onclick = function () {
            app.togglePanel(divOptions);
            btnDone.focus();
        };

        // Activate footer controls
        btnSave.onclick = function () {
            setup.save();
        };
        btnHelp.onclick = function() {
            app.togglePanel(divHelp);
        };

        setup.setGame();

        setup.initOptionControls();
    },

    initOptionControls: function() {
        btnQuantDn.onclick = function () {
            setup.checkVal(Number(numQuant.value) - 1);
        };
        btnQuantUp.onclick = function () {
            setup.checkVal(Number(numQuant.value) + 1);
        };

        numQuant.onchange = function () {
            setup.checkVal(Number(numQuant.value));
        };
        numQuant.onblur = function () {
            if (!spnQuant.classList.contains('hide')) {
                numQuant.value = disks.length;
                spnQuant.classList.add('hide');
            }
        };

        // ToDo: Use radio buttons instead
        btnsColors.forEach(function (elem, ind, thisArray) {
            elem.onclick = function () {
                if (!this.classList.contains('active')) {
                    this.classList.add('active');
                    thisArray[options.color].classList.remove('active');
                    options.color = Number(this.id.charAt(2));
                    setup.setColor();
                }
                return false;
            };
        });

        // sltAnim.onchange = function() {
        //     options.animation = Number(sltAnim.value);
        // };
        sltKeys.onchange = function() {
            options.keys = Number(sltKeys.value);
            sltKeys.blur();
        };

        chkClock.onchange = function () {
            options.clock = Number(chkClock.checked);
            app.toggleVisible(pgfClock, options.clock);
        };
        chkCount.onchange = function () {
            options.count = Number(chkCount.checked);
            app.toggleVisible(pgfCount, options.count);
        };

        btnDone.onclick = function () {
            app.togglePanel(divOptions);
        };
    },

    checkVal: function (quantity) {
        if (quantity < 1 || quantity > 100) {
            spnQuant.classList.remove('hide');
            return false;
        } else {
            spnQuant.classList.add('hide');
            options.quantity = quantity;
            numQuant.value = options.quantity;
            setup.reset();
        }
    },

    reset: function () {
        game.resetClock();

        posts.forEach(function(elem) {
            elem.innerHTML = '';
        });

        game.moves = [];
        game.undos = [];
        setup.diskIndex = {};
        localStorage.count = '0';

        setup.setGame();
    },

    setGame: function() {
        let initWidth = 2.7, // em
            increment;

        if (options.quantity > 10) {
            document.getElementById('game-wrapper').style.height = options.quantity + 2.4 + 'em';
            document.getElementById('post-wrapper').style.height = options.quantity + 1 + 'em';
            increment = (9.6 - initWidth) / (options.quantity - 1);
        } else {
            document.getElementById('game-wrapper').style.height = null;
            document.getElementById('post-wrapper').style.height = null;
            increment = (9.6 - initWidth) / 9;
        }

        for (let i=0; i<options.quantity; i++) {
            let newDisk = document.createElement('DIV');
            newDisk.classList.add('disk');
            newDisk.id = 'd' + i;
            newDisk.setAttribute('data-index', i.toString());
            newDisk.style.width = initWidth + i*increment + 'em';
            if (setup.diskIndex['d0']) {
                posts[setup.diskIndex[newDisk.id]].appendChild(newDisk);
            } else {
                posts[0].appendChild(newDisk);
            }
        }
        game.currDisk = document.getElementsByClassName('disk')[0];

        let target = (2 ** options.quantity - 1).toString();
        if (target.indexOf('e') === -1) {
            target = target.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            let baseNum = target.match(/^\d+.\d+/);
            target = target.replace(baseNum[0], Number(baseNum).toFixed(3).toString());
        }
        spnTarg.innerHTML = target;
        spnCount.innerHTML = localStorage.count ? localStorage.count : '0';
        spnCount.classList.remove('above');
        setup.setColor();
    },

    setColor: function() {
        if (options.color === 2) {
            Array.from(disks).forEach(function(elem, ind, thisArray) {
                elem.classList.remove('even', 'odd');
                let key = Number(elem.getAttribute('data-index'));
                elem.style.backgroundColor = 'hsl(' + key * (360 / thisArray.length) + ', 100%, 50%)';
            });
        } else if (options.color === 1) {
            Array.from(disks).forEach(function(elem) {
                elem.style.backgroundColor = null;
                let key = Number(elem.getAttribute('data-index'));
                if ((key + 1) % 2 === 0) {
                    elem.classList.add('even');
                } else {
                    elem.classList.add('odd');
                }
            });
        } else {
            Array.from(disks).forEach(function(elem) {
                elem.style.backgroundColor = null;
                elem.classList.remove('even', 'odd');
            });
        }
    },

    save: function (showMsg = true) {
        localStorage.options = JSON.stringify(options);

        if (disks[0].parentElement.childElementCount !== disks.length) {
            let gameData = {};
            Array.from(disks).forEach(function(elem) {
                let disk = elem;
                gameData[disk.id] = disk.parentElement.getAttribute('data-index');
            });
            localStorage.game = JSON.stringify(gameData);
            localStorage.count = game.moves.length;
            localStorage.moves = game.moves.join(';');
            localStorage.undos = game.undos.join(';');
        } else {
            localStorage.game = '';
            localStorage.count = '';
            localStorage.moves = '';
            localStorage.undos = '';
        }

        if (showMsg) {
            app.message('Game saved');
        }
    }
};
