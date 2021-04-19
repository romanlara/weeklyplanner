// Created on April 8, 2021 by lara.ems.roman
// Finished on April 16, 2021

window.onload = function () {
    let debug = false;
    let storagename = 'weeklyPlanner';

    let d = document;

    // Get dialogs.
    let goalDialog = d.querySelector('#goalDialog');
    let activityDialog = d.querySelector('#activityDialog');
    let editMsgDialog = d.querySelector('#editMsgDialog');
    let clearDialog = d.querySelector('#clearDialog');

    renderAfterLoad(); // Generate the elements saved in the storage when the app is loaded.

    // -------------------
    // Goals Dialog..

    // Open #goalsDialog:
    d.querySelector('#open-goalsDialog-btn').onclick = function() {
        if (typeof goalDialog.showModal === 'function') {
            goalDialog.showModal();
            goalDialog.style.display = 'grid';

            d.forms['goal-form'].elements['goal_input_txt'].value = '';
        }
        else {
            alert('The <dialog> API is not supported by this browser.\nPlease use Edge or Chrome.');
        }
    };

    // Close #goalsDialog:
    d.querySelector('#cancel_btn_AddGoalDialog').onclick = function() {
        // Remove special the "display: grid" declaration style.
        goalDialog.removeAttribute('style');
        goalDialog.close();// Close the dialog.
    };

    // Save the information given for the user in #goalsDialog and close it:
    d.querySelector('#confirm_btn_AddGoalDialog').onclick = function() {
        // Remove special the "display: grid" declaration style.
        goalDialog.removeAttribute('style');
        goalDialog.close();// Close the dialog.

        // Get all information given for the user:
        let idstamp = new Date().getTime();
        let name = (debug) ? 'Goal Test' : d.forms['goal-form'].elements['goal_input_txt'].value;
        let iconurl = d.forms['goal-form'].elements['icons'].value;
        let iconalt = iconurl.split("/").pop().split('.')[0];

        // Validating the info:
        if (isEmpty(name) != null && isEmpty(name)) {
            alert ('It can\'t create the goal, because the input text field is empty.');
            return;
        }

        // The goal structure is generated and put it in the DOM.
        createGoal(idstamp, name, iconurl, iconalt);

        // Preparing to save in the storage:
        let json = getStorage(storagename); // Try to get the storage.
        // If not exist the 'goals' object, 
        // we create the array by first time.
        if (!containsKey('goals', json)) {
            json['goals'] = [];
        } 
        // The json is updated with the info:
        json.goals.push({
            idstamp: idstamp,
            name: name,
            iconurl: iconurl,
            iconalt: iconalt
        });
        // The json is saved in the storage:
        saveStorage(json, storagename);
    }

    // -------------------
    // Activity Dialog..

    // Open #activityDialog:
    d.querySelector('#open-activityDialog-btn').onclick = function() {
        if (typeof activityDialog.showModal === 'function') {
            activityDialog.showModal();
            activityDialog.style.display = 'grid';

            d.forms['activity-form'].elements['title_input_txt_ActivityDialog'].value = '';
            d.forms['activity-form'].elements['briefDescription_input_txt_ActivityDialog'].value = '';
            d.forms['activity-form'].elements['startTime_select_ActivityDialog'].value = '00:00';
            d.forms['activity-form'].elements['day_input_select_Activitydialog'].value = 'sunday';
            d.forms['activity-form'].elements['link_input_txt_ActivityDialog'].value = '';
        }
        else {
            alert('The <dialog> API is not supported by this browser.\nPlease use Edge or Chrome.');
        }
    };

    // Close #activityDialog:
    d.querySelector('#cancel_btn_AddActivityDialog').onclick = function() {
        activityDialog.removeAttribute('style');
        activityDialog.close();
    };

    // Save the information given for the user in #activityDialog and close it:
    d.querySelector('#confirm_btn_AddActivityDialog').onclick = function() {
        activityDialog.removeAttribute('style');
        activityDialog.close();

        const randomTime = () => {
            const hrs = Math.floor(Math.random() * (24 - 0) + 0);
            const mins = Math.floor(Math.random() * 2) * 30;
            return `${zeroPad(hrs, 2)}:${zeroPad(mins, 2)}`;
        };
        const randomDay = () => {
            const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            return weekdays[Math.floor(Math.random() * weekdays.length)];
        };
        const randomLink = () => {
            const links = ['https://laraemsroman.wixsite.com/portfolio', 'https://platzi.com/blog/css-grid-glassmorphism/'];
            return links[Math.floor(Math.random() * links.length)];
        };

        // Get all information given for the user:
        let idstamp = new Date().getTime();
        let title = (debug) ? 'Activity Test' : d.forms['activity-form'].elements['title_input_txt_ActivityDialog'].value;
        let brief = (debug) ? 'Brief Test' : d.forms['activity-form'].elements['briefDescription_input_txt_ActivityDialog'].value;
        let starttime = (debug) ? randomTime() : d.forms['activity-form'].elements['startTime_select_ActivityDialog'].value;
        let day = (debug) ? randomDay() : d.forms['activity-form'].elements['day_input_select_Activitydialog'].value;
        let link = (debug) ? randomLink() : d.forms['activity-form'].elements['link_input_txt_ActivityDialog'].value;

        // Validating the info:
        if (isEmpty(title) != null && isEmpty(title)) {
            alert('It can\'t create the card.\nThe "Title" field is empty.');
            return;
        }
        if (isEmpty(brief) != null && isEmpty(brief)) {
            alert('It can\'t create the card.\nThe "Brief description" field is empty.');
            return;
        }
        
        // The goal structure is generated and put it in the DOM.
        createCard(idstamp, title, brief, starttime, day, link);

        // Preparing to save in the storage:
        let json = getStorage(storagename); // Try to get the storage.
        // If not exist the 'cards' object, 
        // we create the object by first time.
        if (!containsKey('cards', json)) {
            json['cards'] = {};
        }
        // If the day not exist, we create the array by first time.
        if (!containsKey(day, json.cards)) {
            json.cards[day] = [];
        }
        // The json is updated with the info:
        json.cards[day].push({
            idstamp: idstamp,
            title: title,
            brief: brief,
            starttime: starttime,
            day: day,
            link: link
        });
        // The json is saved in the storage:
        saveStorage(json, storagename);

        // The cards are sorted to arrange the hours:
        sortCards(day, json);
    }

    // -------------------
    // Edit Msg Dialog..

    // Open #editMsgDialog:
    d.querySelector('#open-editMsgDialog-btn').onclick = function() {
        if (typeof editMsgDialog.showModal === 'function') {
            editMsgDialog.showModal();
            editMsgDialog.style.display = 'grid';

            d.forms['editmsg-form'].elements['editMsg_input_txt'].value = '';
        }
        else {
            alert('The <dialog> API is not supported by this browser.\nPlease use Edge or Chrome.');
        }
    };

    // Save the information given for the user in #editMsgDialog and close it:
    d.querySelector('#confirm_btn_EditMsgDialog').onclick = function() {
        editMsgDialog.removeAttribute('style');
        editMsgDialog.close();

        // Get message given for the user:
        let msg = (debug) ? 'Msg Test' : d.forms['editmsg-form'].elements['editMsg_input_txt'].value;

        // Validating the info:
        if (isEmpty(msg) != null && isEmpty(msg)) {
            alert('It can\'t create the card.\nThe "Message" field is empty.');
            return;
        }

        // Update the <p>:
        d.querySelector('.main-content > .title > p:nth-child(2)').innerHTML = msg;

        // Preparing to save in the storage:
        let json = getStorage(storagename); // Try to get the storage.
        // If not exist the 'goals' object, 
        // we create the array by first time.
        if (!containsKey('msg', json)) {
            json['msg'] = '';
        } 
        // The json is updated with the info:
        json.msg = msg;
        // The json is saved in the storage:
        saveStorage(json, storagename);
    }

    // -------------------
    // Clear Dialog..

    // Open #clearDialog:
    d.querySelector('#open-clearDialog-btn').onclick = function() {
        if (typeof clearDialog.showModal === 'function') {
            clearDialog.showModal();
            clearDialog.style.display = 'grid';
        }
        else {
            alert('The <dialog> API is not supported by this browser.\nPlease use Edge or Chrome.');
        }
    };

    // Close #clearDialog:
    d.querySelector('#cancel_btn_ClearDialog').onclick = function() {
        clearDialog.removeAttribute('style');
        clearDialog.close();
    }

    // Delete only goals and close #clearDialog:
    d.querySelector('#clearOnlyGoals_btn_ClearDialog').onclick = function() {
        clearDialog.removeAttribute('style');
        clearDialog.close();
        // Deleted from the storage and from the DOM:
        deleteGoals(storagename);
    }

    // Delete only activities and close #clearDialog:
    d.querySelector('#clearOnlyActivities_btn_ClearDialog').onclick = function() {
        clearDialog.removeAttribute('style');
        clearDialog.close();
        // Deleted from the storage and from the DOM:
        deleteCards(storagename);
    }

    // Delete only all and close #clearDialog:
    d.querySelector('#clearAll_btn_ClearDialog').onclick = function() {
        clearDialog.removeAttribute('style');
        clearDialog.close();
        // Deleted from the storage and from the DOM:
        deleteStorage(storagename);
    }

    // -------------------
    // When the app is loaded

    function renderAfterLoad() {
        let json = getStorage(storagename);

        // The goals are created:
        if (containsKey('goals', json)) {
            for (let child of json.goals) 
                createGoal(child.idstamp, child.name, child.iconurl, child.iconalt);
        }

        // The cards are created:
        if (containsKey('cards', json)) {
            ['sunday', 'monday', 'tuesday', 'wednesday', 
             'thursday', 'friday', 'saturday'].forEach(function (weekday) {
                if (containsKey(weekday, json.cards))
                    json.cards[weekday].forEach(function (child) {
                        createCard(child.idstamp, child.title, child.brief, child.starttime, child.day, child.link);
                    });
            });
        }

        // Get the msg:
        if (containsKey('msg', json))
            d.querySelector('.main-content > .title > p:nth-child(2)').innerHTML = json.msg;
    }

    // -------------------
    // Creation of elems in the DOM

    /* This function create the next structure for a goal:
        <div class="goals" idstamp="1234567890">
            <div class="round-box glassmorphism-effect">
                <img src="https://img.icons8.com/nolan/64/love-book.png" alt="book">
            </div>
            <p>Read more</p>
            <div class="round-box">
                <img src="https://img.icons8.com/nolan/64/delete-sign.png" alt="delete"/>
            </div>
        </div>
    */
    function createGoal(idstamp, name, icon_url, icon_alt) {
        let goalsBar = d.querySelector('#goals-bar');

        let newgoal = d.createElement('div');
        newgoal.className = 'goals';
        newgoal.setAttribute('idstamp', idstamp);

        let divIcon = d.createElement('div');
        divIcon.className = 'round-box glassmorphism-effect';
        newgoal.appendChild(divIcon);

        let imgIcon = d.createElement('img');
        imgIcon.src = icon_url;
        imgIcon.alt = icon_alt;
        divIcon.appendChild(imgIcon);

        let pGoal = d.createElement('p');
        pGoal.textContent = name;
        newgoal.appendChild(pGoal);

        let divDeleteBtn = d.createElement('div');
        divDeleteBtn.className = 'round-box';
        divDeleteBtn.onclick = function(e) {
            e.preventDefault ();
            e.stopPropagation ();

            let json = getStorage(storagename); // Try to get the storage.
            let idstamp = this.parentNode.getAttribute('idstamp'); // get the id.
            // Check if the storage is not empty, 
            // if contains the 'goals' array and if contains the element in the array:
            if (!isEmpty(json) && 
                containsKey('goals', json) && 
                containsElem(idstamp, json.goals)) {
                if (confirm('Do you want to delete this goal?') == true) {
                    // From the json is removed the element.
                    json.goals.splice(getIndex(idstamp, json.goals), 1);
                    // From the DOM is removed too.
                    //this.parentNode.parentNode.removeChild(this.parentNode);
                    this.parentNode.remove();
                    // Finally, the json is updated in the storage.
                    saveStorage(json, storagename);
                }
            } else {
                alert('There is an error to delete this goal, it doesn\'t exist in the storage.');
            }
        };
        newgoal.appendChild(divDeleteBtn);

        let imgDelete = d.createElement('img');
        imgDelete.src = 'https://img.icons8.com/nolan/64/delete-sign.png';
        imgDelete.alt = 'delete';
        divDeleteBtn.appendChild(imgDelete);

        goalsBar.appendChild(newgoal);

        console.log(`New goal added to the DOM: ${name}, ${icon_url}, ${icon_alt}, ${newgoal.getAttribute('idstamp')}`);
    }
    
    /* This function create the next structure for a card:
        <div class="card margin-bottom-link-card" idstamp="1234567890" idsort="00:00">
            <div class="glassmorphism-effect">
                <p>Title</p>
            </div>
            <div class="glassmorphism-effect">
                <p>00:00pm</p>
                <p>Description</p>
                <a href="#" target="_blank">
                    <img src="https://img.icons8.com/nolan/64/external-link.png" alt="external link">
                </a>
            </div>
            <div class="round-box">
                <img src="https://img.icons8.com/nolan/64/delete-sign.png" alt="delete"/>
            </div>
        </div>
    */
    function createCard(idstamp, title, brief, starttime, day, link) {
        let dayColumn = d.querySelector(`#${day}`);

        let newcard = d.createElement('div');
        newcard.className = `card ${!isEmpty(link) ? 'margin-bottom-link-card' : ''}`;
        newcard.setAttribute('idstamp', idstamp);
        newcard.setAttribute('idsort', starttime);

        let divtitle = d.createElement('div');
        divtitle.className = 'glassmorphism-effect';
        newcard.appendChild(divtitle);

        let ptitle = d.createElement('p');
        ptitle.textContent = title;
        divtitle.appendChild(ptitle);

        let divbrief = d.createElement('div');
        divbrief.className = 'glassmorphism-effect';
        newcard.appendChild(divbrief);

        let pstartime = d.createElement('p');
        pstartime.textContent = militaryTime(starttime);
        divbrief.appendChild(pstartime);

        let pbrief = d.createElement('p');
        pbrief.textContent = brief;
        divbrief.appendChild(pbrief);

        if (!isEmpty(link)) {
            let alink = d.createElement('a');
            alink.href = link;
            alink.target = '_blank';
            divbrief.appendChild(alink);

            let aimg = d.createElement('img');
            aimg.src = 'https://img.icons8.com/nolan/64/external-link.png';
            aimg.alt = 'external link';
            alink.appendChild(aimg);
        }

        let divdelete = d.createElement('div');
        divdelete.className = 'round-box';
        divdelete.onclick = function(e) {
            e.preventDefault ();
            e.stopPropagation ();

            let json = getStorage(storagename); // Try to get the storage.
            let idstamp = this.parentNode.getAttribute('idstamp'); // get the id stamp.
            let daycol = this.parentNode.parentNode.getAttribute('id'); // get the day.
            // Check if the storage is not empty, 
            // if contains the 'goals' array and if contains the element in the array:
            if (!isEmpty(json) && 
                containsKey('cards', json) && 
                containsKey(daycol, json.cards) && 
                containsElem(idstamp, json.cards[daycol])) {
                if (confirm('Do you want to delete this activity?') == true) {
                    // From the json is removed the element.
                    json.cards[daycol].splice(getIndex(idstamp, json.cards[daycol]), 1);
                    // From the DOM is removed too.
                    this.parentNode.remove();
                    // Finally, the json is updated in the storage.
                    saveStorage(json, storagename);
                }
            } else {
                alert('There is an error to delete this card, it doesn\'t exist in the storage.');
            }
        };
        newcard.appendChild(divdelete);

        let imgdelete = d.createElement('img');
        imgdelete.src = 'https://img.icons8.com/nolan/64/delete-sign.png';
        imgdelete.alt = 'delete';
        divdelete.appendChild(imgdelete);
        
        dayColumn.appendChild(newcard);
        
        console.log(`New card added to the DOM: ${idstamp}, ${title}, ${brief}, ${starttime}/${militaryTime(starttime)}, ${day}, ${isEmpty(link) ? 'No link' : link}`);
    }

    // Sort the cards:
    function sortCards(day, json) {
        let dayColumn = d.querySelector(`#${day}`);
        let cardsDOM = d.querySelectorAll(`#${day} > .card`);

        // The cards are sorted from the DOM transforming in array:
        let cardsArray = [].slice.call(cardsDOM).sort(function (a, b) {
            let a_stamp = getTimeStamp(a.getAttribute('idsort'));
            let b_stamp = getTimeStamp(b.getAttribute('idsort'));
            
            return a_stamp - b_stamp;
        });
        // We relocate the cards in the DOM:
        cardsArray.forEach(function (elem) {
            dayColumn.appendChild(elem);
        });

        // The storage is sorted:
        json.cards[day].sort(function (a, b) {
            let a_stamp = getTimeStamp(a.starttime);
            let b_stamp = getTimeStamp(b.starttime);

            return a_stamp - b_stamp;
        });

        // The json is saved in the storage:
        saveStorage(json, storagename);
    }

    // -------------------
    // Storage Functions

    function getStorage(key) {
        let storage = localStorage.getItem(key);
        let info = {};

        if (storage !== null) {
            info = JSON.parse(localStorage.getItem(key));
        }

        // if (isEmpty(info)) {
        //     console.log('The storage is Empty.');
        // } else {
        //     console.log('Info successfully obtained.');
        // }

        return info;
    }

    function saveStorage(info, key) {
        if (typeof info === 'object') {
            localStorage.setItem(key, JSON.stringify(info));
            // console.log('Info successfully saved.');
        } else {
            console.log('It was not able to save the info, unexpected info type.');
        }
    }

    function deleteStorage(key) {
        deleteGoals(key); // Remove the goals.
        deleteCards(key); // Remove the cards.

        d.querySelector('.main-content > .title > p:nth-child(2)').innerHTML = 'Type a message';

        // Deleted all from the storage:
        localStorage.removeItem(key);
        console.log('Info deleted successfully.');
    }

    function deleteGoals(key) {
        let info = getStorage(key);

        if (!isEmpty(info)) {
            // Deleted from the storage:
            info['goals'] = [];
            saveStorage(info, storagename);

            // Removed from the DOM:
            d.querySelectorAll('#goals-bar > .goals').forEach(e => e.remove());

            console.log('Goals info deleted successfully.');
        }
    }

    function deleteCards(key) {
        let info = getStorage(key);

        if (!isEmpty(info)) {
            // Deleted from the storage:
            info['cards'] = {};
            saveStorage(info, storagename);

            // Removed from the DOM:
            d.querySelectorAll('#sunday > .card').forEach(e => e.remove());
            d.querySelectorAll('#monday > .card').forEach(e => e.remove());
            d.querySelectorAll('#tuesday > .card').forEach(e => e.remove());
            d.querySelectorAll('#wednesday > .card').forEach(e => e.remove());
            d.querySelectorAll('#thursday > .card').forEach(e => e.remove());
            d.querySelectorAll('#friday > .card').forEach(e => e.remove());
            d.querySelectorAll('#saturday > .card').forEach(e => e.remove());

            console.log('Goals info deleted successfully.');
        }
    }

    // -------------------
    // Time Functions

    function getMillisecons(time) { return (parseInt(time[0]) * (60000 * 60)) + (parseInt(time[1]) * 60000); }
    
    function getTimeStamp(time) { return getMillisecons(time.split (':')); }

    function zeroPad(num, places) { return String(num).padStart(places, '0'); }

    function militaryTime(time) {
        const t = time.split(':');

        let hrs = Number(t[0]);
        let mins = Number(t[1]);

        hrs = (hrs == 24) ? 0 : hrs; 

        if (hrs < 12) {
            if (hrs == 0) hrs = 12;
            return `${zeroPad(hrs, 2)}:${zeroPad(mins, 2)}am`;
        } else {
            if (hrs == 12) hrs = 24;
            return `${zeroPad(hrs - 12, 2)}:${zeroPad(mins, 2)}pm`;
        }
    }

    // -------------------
    // Utility Functions

    // Determines if a string or object is empty..
    function isEmpty(entry) {
        if (typeof entry === 'string') {
            return entry === '';
        }

        if (typeof entry === 'object') {
            for (let key in entry) {
                if (entry.hasOwnProperty(key)) {
                    return false;
                }
            }

            return true;
        }

        return null;
    }

    function containsKey(key, obj) {
        for (let name of Object.keys(obj)) {
            if (name === key)
                return true;
        }

        return false;
    }

    function containsElem(key, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] != null && array[i].idstamp.toString() === key) 
                return true;
        }

        return false;
    }

    function getElem(key, obj) {
        for (let elem of obj) {
            if (elem.idstamp.toString() === key)
                return elem;
        }

        return null;
    }

    function getIndex(key, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] != null && array[i].idstamp.toString() === key) 
                return i;
        }

        return -1;
    }
};