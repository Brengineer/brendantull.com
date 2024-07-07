window.addEventListener("load", () => {
    eventTracker.initAll();
},false);

eventTracker = {
    initAll: function() {
        let buttonReset = document.getElementById('reset-button');
        let table = document.getElementById('list');
        let formAdd = document.getElementById('add-form');
        let selectType = document.getElementById('type-select');
        let labelName1 = document.getElementById('name1-label');
        let inputName1 = document.getElementById('name1-text');
        let pgfName1 = document.getElementById('name1-pgf');
        let sectionName2 = document.getElementById('name2-section');
        let inputName2 = document.getElementById('name2-text');
        let pgfName2 = document.getElementById('name2-pgf');
        let inputDate = document.getElementById('date-text');
        let pgfDate = document.getElementById('date-pgf');
        let pgfConfirm = document.getElementById('confirm-pgf');
        let buttonAdd = document.getElementById('add-button');
        let buttonShowForm = document.getElementById('show-form');
        let buttonHideForm = document.getElementById('hide-form');

        // Translate old data
        if (localStorage.list && typeof(JSON.parse(localStorage.list)[0]) === 'string') {
            let newList = [];

            JSON.parse(localStorage.list).forEach((item) => {
                item = item.split(';');

                if (!item[2]) {
                    item.push('EX');
                }

                let newItem = {
                    type: item[2],
                    date: item[0],
                    name: item[1],
                }

                newList.push(newItem);
            });

            localStorage.list = JSON.stringify(newList);
        }

        let workingList = JSON.parse(localStorage.list || defaultList);
        
        buttonReset.onclick = reset;
        buttonAdd.onclick = e => {
            e.preventDefault();
            validateAdd();
        };
        buttonShowForm.onclick = showForm;
        buttonHideForm.onclick = hideForm;
        selectType.onchange = adjustForm;

        initFill(new Date);

        function initFill(today) {
            let expandedList = [];

            table.innerHTML = '';
            workingList.forEach( (event, index) => {
                const currentEvent = [
                    getDateStr(event),
                    getEventStr(event, today),
                    getDaysTill(event, today),
                    index
                ];
                expandedList.push(currentEvent);
            });
            expandedList.sort(function (a, b) {
                return a[2] - b[2]
            });
            fillTable(expandedList);
            setBackground();
        }

// ------------ GET DATA STRINGS ------------------------------------------------------------------------

        function getDateStr(event) {
            const date = new Date(event.date);
            const monthName = date.toDateString().substring(4,7);
            // Date is stringified to get pretty-print month name (e.g. "Jan" instead of "0")

            return monthName + ' ' + date.getDate().toString().padStart(2, '0');
        }

        function getEventStr(event, today) {
            let which;

            switch (event.type) {
                case 'BD':
                    which = getWhich(new Date(event.date), today);
                    return event.name + ': <span>' + which + ' BD</span>';
                case 'AN':
                    which = getWhich(new Date(event.date), today);
                    return event.name + ': <span>' + which + ' anv.</span>';
                default:
                    return event.name;
            }
        }

        function getWhich(eventDate, date) {
            let which = date.getFullYear() - eventDate.getFullYear();

            if (date.getMonth() > eventDate.getMonth()) {
                which++;
            } else if (date.getMonth() === eventDate.getMonth() && date.getDate() > eventDate.getDate()) {
                which++;
            }

            let val = which.toString();

            let key = val.slice(-2);

            if (key === '11' || key === '12' || key === '13') {
                val += 'th';
            } else {
                key = val.slice(-1);

                if (key === '1') {
                    val += 'st';
                } else if (key === '2') {
                    val += 'nd';
                } else if (key === '3') {
                    val += 'rd';
                } else {
                    val += 'th';
                }
            }

            return val;
        }

        function getDaysTill(event, today) {
            const fullDate = new Date(today.getFullYear() + '/' + event.date.substr(5, 5));
            let daysTill = Math.ceil((fullDate.getTime() - today.getTime()) / 86400000); // 86,400,000 ms per day

            if (daysTill < 0) {
                daysTill += 365;
            }

            return daysTill;
        }

// ------------ FILL TABLE ------------------------------------------------------------------------

        function fillTable(expandedList) {
            expandedList.forEach( (item) => {
                const index = item.pop(); // Remove last item before looping, since it will be handled separately

                let row = document.createElement('tr');
                row.setAttribute('data-index', index);

                if (item[2] < 30) {
                    row.classList.add('soon');
                }
                if (item[2] < 8) {
                    row.classList.add('very-soon');
                }
                item[2] = units(item[2]);

                item.forEach( val => {
                    let cell = document.createElement('td');
                    cell.innerHTML = val;
                    row.appendChild(cell);
                });

                let button = document.createElement('button');

                button.setAttribute('type', 'button');
                button.classList.add('cutButton');
                button.innerHTML = '<span>⨯</span>';
                button.addEventListener('click', () => { submitCut(index); });

                let cell = document.createElement('td');

                cell.classList.add('actions');
                cell.appendChild(button);

                row.appendChild(cell);
                table.appendChild(row);
            });
        }

        function units(til) {
            if (til === 0) {
                til = 'Now!';
            } else if (til === 1) {
                til = '1 d<span class="large">ay</span>';
            } else if (til < 30) {
                til += ' d<span class="large">ays</span>';
            } else {
                til = Math.round(til / 30.4); // 30.4 = average days per month

                if (til === 1) {
                    til = '1 m<span class="large">on.</span>';
                } else if (til === 12) {
                    til = '1 y<span class="large">ear</span>';
                } else {
                    til += ' m<span class="large">ons.</span>';
                }
            }
            return til;
        }

// ------------ HANDLE FORM ------------------------------------------------------------------------

        function showForm() {
            formAdd.classList.remove('hide');
            buttonShowForm.classList.add('hide');
            buttonHideForm.classList.remove('hide');
            table.classList.add('editable');
            inputName1.focus();
        }
        function hideForm() {
            cleanForm();
            table.classList.remove('editable');
            formAdd.classList.add('hide');
            buttonHideForm.classList.add('hide');
            buttonShowForm.classList.remove('hide');
            buttonShowForm.focus();
        }

        function adjustForm() {
            cleanForm();
            if (selectType.value === 'AN') {
                labelName1.innerHTML = 'Groom:';
                sectionName2.classList.remove('hide');
                inputDate.placeholder = 'yyyy/mm/dd';
                pgfDate.innerHTML = 'yyyy/mm/dd';
            } else if (selectType.value === 'EX') {
                labelName1.innerHTML = 'Event:';
                sectionName2.classList.add('hide');
                inputDate.placeholder = 'mm/dd';
                pgfDate.innerHTML = 'mm/dd';
            } else {
                labelName1.innerHTML = 'Name:';
                sectionName2.classList.add('hide');
                inputDate.placeholder = 'yyyy/mm/dd';
                pgfDate.innerHTML = 'yyyy/mm/dd';
            }
            inputName1.focus();
        }

        function cleanForm() {
            inputName1.value = '';
            inputName1.classList.remove('invalid');
            pgfName1.classList.add('hide');

            inputName2.value = '';
            inputName2.classList.remove('invalid');
            pgfName2.classList.add('hide');

            inputDate.value = '';
            inputDate.classList.remove('invalid');
            pgfDate.classList.add('hide');
        }


// ------------ REMOVE ITEMS ------------------------------------------------------------------------

        function submitCut(index) {
            workingList.splice(index, 1);
            localStorage.list = JSON.stringify(workingList);
            initFill(new Date);
        }

// ------------ ADD ITEMS ------------------------------------------------------------------------

        function validateAdd() {
            let valid = true;
            const nameRe = /^[A-Z][A-Za-z_\- ]*$/;

            if (!inputName1.value) {
                inputName1.classList.add('invalid');
                valid = false;
            } else if (!inputName1.value.trim().match(nameRe)) {
                inputName1.classList.add('invalid');
                pgfName1.classList.remove('hide');
                valid = false;
            } else {
                inputName1.classList.remove('invalid');
                pgfName1.classList.add('hide');
            }

            if (selectType.value === 'AN') {
                if (!inputName2.value) {
                    inputName2.classList.add('invalid');
                    valid = false;
                } else if (!inputName2.value.trim().match(nameRe)) {
                    inputName2.classList.add('invalid');
                    pgfName2.classList.remove('hide');
                    valid = false;
                } else {
                    inputName2.classList.remove('invalid');
                    pgfName2.classList.add('hide');
                }
            }

            if (!inputDate.value) {
                inputDate.classList.add('invalid');
                valid = false;
            } else if (selectType.value === 'EX') {
                if (!inputDate.value.trim().match(/^[0-1][0-9][\/.-][0-3][0-9]$/)) {
                    inputDate.classList.add('invalid');
                    pgfDate.classList.remove('hide');
                    valid = false;
                }
            } else if (!inputDate.value.trim().match(/^[1-2]([09])[0-9]{2}[\/.-][0-1][0-9][\/.-][0-3][0-9]$/)) {
                inputDate.classList.add('invalid');
                pgfDate.classList.remove('hide');
                valid = false;
            } else {
                inputDate.classList.remove('invalid');
                pgfDate.classList.add('hide');
            }

            if (!valid) {
                return false;
            }

            submitAdd();
        }

        function submitAdd() {
            let dateVal = inputDate.value.trim().replace(/[.-]/g, '/');

            if (dateVal.length < 6) {
                dateVal = '1970/' + dateVal;
            }

            let newEvent = {
                type: selectType.value,
                date: dateVal,
                name: inputName1.value.trim()
            };

            if (selectType.value === 'AN') {
                newEvent.name += '/' + inputName2.value.trim();
            }

            workingList.push(newEvent);
            localStorage.list = JSON.stringify(workingList);

            initFill(new Date);

            inputName1.value = '';
            inputName2.value = '';
            inputDate.value = '';

            pgfConfirm.classList.remove('hide');
            setTimeout(function () {
                pgfConfirm.classList.add('hide');
            }, 2000);
        }

// ------------ RESET ------------------------------------------------------------------------

        function reset() {
            if (confirm('Reset to default list?')) {
                workingList = JSON.parse(defaultList);
                localStorage.list = '';
                hideForm();
                initFill(new Date);
            }
        }

// ------------ SET BACKGROUND ------------------------------------------------------------------------

        function setBackground() {
            const topItem = document.getElementById('list').childNodes[0];
            const content = topItem.childNodes[1].innerHTML;

            if (content.indexOf('anv') > -1) {
                document.body.className = 'anv';
            } else if (content.toLowerCase().indexOf('valentine') > -1) {
                document.body.className = 'valentine';
            } else if (content.toLowerCase().indexOf('christmas') > -1) {
                document.body.className = 'christmas';
            } else {
                document.body.className = content.substring(0, content.indexOf(':')).toLowerCase();
            }
        }
    }
};
