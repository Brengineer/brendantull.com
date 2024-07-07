window.addEventListener('load', initAll, false);

function initAll () {
    var eyes = Array.from(document.getElementsByClassName('eye'));
    var pupils = Array.from(document.getElementsByClassName('pupil'));
    var eyeRadius = eyes[0].offsetWidth / 2;
    var pupilRadius = pupils[0].offsetWidth / 2;
    var maxOffset = eyeRadius - pupilRadius;

    var blinkDelay = 6000;
    var blinking = setInterval(blink, blinkDelay);

    document.addEventListener('mousemove', function (e) {
        setLook(e.pageX, e.pageY);
    }, false);
    document.addEventListener('mouseout', function (e) {
        if (!e.toElement) {
            setLook(0, 0, true);
        }
    }, false);

    document.addEventListener('touchstart', function (e) {
        touchHandler(e);
    }, false);
    document.addEventListener('touchmove', function (e) {
        touchHandler(e);
    }, false);
    document.addEventListener('touchend', function (e) {
        touchHandler(e);
    }, false);

    function touchHandler(e) {
        e.preventDefault();

        var touches = e.touches;

        if (touches.length == 0) {
            setLook(0, 0, true);
        } else if (touches.length == 1) {
            setLook(touches[0].pageX, touches[0].pageY);
        } else if (touches.length == 2) {
            clearInterval(blinking);
            setPupil(pupils[0], touches[0].pageX, touches[0].pageY);
            setPupil(pupils[1], touches[1].pageX, touches[1].pageY);
        }
        return false;
    }

    function setLook(xPoint, yPoint, reset) {
        if (reset) {
            pupils.forEach(function (elem, ind) {
                elem.style.left = "0";
                elem.style.top = "0";
                eyes[ind].classList.remove('closed');
            });
            blinking = setInterval(blink, blinkDelay);
        } else {
            clearInterval(blinking);
            pupils.forEach(function (elem) {
                setPupil(elem, xPoint, yPoint);
            });
        }
    }

    function setPupil (pupil, xPoint, yPoint) {
        var xLeg = xPoint - (pupil.parentElement.offsetLeft + eyeRadius);
        var yLeg = yPoint - (pupil.parentElement.offsetTop + eyeRadius);
        var hyp = Math.sqrt(Math.pow(xLeg, 2) + Math.pow(yLeg, 2));
        if (hyp <= eyeRadius) {
        // if (hyp <= maxOffset) {
            // xPupil = xLeg;
            // yPupil = yLeg;
            pupil.parentElement.classList.add('closed');
        } else {
            pupil.parentElement.classList.remove('closed');
            var ratio = hyp / maxOffset;
            var xPupil = (xLeg / ratio).toFixed(1);
            var yPupil = (yLeg / ratio).toFixed(1);
            pupil.style.left = xPupil + "px";
            pupil.style.top = yPupil + "px";
        }
    }

    function blink () {
        eyes.forEach(function (elem) {
            elem.classList.add('closed');

            setTimeout(function () {
                elem.classList.remove('closed');
            }, 60);
        });
    }
}
