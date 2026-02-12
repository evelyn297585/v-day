const noStages = [
    { message: "Like... really? 🤨", gif: "https://media.tenor.com/Z5xQ0M9YYjUAAAAj/cat-typing.gif" },
    { message: "What is going on with you? 🧐", gif: "https://media.tenor.com/rsQaL4uW4i8AAAAj/angry-cat.gif" },
    { message: "Is it that you dont see the YES option? 👀", gif: "https://media.tenor.com/q8u2JfPjQ8AAAAAj/cat-looking.gif" },
    { message: "Questioning my life choices 😭", gif: "https://media.tenor.com/8sW7P9J0A1kAAAAj/crying-cat.gif" },
    { message: "Last no before chaos 😈", gif: "https://media.tenor.com/3NIPaG8M4dcAAAAj/evil-cat.gif" },
    { message: "Okay… then who is SHEEEE? 🔍👀", gif: "https://media.tenor.com/6Q9gbF5x8eQAAAAj/cat-investigating.gif" },
    { message: "Say yes and I’ll pretend this never happened 😌💞", gif: "https://media.tenor.com/H4K7n6tN6QAAAAAj/cute-cat-begging.gif" },
    { message: "Well, you're stuck with me now 😏❤️", gif: "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif" }
];

let noClickCount = 0;
let runawayEnabled = false;

function handleNoClick() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const catGif = document.getElementById('cat-gif');

    if (runawayEnabled) {
        moveButton();
        return;
    }

    if (noClickCount < noStages.length) {
        const stage = noStages[noClickCount];
        noBtn.textContent = stage.message;
        catGif.src = stage.gif; // CAMBIO DE GIF GARANTIZADO
        
        // CRECIMIENTO CON LÍMITE ESTRICTO
        const currentFontSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        if (currentFontSize < 80) { // No crecerá más de este tamaño (aprox 40% de un cel)
            yesBtn.style.fontSize = (currentFontSize * 1.2) + "px";
            yesBtn.style.padding = "20px 40px"; // Mantiene forma de botón
        }
        
        noClickCount++;
    }

    if (noClickCount >= noStages.length) {
        enableRunaway();
    }
}

function handleYesClick() {
    window.location.href = "yes.html";
}

function enableRunaway() {
    runawayEnabled = true;
    const noBtn = document.getElementById('no-btn');
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '1000';
    noBtn.textContent = "Well, you're stuck with me now 😏❤️";
    
    document.addEventListener('mousemove', (e) => {
        const btnRect = noBtn.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (btnRect.left + btnRect.width/2), e.clientY - (btnRect.top + btnRect.height/2));
        if (dist < 100) moveButton();
    });
}

function moveButton() {
    const noBtn = document.getElementById('no-btn');
    const maxX = window.innerWidth - noBtn.offsetWidth - 40;
    const maxY = window.innerHeight - noBtn.offsetHeight - 40;
    noBtn.style.left = Math.max(20, Math.random() * maxX) + 'px';
    noBtn.style.top = Math.max(20, Math.random() * maxY) + 'px';
}
