<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evolution RPG</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        :root {
            --bg: #1c1c1c;
            --text: white;
            --card-bg: #2a2a2a;
            --border: #444;
            --btn: #3390ec;
            --str: #ff4d4d;
            --dex: #4dff4d;
            --int: #4db8ff;
        }

        body {
            font-family: 'Segoe UI', sans-serif;
            background: var(--bg);
            color: var(--text);
            text-align: center;
            padding: 20px;
            margin: 0;
            min-height: 100vh;
            transition: background-color 0.3s;
        }

        h1 {
            margin-bottom: 20px;
            font-size: 1.8em;
            opacity: 0;
            animation: fadeIn 0.8s ease forwards;
        }

        .subtitle {
            opacity: 0;
            animation: fadeIn 0.8s ease 0.3s forwards;
            color: #aaa;
            margin-bottom: 30px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .race-card {
            border: 2px solid var(--border);
            border-radius: 15px;
            padding: 15px;
            margin: 20px auto;
            background: var(--card-bg);
            max-width: 350px;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .race-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(51, 144, 236, 0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .race-card:hover::before {
            opacity: 1;
        }

        .race-card:hover {
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 10px 20px rgba(51, 144, 236, 0.2);
            border-color: var(--btn);
        }

        .race-icon {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            margin-top: 12px;
            font-size: 0.9em;
            color: #aaa;
        }

        .str { color: var(--str); }
        .dex { color: var(--dex); }
        .int { color: var(--int); }

        button {
            background: var(--btn);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: bold;
            margin-top: 15px;
            cursor: pointer;
            width: 100%;
            font-size: 1em;
            transition: transform 0.1s;
        }

        button:active {
            transform: scale(0.95);
        }

        .selected {
            border-color: #ffd700;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
            animation: pop 0.4s ease;
        }

        .selected .race-icon {
            filter: drop-shadow(0 0 5px gold);
        }

        .footer {
            margin-top: 50px;
            color: #666;
            font-size: 0.8em;
        }

        .reselect {
            color: #ffd700;
            font-size: 0.9em;
            margin-top: 5px;
            display: block;
        }
    </style>
</head>
<body>
    <h1>Evolution RPG</h1>
    <div class="subtitle">Выбери свою расу и начни путь к величию</div>
    <div id="race-list"></div>
    <div class="footer">Сохранение прогресса — включено ✅</div>

    <script>
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.ready();
// Иконки для рас (SVG или эмодзи)
        const icons = {
            lizard: '🦎',
            elf: '🧝',
            orc: '👹',
            water: '🧜‍♂️'
        };

        // Проверяем, есть ли сохранённая раса
        const savedRace = localStorage.getItem('evolution_rpg_race');

        const races = [
            { id: 'lizard', name: 'Ящер', str: 3, dex: 4, int: 1, desc: 'Быстрый и смертоносный' },
            { id: 'elf', name: 'Эльф', str: 2, dex: 3, int: 4, desc: 'Мастер магии и грации' },
            { id: 'orc', name: 'Орк', str: 5, dex: 1, int: 0, desc: 'Невероятная грубая сила' },
            { id: 'water', name: 'Подводный', str: 2, dex: 2, int: 4, desc: 'Властелин глубин' }
        ];

        const container = document.getElementById('race-list');

        races.forEach(race => {
            const card = document.createElement('div');
            card.className = 'race-card';
            card.id = race-${race.id};

            card.innerHTML = 
                <div class="race-icon">${icons[race.id]}</div>
                <h3>${race.name}</h3>
                <p>${race.desc}</p>
                <div class="stats">
                    <span class="str">STR: +${race.str}</span>
                    <span class="dex">DEX: +${race.dex}</span>
                    <span class="int">INT: +${race.int}</span>
                </div>
                <button onclick="selectRace('${race.id}')">Выбрать</button>
                ${savedRace === race.id ? '<span class="reselect">✓ Выбрано</span>' : ''}
            ;

            container.appendChild(card);

            // Подсвечиваем выбранную ранее расу
            if (savedRace === race.id) {
                card.classList.add('selected');
            }
        });

        function selectRace(raceId) {
            // Анимация выбора
            document.querySelectorAll('.race-card').forEach(el => {
                el.classList.remove('selected');
                const reselect = el.querySelector('.reselect');
                if (reselect) reselect.remove();
            });

            const selectedCard = document.getElementById(race-${raceId});
            selectedCard.classList.add('selected');
            const reselectSpan = document.createElement('span');
            reselectSpan.className = 'reselect';
            reselectSpan.textContent = '✓ Выбрано';
            selectedCard.querySelector('button').insertAdjacentElement('afterend', reselectSpan);

            // Сохраняем в localStorage
            localStorage.setItem('evolution_rpg_race', raceId);

            // Отправляем в бота
            const data = {
                action: 'select_race',
                race: raceId,
                timestamp: Date.now()
            };

            tg.sendData(JSON.stringify(data));
            tg.close(); // Можно убрать, если хочешь оставить открытым
        }

        // При загрузке — показать сообщение, если уже выбрано
        if (savedRace) {
            const nameMap = {
                lizard: 'Ящера',
                elf: 'Эльфа',
                orc: 'Орка',
                water: 'Подводного'
            };
            tg.showAlert(Вы уже выбрали расу: ${nameMap[savedRace]}. Вы можете выбрать другую — прогресс обновится.);
        }
    </script>
</body>
</html>
let chosenRace = '';
let chosenClass = '';

// Выбор расы
document.querySelectorAll('.race-option').forEach(option => {
    option.addEventListener('click', () => {
        chosenRace = option.dataset.race;
        document.getElementById('race-selection').style.display = 'none';
        document.getElementById('class-selection').style.display = 'block';
    });
});

// Выбор класса
document.querySelectorAll('.class-option').forEach(option => {
    option.addEventListener('click', () => {
        chosenClass = option.dataset.class;
        document.getElementById('class-selection').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('chosen-race').textContent = Раса: ${chosenRace};
        document.getElementById('chosen-class').textContent = Класс: ${chosenClass};
    });
});

// Сохранение персонажа (можно заменить на отправку данных на сервер)
function saveCharacter() {
    const characterData = {
        race: chosenRace,
        class: chosenClass,
        timestamp: new Date().toISOString()
    };
    console.log('Сохранённый персонаж:', characterData);
    // Здесь можно добавить логику сохранения в localStorage или отправки на сервер
    alert('Персонаж сохранён!');
}
