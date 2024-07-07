window.onload = document.getElementById("entries").focus();

document.forms[0].onsubmit = function() {
    var values = document.getElementById("entries").value.split(/[,;\s\n]+/);
    var nums = [];
    for (var i=0; i<values.length; i++) {
        nums[i] = Number(values[i]);
    }
    var target = document.getElementById("target").value;
    var desc = document.getElementById("description");
    var answer = document.getElementById("answer");

    // Values are passed as an array sorted least to greatest, to be used against a binary register (smaller values on left)
    var solved = initSolve(nums.sort(function(a,b){return a-b;}), Number(target));

    if (solved[0]) {
        if (solved[1]) {
            desc.innerHTML = "These sets of numbers each sum to " + target + ":";
        } else {
            desc.innerHTML = "This set of numbers sums to " + target + ":";
        }
        answer.innerHTML = solved.join(";<br>");
    } else {
        desc.innerHTML = "No solution";
        answer.innerHTML = "";
    }
    return false;
};

// Check if grand total <= target before trying subtotals
function initSolve(x,t) {
    var count = 0;
    for (var i=0; i< x.length; i++) {
        count += x[i];
    }
    if (count < t || t == 0) {
        return false;
    } else if (count == t) {
        return new Array(x.join(" + "));
    } else {
        return solve(x,t);
    }
}

// If grand total > target, try subtotals; return solutions as sorted array
function solve(x,t) {

    // Create binary register to correspond with values
    var bits = new Array(x.length);

    // Target bit starts at far-right (largest value) and tracks left-most bit (smallest value) as calculation progresses
    var firstBit = x.length-1;

    // Set all bits to 0, then set target bit to 1
    for (var i=0; i<x.length; i++) {
        bits[i] = 0;
    }
    bits[firstBit] = 1;

    // Create answer array and begin calculating
    var answers = [];
    var done = false;
    while (done == false) {

        // Try current set; increment; return new bit set, new target bit, and solution string [if applicable]
        var newSet = increment(x,t,bits,firstBit);
        bits = newSet[0];
        firstBit = newSet[1];
        var newAns = newSet[2];

        // Check for duplicate solutions
        if (newAns) {
            var duplicate = false;
            for (var j=0; j<answers.length; j++) {
                if (newAns == answers[j]) {
                    duplicate = true;
                }
            }
            if (!duplicate) {
                answers.push(newAns);
            }
        }

        // If a new bit set is not returned, all possible solutions have been found.
        if (!bits) {
            done = true;
        }
    }

    // Return solutions as sorted array
    return answers.sort();
}

// Try current set; increment; return new bit set, new target bit, and solution string [if applicable]
function increment(x,t,bits,first) {
    var report = [];

    // Test current set for solutions; return current total and solution string [if applicable]
    var result = trySet(x,t,bits);

    // Current total, returned by trySet
    var sum = result[0];

    // Report new bit set and new new target bit:

    if (sum < t && bits[0] == 0) {
        // If current total < target && there's an open left slot, add another value left of the target bit (to increase current total)
        bits[first-1] = 1;

        report = [bits, first-1];

    } else if (sum > t && bits[0] == 0) {
        // If current total > target && there's an open left slot, shift current bit left to a smaller value (to decrease current total)
        bits[first] = 0;
        bits[first-1] = 1;

        report = [bits,first-1];

    } else {
        // If current total == target || there's not an open left slot, shift right-most bit left and add a bit left of it

        report = shiftAndAdd(bits);
    }

    // Report solution string of current set [if applicable], returned by trySet
    report[2] = result[1];

    // Return new bit set, new target bit, and solution string [if applicable]
    return report;
}

// Shift right-most bit left and add a bit left of it; return new bit set and new new target bit.
function shiftAndAdd(bits) {

    // Starting with the 3rd slot, check each currently set bit for an open left slot. (Slots 1 and 2 don't need to be checked because they'll be set anyway.)
    for (var i=2; i<bits.length; i++) {
        if (bits[i] == 1 && bits[i-1] == 0) {

            // If a bit is found with an open left slot, clear bits up to 2 slots left of it
            for (var j=0; j<(i-2); j++) {
                bits[j] = 0;
            }
            // Shift current bit left to a smaller value
            bits[i] = 0;
            bits[i-1] = 1;
            // Add another value left of the current bit
            bits[i-2] = 1;

            // Return new bit set and new new target bit
            return [bits,i-2];
        }
    }
    // If there are no bits with open left slots (they're piled up on the left side of the register), there are no more solutions; return empty bit set
    return [];
}

// Test current set for solutions; return current total and solution string [if applicable]
function trySet(x,t,bits) {
    var count = 0;

    // Sum values corresponding to bits in register
    for (var i=0; i<bits.length; i++) {
        if (bits[i] == 1) {
            count += x[i];
        }
    }
    var result = [count];

    // If current total == target, collect values corresponding to bits in register
    if (count.toFixed(3) == t.toFixed(3)) {
        var answers = [];
        for (var j=0; j<bits.length; j++) {
            if (bits[j] == 1) {
                answers.push(x[j]);
            }
        }
        // Create solution string by joining collected values
        result[1] = answers.join(" + ");
    }

    // Return current total and solution string [if applicable]
    return result;
}
