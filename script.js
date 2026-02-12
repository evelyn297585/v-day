const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
]

const noMessages = [
    "No 🙈",
    "Papacito... really? 😮",
    "Think again, handsome 😌",
    "Tiny guy is in shambles 😢",
    "Okay now he's blushing + panicking 🫣",
    "One yes and we both win 💞",
    "Don't make me beg in 4K...",
    "Last no before chaos 😭",
    "Too slow, now I run 😜"
]

const yesTeasePokes = [
    "Aww, eager! tap no once so he can show you his drama arc 😏",
    "Just one no... for the plot 👀",
    "You unlocked level: emotional blackmail 😈",
    "Okay okay, hit no once more then promise me a yes? 💋"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const gifWrap = document.getElementById('gif-wrap')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

const overlay = document.getElementById('celebration-overlay')

yesBtn.addEventListener('mouseenter', () => {
    gifWrap.classList.add('happy')
    gifWrap.classList.remove('sad')
})

yesBtn.addEventListener('mouseleave', () => {
    gifWrap.classList.remove('happy')
})

noBtn.addEventListener('mouseenter', () => {
    gifWrap.classList.add('sad')
    gifWrap.classList.remove('happy')
    if (!runawayEnabled) nudgeNoButton()
})

noBtn.addEventListener('mouseleave', () => {
    gifWrap.classList.remove('sad')
})

music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        bounceCharacter()
        showTeaseMessage(msg)
        return
    }

    showTeaseMessage('Best decision ever. Loading celebration... 💕')
    burstHearts()
    setTimeout(() => {
        window.location.href = 'yes.html'
    }, 650)
}

function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2600)
}

function handleNoClick() {
    noClickCount++

    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${Math.min(currentSize * 1.28, 56)}px`
    const padY = Math.min(18 + noClickCount * 5, 64)
    const padX = Math.min(46 + noClickCount * 11, 128)
    yesBtn.style.padding = `${padY}px ${padX}px`

    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.84, 10)}px`
    }

    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    blushCharacter()

    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
        showTeaseMessage('Oops. You unlocked RUNAWAY mode 💨')
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 170)
}

function blushCharacter() {
    gifWrap.classList.add('blushing')
    setTimeout(() => gifWrap.classList.remove('blushing'), 550)
}

function bounceCharacter() {
    catGif.style.transform = 'translateY(-8px) scale(1.04)'
    setTimeout(() => {
        catGif.style.transform = 'translateY(0) scale(1)'
    }, 220)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 18
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}


function nudgeNoButton() {
    const x = (Math.random() * 10 - 5).toFixed(1)
    const y = (Math.random() * 6 - 3).toFixed(1)
    noBtn.style.transform = `translate(${x}px, ${y}px)`
    setTimeout(() => {
        if (!runawayEnabled) noBtn.style.transform = 'translate(0, 0)'
    }, 140)
}

function burstHearts() {
    const hearts = ['💖', '💕', '💗', '💘', '✨']
    for (let i = 0; i < 16; i++) {
        const heart = document.createElement('span')
        heart.className = 'burst-heart'
        heart.textContent = hearts[i % hearts.length]
        heart.style.left = '50%'
        heart.style.top = '56%'
        heart.style.setProperty('--dx', `${(Math.random() * 260 - 130).toFixed(0)}px`)
        heart.style.setProperty('--dy', `${(-40 - Math.random() * 180).toFixed(0)}px`)
        overlay.appendChild(heart)
        setTimeout(() => heart.remove(), 900)
    }
}
