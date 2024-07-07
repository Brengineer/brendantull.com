/**
 * Created by brendantull on 3/19/16.
 */

window.addEventListener('load', function() {
    var sim = new simulator;

    document.forms[0].onsubmit = function() {
        sim.run();
        return false;
    };
}, false);

var simulator = function() {
    var simScheme = this;

    var doors;
    var initialChoice;
    // var hostChoice;

    var keepers;
    var switchers;
    var keepWins;
    var switchWins;

    this.run = function () {
        var startTime = new Date;
        var iterations = Number(document.getElementById('iterations').value);
        doors = Number(document.getElementById('doors').value);

        keepers = 0;
        switchers = 0;
        keepWins = 0;
        switchWins = 0;

        var doorSet = [];
        for (var i=0; i<doors; i++) {
            doorSet.push(0);
        }
        var whichDoor = 0;

        for (var j=0; j<iterations; j++) {
            doorSet[whichDoor] = 0;
            doorSet[initialChoice] = 0;
            // doorSet[hostChoice] = 0;
            whichDoor = Math.floor(Math.random() * doors);
            doorSet[whichDoor] = 1;
            simScheme.choose(doorSet, whichDoor);
        }

        var endTime = new Date;

        document.getElementById('keeper').innerHTML = keepers;
        document.getElementById('switcher').innerHTML = switchers;
        document.getElementById('keep-win').innerHTML = keepWins;
        document.getElementById('switch-win').innerHTML = switchWins;
        document.getElementById('keep-percent').innerHTML = (keepWins / keepers) * 100;
        document.getElementById('switch-percent').innerHTML = (switchWins / switchers) * 100;
        document.getElementById('keeper-percent').innerHTML = (keepers / iterations) * 100;
        document.getElementById('switcher-percent').innerHTML = (switchers / iterations) * 100;
        console.log('Iterations: ' + iterations.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '; Time: ' + (endTime - startTime) / 1000 + 's');
    };

    this.choose = function (options, winningIndex) {
        initialChoice = Math.floor(Math.random() * doors);

        options[initialChoice] = 2;

        // var hostOptions = [];
        //
        // for (var i = 0; i < doors; i++) {
        //     if (options[i] == 0) {
        //         hostOptions.push(i);
        //     }
        // }
        //
        // hostChoice = hostOptions[Math.floor(Math.random() * hostOptions.length)];
        // options[hostChoice] = 3;

        simScheme.finalChoice(options, winningIndex);
    };

    this.finalChoice = function (options, winningIndex) {
        var choice = Math.floor(Math.random() * 2);

        if (choice == 0) {
            keepers++;
            if (options.indexOf(2) == winningIndex) {
                keepWins++;
            }
        } else {
            switchers++;
            if (options.indexOf(1) > -1) {
                switchWins++;
            }
        }
    };
};
