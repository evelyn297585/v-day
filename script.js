 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
index 9459b664fa0a576c49cd9d09d7293c0c54597907..ac000ef0c3ff67ae0cb56c391e07c497d625cffd 100644
--- a/script.js
+++ b/script.js
@@ -1,145 +1,316 @@
-const gifStages = [
-    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
-    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
-    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
-    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
-    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
-    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
-    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
-    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
-]
+const yesBtn = document.getElementById('yes-btn')
+const noBtn = document.getElementById('no-btn')
+const catGif = document.getElementById('cat-gif')
+const gifWrap = document.getElementById('gif-wrap')
+const teaseToast = document.getElementById('tease-toast')
+const eyebrow = document.querySelector('.eyebrow')
+const subtext = document.querySelector('.subtext')
+const overlay = document.getElementById('celebration-overlay')
 
-const noMessages = [
-    "No",
-    "Are you positive? 🤔",
-    "Pookie please... 🥺",
-    "If you say no, I will be really sad...",
-    "I will be very sad... 😢",
-    "Please??? 💔",
-    "Don't do this to me...",
-    "Last chance! 😭",
-    "You can't catch me anyway 😜"
+const noStages = [
+    {
+        message: 'No 🙄',
+        gif: 'https://media.tenor.com/Z5xQ0M9YYjUAAAAj/cat-typing.gif'
+    },
+    {
+        message: 'Like... really? 🤨',
+        gif: 'https://media.tenor.com/rsQaL4uW4i8AAAAj/angry-cat.gif'
+    },
+    {
+        message: 'What is going on with you? 🧐',
+        gif: 'https://media.tenor.com/q8u2JfPjQ8AAAAAj/cat-confused.gif'
+    },
+    {
+        message: 'Is it that you dont see the YES option? 👀',
+        gif: 'https://media.tenor.com/X5u9MXX6gYAAAAAj/cat-looking.gif'
+    },
+    {
+        message: 'Questioning my life choices 😭',
+        gif: 'https://media.tenor.com/8sW7P9J0A1kAAAAj/crying-cat.gif'
+    },
+    {
+        message: 'Last no before chaos 😈',
+        gif: 'https://media.tenor.com/3NIPaG8M4dcAAAAj/evil-cat.gif'
+    },
+    {
+        message: 'Okay… then who is SHEEEE? 🔍👀',
+        gif: 'https://media.tenor.com/6Q9gbF5x8eQAAAAj/cat-investigating.gif'
+    },
+    {
+        message: 'Say yes and I’ll pretend this never happened 😌💞',
+        gif: 'https://media.tenor.com/H4K7n6tN6QAAAAAj/cute-cat-begging.gif'
+    },
+    {
+        message: "Well, you're stuck with me now 😏❤️",
+        gif: 'https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif'
+    }
 ]
 
-const yesTeasePokes = [
-    "try saying no first... I bet you want to know what happens 😏",
-    "go on, hit no... just once 👀",
-    "you're missing out 😈",
-    "click no, I dare you 😏"
+const REENTRY_MESSAGES = [
+    'Hola de nuevo... ¿todavía pensándolo? 😏',
+    "Back again? I knew you couldn't resist... 💋"
 ]
 
-let yesTeasedCount = 0
+const STORAGE_KEYS = {
+    visitedCount: 'vday_visited_count',
+    runawayUnlocked: 'vday_runaway_unlocked'
+}
 
 let noClickCount = 0
 let runawayEnabled = false
-let musicPlaying = true
+let runawayInitialized = false
+let toastTimeout
 
-const catGif = document.getElementById('cat-gif')
-const yesBtn = document.getElementById('yes-btn')
-const noBtn = document.getElementById('no-btn')
-const music = document.getElementById('bg-music')
-
-// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
-music.muted = true
-music.volume = 0.3
-music.play().then(() => {
-    music.muted = false
-}).catch(() => {
-    // Fallback: unmute on first interaction
-    document.addEventListener('click', () => {
-        music.muted = false
-        music.play().catch(() => {})
-    }, { once: true })
-})
+initializeSmartExperience()
 
-function toggleMusic() {
-    if (musicPlaying) {
-        music.pause()
-        musicPlaying = false
-        document.getElementById('music-toggle').textContent = '🔇'
-    } else {
-        music.muted = false
-        music.play()
-        musicPlaying = true
-        document.getElementById('music-toggle').textContent = '🔊'
+noBtn.addEventListener('mouseenter', () => {
+    if (!runawayEnabled) {
+        gifWrap.classList.add('sad')
+        nudgeNoButton()
     }
-}
+})
+
+noBtn.addEventListener('mouseleave', () => {
+    gifWrap.classList.remove('sad')
+})
+
+yesBtn.addEventListener('mouseenter', () => {
+    gifWrap.classList.add('happy')
+    blushCharacter()
+})
+
+yesBtn.addEventListener('mouseleave', () => {
+    gifWrap.classList.remove('happy')
+})
 
 function handleYesClick() {
-    if (!runawayEnabled) {
-        // Tease her to try No first
-        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
-        yesTeasedCount++
-        showTeaseMessage(msg)
-        return
-    }
-    window.location.href = 'yes.html'
-}
+    burstHearts()
+    showTeaseMessage('Best decision ever. Knew it 💘')
+    bounceCharacter()
+
+    yesBtn.disabled = true
+    noBtn.disabled = true
 
-function showTeaseMessage(msg) {
-    let toast = document.getElementById('tease-toast')
-    toast.textContent = msg
-    toast.classList.add('show')
-    clearTimeout(toast._timer)
-    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
+    setTimeout(() => {
+        window.location.href = 'yes.html'
+    }, 1400)
 }
 
 function handleNoClick() {
-    noClickCount++
-
-    // Cycle through guilt-trip messages
-    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
-    noBtn.textContent = noMessages[msgIndex]
-
-    // Grow the Yes button bigger each time
-    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
-    yesBtn.style.fontSize = `${currentSize * 1.35}px`
-    const padY = Math.min(18 + noClickCount * 5, 60)
-    const padX = Math.min(45 + noClickCount * 10, 120)
-    yesBtn.style.padding = `${padY}px ${padX}px`
-
-    // Shrink No button to contrast
-    if (noClickCount >= 2) {
-        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
-        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
+    if (runawayEnabled) {
+        showTeaseMessage('Nice try 😌')
+        runAway()
+        return
+    }
+
+    const stageIndex = Math.min(noClickCount, noStages.length - 1)
+    const currentStage = noStages[stageIndex]
+
+    noBtn.textContent = currentStage.message
+
+    noClickCount += 1
+
+    if (noClickCount <= noStages.length) {
+        const yesSize = parseFloat(getComputedStyle(yesBtn).fontSize)
+        const noSize = parseFloat(getComputedStyle(noBtn).fontSize)
+        yesBtn.style.fontSize = `${Math.min(yesSize * 1.08, 56)}px`
+        noBtn.style.fontSize = `${Math.max(noSize * 0.84, 10)}px`
     }
 
-    // Swap cat GIF through stages
-    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
-    swapGif(gifStages[gifIndex])
+    swapGif(currentStage.gif)
+    blushCharacter()
 
-    // Runaway starts at click 5
-    if (noClickCount >= 5 && !runawayEnabled) {
+    if (noClickCount >= noStages.length && !runawayEnabled) {
         enableRunaway()
         runawayEnabled = true
+        localStorage.setItem(STORAGE_KEYS.runawayUnlocked, 'true')
+        showTeaseMessage('Oops. You unlocked RUNAWAY mode 💨')
     }
 }
 
 function swapGif(src) {
     catGif.style.opacity = '0'
     setTimeout(() => {
         catGif.src = src
         catGif.style.opacity = '1'
-    }, 200)
+    }, 170)
+}
+
+function blushCharacter() {
+    gifWrap.classList.add('blushing')
+    setTimeout(() => gifWrap.classList.remove('blushing'), 550)
+}
+
+function bounceCharacter() {
+    catGif.style.transform = 'translateY(-8px) scale(1.04)'
+    setTimeout(() => {
+        catGif.style.transform = 'translateY(0) scale(1)'
+    }, 220)
 }
 
 function enableRunaway() {
-    noBtn.addEventListener('mouseover', runAway)
+    if (runawayInitialized) return
+
+    runawayInitialized = true
+    yesBtn.classList.add('runaway-pulse')
+    noBtn.style.display = 'inline-block'
+    noBtn.style.visibility = 'visible'
+    noBtn.style.opacity = '1'
+    noBtn.style.fontSize = '0.95rem'
+    document.addEventListener('mousemove', runAway)
     noBtn.addEventListener('touchstart', runAway, { passive: true })
 }
 
-function runAway() {
-    const margin = 20
+function runAway(event) {
+    const safeMargin = 50
+    const btnRect = noBtn.getBoundingClientRect()
+
+    if (event?.type === 'mousemove') {
+        const btnCenterX = btnRect.left + btnRect.width / 2
+        const btnCenterY = btnRect.top + btnRect.height / 2
+        const dx = event.clientX - btnCenterX
+        const dy = event.clientY - btnCenterY
+        const distance = Math.hypot(dx, dy)
+
+        if (distance >= 100) return
+    }
+
+    const viewportW = window.innerWidth
+    const viewportH = window.innerHeight
     const btnW = noBtn.offsetWidth
     const btnH = noBtn.offsetHeight
-    const maxX = window.innerWidth - btnW - margin
-    const maxY = window.innerHeight - btnH - margin
+    const minX = safeMargin
+    const minY = safeMargin
+    const maxX = Math.max(minX, viewportW - btnW - safeMargin)
+    const maxY = Math.max(minY, viewportH - btnH - safeMargin)
 
-    const randomX = Math.random() * maxX + margin / 2
-    const randomY = Math.random() * maxY + margin / 2
+    const randomX = minX + Math.random() * (maxX - minX)
+    const randomY = minY + Math.random() * (maxY - minY)
 
     noBtn.style.position = 'fixed'
     noBtn.style.left = `${randomX}px`
     noBtn.style.top = `${randomY}px`
     noBtn.style.zIndex = '50'
 }
+
+function nudgeNoButton() {
+    const x = (Math.random() * 10 - 5).toFixed(1)
+    const y = (Math.random() * 6 - 3).toFixed(1)
+    noBtn.style.transform = `translate(${x}px, ${y}px)`
+    setTimeout(() => {
+        if (!runawayEnabled) noBtn.style.transform = 'translate(0, 0)'
+    }, 140)
+}
+
+function burstHearts() {
+    const hearts = ['💖', '💕', '💗', '💘', '✨']
+    for (let i = 0; i < 16; i++) {
+        const heart = document.createElement('span')
+        heart.className = 'burst-heart'
+        heart.textContent = hearts[i % hearts.length]
+        heart.style.left = '50%'
+        heart.style.top = '56%'
+        heart.style.setProperty('--dx', `${(Math.random() * 260 - 130).toFixed(0)}px`)
+        heart.style.setProperty('--dy', `${(-40 - Math.random() * 180).toFixed(0)}px`)
+        overlay.appendChild(heart)
+        setTimeout(() => heart.remove(), 900)
+    }
+}
+
+function initializeSmartExperience() {
+    updateGreetingFromHistory()
+    updateCountdownMessage()
+    restoreRunawayStateFromHistory()
+}
+
+function updateGreetingFromHistory() {
+    const previousVisits = Number(localStorage.getItem(STORAGE_KEYS.visitedCount) || '0')
+
+    if (previousVisits > 0 && eyebrow) {
+        const tease = REENTRY_MESSAGES[Math.floor(Math.random() * REENTRY_MESSAGES.length)]
+        eyebrow.textContent = tease
+    }
+
+    localStorage.setItem(STORAGE_KEYS.visitedCount, String(previousVisits + 1))
+}
+
+function updateCountdownMessage() {
+    if (!subtext) return
+
+    const now = new Date()
+    const currentYear = now.getFullYear()
+    let target = new Date(currentYear, 1, 14)
+
+    if (now > target) {
+        target = new Date(currentYear + 1, 1, 14)
+    }
+
+    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
+    const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate())
+    const dayDiff = Math.round((startOfTarget - startOfToday) / 86400000)
+
+    if (dayDiff > 1) {
+        subtext.textContent = `Faltan ${dayDiff} días para Valentine's... ⏳`
+    } else if (dayDiff === 1) {
+        subtext.textContent = '¡Falta solo 1 día! El tiempo se acaba... 🔥'
+    } else {
+        subtext.textContent = '¡Hoy es el día! ¿Qué esperas? ❤️'
+    }
+}
+
+function restoreRunawayStateFromHistory() {
+    const runawayWasUnlocked = localStorage.getItem(STORAGE_KEYS.runawayUnlocked) === 'true'
+    if (!runawayWasUnlocked) return
+
+    const finalStage = noStages[noStages.length - 1]
+    noClickCount = noStages.length
+    runawayEnabled = true
+    noBtn.textContent = finalStage.message
+    swapGif(finalStage.gif)
+    enableRunaway()
+    setTimeout(() => runAway(), 250)
+}
+
+function showTeaseMessage(message) {
+    clearTimeout(toastTimeout)
+    teaseToast.textContent = message
+    teaseToast.classList.add('show')
+
+    toastTimeout = setTimeout(() => {
+        teaseToast.classList.remove('show')
+    }, 1200)
+}
+
+const bgMusic = document.getElementById('bg-music')
+const musicToggle = document.getElementById('music-toggle')
+let musicPlaying = false
+
+window.addEventListener('load', () => {
+    setTimeout(playMusic, 500)
+})
+
+document.addEventListener('click', () => {
+    if (!musicPlaying) {
+        playMusic()
+    }
+}, { once: true })
+
+function playMusic() {
+    bgMusic.muted = false
+    bgMusic.play().then(() => {
+        musicPlaying = true
+        musicToggle.textContent = '🔊'
+    }).catch(() => {
+        musicToggle.textContent = '🔇'
+    })
+}
+
+function toggleMusic() {
+    if (musicPlaying) {
+        bgMusic.pause()
+        musicPlaying = false
+        musicToggle.textContent = '🔇'
+    } else {
+        playMusic()
+    }
+}
 
EOF
)
