const noStages = [
    {
        message: "No 🙄",
        gif: "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif"
    },
    {
        message: "Like... really? 🤨",
        gif: "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif"
    },
    {
        message: "What is going on with you? 🧐",
        gif: "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif"
    },
    {
        message: "Is it that you dont see the YES option? 👀",
        gif: "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif"
    },
    {
        message: "Questioning my life choices 😭",
        gif: "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif"
    },
    {
        message: "Last no before chaos 😈",
        gif: "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif"
    },
    {
        message: "Okay… then who is SHEEEE? 🔍👀",
        gif: "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
    },
    {
        message: "Say yes and I’ll pretend this never happened 😌💞",
        gif: "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif"
    },
    {
        message: "Well, you're stuck with me now 😏❤️",
        gif: "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif"
    }
]

const REENTRY_MESSAGES = [
    "Hola de nuevo... ¿todavía pensándolo? 😏",
    "Back again? I knew you couldn't resist... 💋"
]

const STORAGE_KEYS = {
    visitedCount: 'vdayVisitedCount',
    runawayUnlocked: 'vdayRunawayUnlocked'
}

const yesTeasePokes = [
    "Aww, eager! tap no once so he can show you his drama arc 😏",
    "Just one no... for the plot 👀",
    "You unlocked level: emotional blackmail 😈",
    "Okay okay, hit no once more then promise me a yes? 💋"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let runawayInitialized = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const gifWrap = document.getElementById('gif-wrap')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')
const eyebrow = document.querySelector('.eyebrow')
const subtext = document.querySelector('.subtext')

const overlay = document.getElementById('celebration-overlay')

initializeSmartExperience()

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
    const stageIndex = Math.min(noClickCount, noStages.length - 1)
    const currentStage = noStages[stageIndex]
    noBtn.textContent = currentStage.message
    noClickCount++

    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${Math.min(currentSize * 1.28, 56)}px`
    const padY = Math.min(18 + noClickCount * 5, 64)
    const padX = Math.min(46 + noClickCount * 11, 128)
    yesBtn.style.padding = `${padY}px ${padX}px`

    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.84, 10)}px`
    }

    swapGif(currentStage.gif)

    blushCharacter()

    if (noClickCount >= noStages.length && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
        localStorage.setItem(STORAGE_KEYS.runawayUnlocked, 'true')
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
    if (runawayInitialized) return

    runawayInitialized = true
    yesBtn.classList.add('runaway-pulse')
    noBtn.style.display = 'inline-block'
    noBtn.style.visibility = 'visible'
    noBtn.style.opacity = '1'
    noBtn.style.fontSize = '0.95rem'
    document.addEventListener('mousemove', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway(event) {
    const safeMargin = 50
    const btnRect = noBtn.getBoundingClientRect()

    if (event?.type === 'mousemove') {
        const btnCenterX = btnRect.left + btnRect.width / 2
        const btnCenterY = btnRect.top + btnRect.height / 2
        const dx = event.clientX - btnCenterX
        const dy = event.clientY - btnCenterY
        const distance = Math.hypot(dx, dy)

        if (distance >= 100) return
    }

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const minX = safeMargin
    const minY = safeMargin
    const maxX = Math.max(minX, viewportW - btnW - safeMargin)
    const maxY = Math.max(minY, viewportH - btnH - safeMargin)

    const randomX = minX + Math.random() * (maxX - minX)
    const randomY = minY + Math.random() * (maxY - minY)

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


function initializeSmartExperience() {
    updateGreetingFromHistory()
    updateCountdownMessage()
    restoreRunawayStateFromHistory()
}

function updateGreetingFromHistory() {
    const previousVisits = Number(localStorage.getItem(STORAGE_KEYS.visitedCount) || '0')

    if (previousVisits > 0 && eyebrow) {
        const tease = REENTRY_MESSAGES[Math.floor(Math.random() * REENTRY_MESSAGES.length)]
        eyebrow.textContent = tease
    }

    localStorage.setItem(STORAGE_KEYS.visitedCount, String(previousVisits + 1))
}

function updateCountdownMessage() {
    if (!subtext) return

    const now = new Date()
    const currentYear = now.getFullYear()
    let target = new Date(currentYear, 1, 14)

    if (now > target) {
        target = new Date(currentYear + 1, 1, 14)
    }

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate())
    const dayDiff = Math.round((startOfTarget - startOfToday) / 86400000)

    if (dayDiff > 1) {
        subtext.textContent = `Faltan ${dayDiff} días para Valentine's... ⏳`
    } else if (dayDiff === 1) {
        subtext.textContent = '¡Falta solo 1 día! El tiempo se acaba... 🔥'
    } else {
        subtext.textContent = '¡Hoy es el día! ¿Qué esperas? ❤️'
    }
}

function restoreRunawayStateFromHistory() {
    const runawayWasUnlocked = localStorage.getItem(STORAGE_KEYS.runawayUnlocked) === 'true'
    if (!runawayWasUnlocked) return

    const finalStage = noStages[noStages.length - 1]
    noClickCount = noStages.length
    runawayEnabled = true
    noBtn.textContent = finalStage.message
    swapGif(finalStage.gif)
    enableRunaway()
    setTimeout(() => runAway(), 250)
}
