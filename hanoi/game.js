/**
 * Created by brendantull on 3/19/16.
 */

const game = {
    currDisk: false,
    droppable: false,
    moves: localStorage.moves && localStorage.moves.length ? localStorage.moves.split(';') : [],
    undos: localStorage.undos && localStorage.undos.length ? localStorage.undos.split(';') : [],
    clock: {},

    inputDown: function (e, post) {
        e.preventDefault();
        if (game.currDisk.classList.contains('selected')) {
            if (game.currDisk.parentNode === post) {
                game.droppable = true;
            } else {
                game.dropDisk(post);
                game.droppable = false;
            }
        } else if (post.children.length) {
            game.grabDisk(post);
        }
    },

    inputUp: function (e, post) {
        e.preventDefault();
        if (game.currDisk.classList.contains('selected')) {
            if (game.currDisk.parentNode === post) {
                if (game.droppable) {
                    game.currDisk.classList.remove('selected');
                    game.droppable = false;
                }
            } else {
                game.dropDisk(post);
                game.droppable = false;
            }
        }
    },

    grabDisk: function (post) {
        game.currDisk.classList.remove('confirmed', 'cancelled');
        game.currDisk = post.children[0];
        // game.currDisk.style.top = slot.offsetTop + game.currDisk.offsetTop + 'px';
        // game.currDisk.style.left = slot.offsetLeft + game.currDisk.offsetLeft + 'px';
        // game.currDisk.classList.add('follow');
        game.currDisk.classList.add('selected');

        if (!game.moves.length && options.clock === 1) {
            game.startClock();
        }
    },

    dropDisk: function (post) {
        let topDisk = post.children[0];
        let prevPost = game.currDisk.parentNode;
        if (topDisk && game.currDisk.getAttribute('data-index') > topDisk.getAttribute('data-index')) {
            game.currDisk.classList.remove('selected');
            game.currDisk.classList.add('cancelled');
        } else {
            // let prevY = slot.offsetTop + game.currDisk.offsetTop;
            // let prevX = prevSlot.offsetLeft + game.currDisk.offsetLeft;
            prevPost.removeChild(game.currDisk);
            // game.currDisk.style.left = prevX - (slot.offsetLeft + slot.clientWidth / 2 - game.currDisk.clientWidth / 2) + 'px';
            if (topDisk) {
                // game.currDisk.style.top = prevY - (slot.offsetTop + topDisk.offsetTop - game.currDisk.clientHeight) + 'px';
                post.insertBefore(game.currDisk, topDisk);
            } else {
                // game.currDisk.style.top = prevY - (slot.offsetTop + slot.clientHeight - game.currDisk.clientHeight) + 'px';
                post.appendChild(game.currDisk);
            }
            game.moves.push(game.currDisk.id + ',' + prevPost.id + ',' + post.id);
            game.currDisk.classList.remove('selected');
            game.currDisk.classList.add('confirmed');
            // setTimeout(function () {
                // game.currDisk.style.top = '0';
                // game.currDisk.style.left = '0';
            // }, 200);
            spnCount.innerHTML++;
            if (Number(spnCount.innerHTML) > Number(spnTarg.innerHTML)) {
                spnCount.classList.add('above');
            }
        }
        game.checkWin();
    },

    startClock: function () {
        let clockHr = 0;
        let clockMn = 0;
        let clockSc = 0;
        let clockHd = 0;
        let pad = function (val) {
            return ('00' + val).slice(-2);
        };
        game.clock = window.setInterval(function () {
            clockHd ++;
            if (clockHd === 100) {
                clockHd = 0;
                clockSc ++;
                if (clockSc === 60) {
                    clockSc = 0;
                    clockMn ++;
                    if (clockMn === 60) {
                        clockMn = 0;
                        clockHr ++;
                    }
                }
            }
            let time = pad(clockSc) + ':' + pad(clockHd);
            if (clockMn !== 0) {
                time = pad(clockMn) + ':' + time;
            }
            if (clockHr !== 0) {
                time = pad(clockHr) + ':' + time;
            }
            spnClock.innerHTML = time;
        }, 10);
    },

    stopClock: function () {
        if (game.clock !== {}) {
            window.clearInterval(game.clock);
        }
    },

    resetClock: function () {
        game.stopClock();
        spnClock.innerHTML = "00:00";
    },

    undo: function () {
        if (game.moves.length) {
            game.currDisk.classList.remove('selected', 'confirmed', 'cancelled');
            let move = game.moves.pop();
            game.undos.push(move);
            move = move.split(',');
            let disk = document.getElementById(move[0]);
            let prevPost = document.getElementById(move[1]);
            let post = document.getElementById(move[2]);
            post.removeChild(disk);
            prevPost.prepend(disk);
            spnCount.innerHTML--;

            if (!game.moves.length) {
                game.undos = [];
                game.resetClock();
            }
        }
    },

    redo: function () {
        if (game.undos.length) {
            let move = game.undos.pop();
            game.moves.push(move);
            move = move.split(',');
            let disk = document.getElementById(move[0]);
            let prevPost = document.getElementById(move[1]);
            let post = document.getElementById(move[2]);
            prevPost.removeChild(disk);
            post.prepend(disk);
            spnCount.innerHTML++;
        }
    },

    checkWin: function () {
        if (posts[2].children.length === disks.length || posts[1].children.length === disks.length) {
            game.stopClock();
            game.currDisk.classList.remove('confirmed');

            let message = 'Excellent! You\'ve solved the puzzle with minimum moves!';

            if (disks.length === 1) {
                message = 'Surely you can do more than 1!';
            } else if (disks.length === 2) {
                message = 'Good, but I bet you can do more than 2.';
            } else if (!options.count) {
                message = 'Good job, You\'ve solved the puzzle.';
            } else if (spnCount.innerHTML !== spnTarg.innerHTML) {
                message = 'Good job, You\'ve solved the puzzle. Now try to do it with minimum moves!';
            }

            app.message(message);
        }
    }
};
