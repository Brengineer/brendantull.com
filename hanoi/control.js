/**
 * Created by brendantull on 3/19/16.
 */

window.addEventListener('load', function() {
    control.init();
}, false);

const control = {
    init: function() {
        window.onkeydown = function(e) {
            control.keyCapture(e);
        };

        document.getElementById('game-wrapper').addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);

        posts.forEach(function (elem) {
            elem.onmousedown = function (e) {
                game.inputDown(e, this);
                this.classList.remove('hovered');
            };
            elem.onmouseup = function (e) {
                game.inputUp(e, this);
                this.classList.remove('hovered');
            };
            elem.onmouseenter = function () {
                this.classList.add('hovered');
            };
            elem.onmouseleave = function () {
                this.classList.remove('hovered');
            };

            elem.addEventListener('touchstart', function (e) {
                game.inputDown(e, this);
            }, false);
            elem.addEventListener('touchmove', function (e) {
                let highlight = document.getElementsByClassName('hovered')[0];
                let hoverPost = control.getTouchedPost(e);
                if (highlight && highlight !== hoverPost) {
                    highlight.classList.remove('hovered');
                }
                let selected = document.getElementsByClassName('selected')[0];
                if (hoverPost && (hoverPost !== this && selected || hoverPost === this && !selected)) {
                    hoverPost.classList.add('hovered');
                }
            }, false);
            elem.addEventListener('touchend', function (e) {
                let hoverPost = control.getTouchedPost(e);
                if (hoverPost) {
                    game.inputUp(e, hoverPost);
                    hoverPost.classList.remove('hovered');
                }
            }, false);
        });
    },

    getTouchedPost: function (e) {
        let touchedElem = undefined;
        // let diffY = e.changedTouches[0].clientY - slots[0].offsetTop;
        // if (diffY > 0 && diffY < slots[0].clientHeight) {
            posts.forEach(function (elem) {
                let diffX = e.changedTouches[0].clientX - elem.offsetLeft;
                if (diffX > 0 && diffX < elem.clientWidth) {
                    touchedElem = elem;
                }
            });
        // }
        return touchedElem;
    },

    keyCapture: function(e) {
        if (e.metaKey || e.ctrlKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    app.togglePanel(divOptions);
                    numQuant.select();
                    break;
                case 'r':
                    e.preventDefault();
                    setup.reset();
                    break;
                case 's':
                    e.preventDefault();
                    setup.save();
                    break;
                case 'y':
                    e.preventDefault();
                    game.redo();
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        game.redo();
                    } else {
                        game.undo();
                    }
                    break;
                case ',':
                    e.preventDefault();
                    app.togglePanel(divOptions);
                    btnDone.focus();
                    break;
                default:
                    return false;
            }
        } else if (document.activeElement !== numQuant) {
            switch (e.key) {
                case keySets[options.keys][0]: // Left pole
                    game.inputDown(e, posts[0]);
                    break;
                case keySets[options.keys][1]: // Center pole
                    game.inputDown(e, posts[1]);
                    break;
                case keySets[options.keys][2]: // Right pole
                    game.inputDown(e, posts[2]);
                    break;
                case 'Escape':
                    if (app.activePane) {
                        app.togglePanel(app.activePane);
                    }
                    break;
                case '=': // Plus
                    e.preventDefault();
                    setup.checkVal(Number(numQuant.value) + 1);
                    break;
                case '-': // Minus
                    e.preventDefault();
                    setup.checkVal(Number(numQuant.value) - 1);
                    break;
                default:
                    // console.log(e.keyCode);
                    return false;
            }
        }
    }
};
