 const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catGif = document.getElementById('cat-gif');
const teaseToast = document.getElementById('tease-toast');

const noStages = [
    {
        message: 'No 🙄',
        gif: 'https://media.tenor.com/Z5xQ0M9YYjUAAAAj/cat-typing.gif'
    },
    {
        message: 'Like... really? 🤨',
        gif: 'https://media.tenor.com/rsQaL4uW4i8AAAAj/angry-cat.gif'
    },
    {
        message: 'What is going on with you? 🧐',
        gif: 'https://media.tenor.com/q8u2JfPjQ8AAAAAj/cat-confused.gif'
    },
    {
        message: 'Is it that you dont see the YES option? 👀',
        gif: 'https://media.tenor.com/X5u9MXX6gYAAAAAj/cat-looking.gif'
    },
    {
        message: 'Questioning my life choices 😭',
        gif: 'https://media.tenor.com/8sW7P9J0A1kAAAAj/crying-cat.gif'
    },
    {
        message: 'Last no before chaos 😈',
        gif: 'https://media.tenor.com/3NIPaG8M4dcAAAAj/evil-cat.gif'
    },
    {
        message: 'Okay… then who is SHEEEE? 🔍👀',
        gif: 'https://media.tenor.com/6Q9gbF5x8eQAAAAj/cat-investigating.gif'
    },
    {
        message: 'Say yes and I’ll pretend this never happened 😌💞',
        gif: 'https://media.tenor.com/H4K7n6tN6QAAAAAj/cute-cat-begging.gif'
    },
    {
        message: "Well, you're stuck with me now 😏❤️",
        gif: 'https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif'
    }
];

let noClickCount = 0;
let runawayEnabled = false;

function handleNoClick() {
    if (runawayEnabled) {
        runAway();
        return;
    }

    const currentStage = noStages[Math.min(noClickCount, noStages.length - 1)];
    noBtn.textContent = currentStage.message;
    catGif.src = currentStage.gif;

    // Hacer crecer el botón SI
    const yesSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = `${yesSize * 1.4}px`;

    noClickCount++;

    // Activar modo escape en el último mensaje
    if (noClickCount >= noStages.length) {
        enableRunaway();
    }
}

function handleYesClick() {
    window.location.href = 'yes.html';
}

function enableRunaway() {
    runawayEnabled = true;
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '999';
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const btnRect = noBtn.getBoundingClientRect();
        const dist = Math.hypot(x - (btnRect.left + btnRect.width/2), y - (btnRect.top + btnRect.height/2));
        
        if (dist < 100) {
            runAway();
        }
    });
}

function runAway() {
    const maxX = window.innerWidth - noBtn.offsetWidth - 50;
    const maxY = window.innerHeight - noBtn.offsetHeight - 50;
    noBtn.style.left = Math.random() * maxX + 'px';
    noBtn.style.top = Math.random() * maxY + 'px';
}
