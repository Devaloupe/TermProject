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

            fillPercentage += increment;
            if (fillPercentage > 100) fillPercentage = 100;
            
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

// --- TAB SWITCHING LOGIC ---
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');

    // Clear any messages when switching
    document.getElementById('login-message').textContent = '';
    document.getElementById('signup-message').textContent = '';

    if (tab === 'login') {
        loginForm.classList.remove('hidden-form');
        signupForm.classList.add('hidden-form');
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
    } else {
        signupForm.classList.remove('hidden-form');
        loginForm.classList.add('hidden-form');
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

// --- HELPER: Show message under form ---
function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = `form-message ${type}`; // 'error' or 'success'
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                showMessage('login-message', '✓ Logged in! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html'; // redirect after login
                }, 1000);
            } else {
                showMessage('login-message', data.message || 'Login failed.', 'error');
            }
        } catch (err) {
            showMessage('login-message', 'Could not connect to server.', 'error');
        }
    });
}

// --- SIGNUP LOGIC ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        // Check passwords match before sending to server
        if (password !== confirm) {
            showMessage('signup-message', 'Passwords do not match.', 'error');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                showMessage('signup-message', '✓ Account created! You can now log in.', 'success');
                setTimeout(() => {
                    switchTab('login'); // Switch to login tab after signup
                }, 1500);
            } else {
                showMessage('signup-message', data.message || 'Signup failed.', 'error');
            }
        } catch (err) {
            showMessage('signup-message', 'Could not connect to server.', 'error');
        }
    });
}