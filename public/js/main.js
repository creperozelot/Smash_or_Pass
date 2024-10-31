document.addEventListener('DOMContentLoaded', function () {
    const usernameContainer = document.getElementById('username-container');
    const usernameInput = document.getElementById('username');
    const startBtn = document.getElementById('start-btn');
    const smashOrPassContainer = document.getElementById('smash-or-pass-container');
    const cardContainer = document.getElementById('card-container');
    const gameContainer = document.getElementById('add_game_container')
    const featuredModeContainer = document.getElementById('gamemode_panel');
    const footer = document.getElementById('footer');
    const smashBtn = document.getElementById('smash-btn');
    const passBtn = document.getElementById('pass-btn');
    const resultsContainer = document.getElementById('results-container');
    const smashedList = document.getElementById('smashed-list');
    const passedList = document.getElementById('passed-list');
    let currentIndex = 0;
    let smashed = [];
    let passed = [];
    let username = '';

    function showNextPerson(action) {
        if (action === 'smash') {
            smashed.push(people[currentIndex]);
        } else if (action === 'pass') {
            passed.push(people[currentIndex]);
        }

        currentIndex++;
        if (currentIndex < people.length) {
            const nextPerson = people[currentIndex];
            const personCard = document.getElementById('person-card');

            personCard.classList.remove('fade-in');
            personCard.classList.add('fade-out');

            setTimeout(() => {
                personCard.querySelector('img').src = nextPerson.image;
                personCard.querySelector('.card-title').innerText = nextPerson.name;
                personCard.setAttribute('data-index', currentIndex);

                personCard.classList.remove('fade-out');
                personCard.classList.add('fade-in');
            }, 500);
        } else {
            smashOrPassContainer.classList.add('d-none');
            displayResults();
            resultsContainer.classList.remove('d-none');
        }
    }

    function displayResults() {
        smashed.forEach(person => {
            const a = document.createElement('a');
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerText = person.name;
            a.appendChild(li);
            smashedList.appendChild(a);
        });

        passed.forEach(person => {
            const a = document.createElement('a');
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerText = person.name;
            a.append(li);
            passedList.appendChild(a);
        });

        saveUserData();
    }

    function saveUserData() {

        data = {
            "userid": user.id,
            "username": user.displayName,
            "gameid": gameid,
            "smashed": smashed.length,
            "passed": passed.length 
        }

        console.log('SEND' + JSON.stringify(data))

        fetch('/save-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    startBtn.addEventListener('click', () => {
        if (user) {
            usernameContainer.classList.add('d-none');
            gameContainer.classList.add('d-none');
            footer.classList.add('d-none');
            featuredModeContainer.classList.add('d-none');
            smashOrPassContainer.classList.remove('d-none');
            
        }
    });

    smashBtn.addEventListener('click', () => showNextPerson('smash'));
    passBtn.addEventListener('click', () => showNextPerson('pass'));
});
