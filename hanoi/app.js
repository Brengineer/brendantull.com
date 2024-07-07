/**
 * Created by brendantull on 11/26/16.
 */

window.addEventListener('load', function() {
    app.initPanes();
}, false);

const app = {
    activePane: false,
    panelOverlay: false,

    initPanes: function () {
        let panelOverlay = document.createElement('DIV');

        panelOverlay.classList.add('overlay');
        document.getElementsByTagName('body')[0].appendChild(panelOverlay);
        panelOverlay.onclick = function() {
            app.togglePanel(app.activePane);
        };

        app.panelOverlay = panelOverlay;

        let panels = Array.from(document.getElementsByClassName('pane'));

        panels.forEach(function(elem) {
            let bClose = document.createElement('SPAN');
            bClose.classList.add('close');
            bClose.innerHTML = ('⊗');
            elem.appendChild(bClose);

            bClose.onclick = function() {
                app.togglePanel(app.activePane);
            };
            btnMessage.onclick = function() {
                app.togglePanel(app.activePane);
            };
        });
    },

    togglePanel: function (panel) {
        if (panel === app.activePane) {
            panel.classList.remove('show');
            app.panelOverlay.classList.remove('show');
            app.activePane = false;
        } else {
            panel.classList.add('show');
            app.panelOverlay.classList.add('show');
            app.activePane = panel;
        }
    },

    toggleVisible: function (subject, show) {
        if (show) {
            subject.classList.remove('hide');
        } else {
            subject.classList.add('hide');
        }
    },

    message: function (content) {
        pgfMessage.innerHTML = content;
        if (app.activePane) {
            app.togglePanel(app.activePane);
        }
        app.togglePanel(divMessage);
        btnMessage.focus();
    }
};
