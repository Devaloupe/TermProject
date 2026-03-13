// --- UI & ANIMATION LOGIC ---
const title = document.getElementById('site-title');
const mainContent = document.getElementById('main-content');

let fillPercentage = 0;
const totalNotesToFill = 15;
const increment = 100 / totalNotesToFill; 
let isRevealed = false; 

function createNote() {
    const note = document.createElement('div');
    note.classList.add('note');

    const noteShapes = ['&#9833;', '&#9834;', '&#9835;', '&#9836;']; 
    note.innerHTML = noteShapes[Math.floor(Math.random() * noteShapes.length)];

    const colors = ['#d8b4e2', '#a64d79', '#674ea7', '#ffffff', '#ff00ff', '#8a2be2'];
    
    const leftPosition = Math.random() * 100;
    const animationDuration = Math.random() * 5 + 4; 
    const size = Math.random() * 20 + 12; 
    const color = colors[Math.floor(Math.random() * colors.length)]; 
    const opacity = Math.random() * 0.6 + 0.2; 

    note.style.left = `${leftPosition}vw`;
    note.style.animationDuration = `${animationDuration}s`;
    note.style.fontSize = `${size}px`;
    note.style.color = color;
    note.style.opacity = opacity;
    note.style.textShadow = `0 0 ${size / 2}px ${color}, 0 0 ${size}px ${color}`;

    document.body.appendChild(note);

    setTimeout(() => {
        note.remove();
    }, animationDuration * 1000);
}

// --- COLLISION DETECTION LOGIC ---
function checkCollisions() {
    if (isRevealed) return; 

    const titleRect = title.getBoundingClientRect();
    const notes = document.querySelectorAll('.note:not(.hit)');

    notes.forEach(note => {
        const noteRect = note.getBoundingClientRect();

        if (
            noteRect.bottom >= titleRect.top &&
            noteRect.top <= titleRect.bottom &&
            noteRect.right >= titleRect.left &&
            noteRect.left <= titleRect.right
        ) {
            note.classList.add('hit');
            note.style.animationPlayState = 'paused';
            setTimeout(() => note.remove(), 400);

            // Increase the fill percentage
            fillPercentage += increment;
            if (fillPercentage > 100) fillPercentage = 100;
            
            // Starts at 10% (very dark) and scales up by 40 to hit exactly 50% (bright neon) at the end
            const currentLightness = 10 + (fillPercentage * 0.4);
            
            title.style.setProperty('--fill-percent', `${fillPercentage}%`);
            title.style.setProperty('--fill-color', `hsl(265, 100%, ${currentLightness}%)`);

            if (fillPercentage >= 100) {
                isRevealed = true;
                triggerSiteReveal();
            }
        }
    });

    requestAnimationFrame(checkCollisions);
}

requestAnimationFrame(checkCollisions);

function triggerSiteReveal() {
    title.classList.add('glow-active');
    
    setTimeout(() => {
        title.classList.add('move-to-top');
        
        setTimeout(() => {
            document.body.style.overflow = 'auto'; 
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
        }, 1500);

    }, 1000); 
}

setInterval(createNote, 150);

// --- FORM HANDLING LOGIC ---
// Prevent the form from refreshing the page when clicking "Log In"
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stops the page reload
        console.log("Login button clicked! Ready to connect to backend.");
    });
}
