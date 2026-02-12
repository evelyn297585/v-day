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
    const audio = document.getElementById('bg-music');

    // MÚSICA: Se activa con el primer clic del usuario
    if (audio.paused) {
        audio.play().catch(e => console.log("Audio waiting for interaction"));
    }

    if (runawayEnabled) {
        moveButton();
        return;
    }

    if (noClickCount < noStages.length) {
        const stage = noStages[noClickCount];
        noBtn.textContent = stage.message;
        
        // CAMBIO DE GIF: Forzamos la recarga de la imagen
        catGif.src = stage.gif;

        // CRECIMIENTO DEL BOTÓN YES: Límite de 80px para no romper el cel
        const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        if (currentSize < 80) {
            yesBtn.style.fontSize = (currentSize * 1.3) + "px";
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
    
    // RADAR DE HUIDA: Si el mouse se acerca a menos de 200px, el botón salta
    document.addEventListener('mousemove', (e) => {
        if (!runawayEnabled) return;
        const btnRect = noBtn.getBoundingClientRect();
        const x = btnRect.left + btnRect.width / 2;
        const y = btnRect.top + btnRect.height / 2;
        const dist = Math.hypot(e.clientX - x, e.clientY - y);
        
        if (dist < 200) moveButton();
    });
}

function moveButton() {
    const noBtn = document.getElementById('no-btn');
    const padding = 80;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    
    noBtn.style.left = Math.max(padding, Math.random() * maxX) + 'px';
    noBtn.style.top = Math.max(padding, Math.random() * maxY) + 'px';
}
