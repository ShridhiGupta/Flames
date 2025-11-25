document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const predictBtn = document.getElementById('predictBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const inputSection = document.getElementById('inputSection');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    const gameBox = document.getElementById('gameBox');

    // FLAMES relationships
    const relationships = {
        'F': 'Friends',
        'L': 'Love',
        'A': 'Affection',
        'M': 'Marriage',
        'E': 'Enemies',
        'S': 'Siblings'
    };

    // Event Listeners
    predictBtn.addEventListener('click', calculateFlames);
    playAgainBtn.addEventListener('click', resetGame);

    function calculateFlames() {
        const name1 = name1Input.value.trim();
        const name2 = name2Input.value.trim();

        // Validate input
        if (!name1 || !name2) {
            showError("Please enter both names!");
            return;
        }

        if (name1 === name2) {
            showError("Please enter two different names!");
            return;
        }

        // Show loading animation
        showLoadingAnimation()
            .then(() => {
                const result = getFlamesResult(name1, name2);
                showResult(result);
            });
    }

    // Java FLAMES logic implemented in JavaScript
    function getFlamesResult(name1, name2) {
        // Remove spaces and convert to lowercase
        const s1 = name1.replace(/\s+/g, '').toLowerCase();
        const s2 = name2.replace(/\s+/g, '').toLowerCase();
        
        // Convert to arrays for marking matched characters
        const a = s1.split('');
        const b = s2.split('');
        
        let count = 0;
        
        // Cancel out common characters
        for (let i = 0; i < a.length; i++) {
            if (a[i] === '0') continue;
            for (let j = 0; j < b.length; j++) {
                if (b[j] === '0') continue;
                
                if (a[i] === b[j]) {
                    // Mark as used
                    a[i] = '0';
                    b[j] = '0';
                    break;
                }
            }
        }
        
        // Count leftover characters
        for (const c of a) if (c !== '0') count++;
        for (const c of b) if (c !== '0') count++;
        
        // FLAMES logic
        let flames = 'FLAMES';
        
        while (flames.length > 1) {
            const n = flames.length;
            let idx = (count % n) - 1;
            
            if (idx >= 0) {
                flames = flames.substring(idx + 1) + flames.substring(0, idx);
            } else {
                flames = flames.substring(0, n - 1);
            }
        }
        
        return flames.charAt(0);
    }

    async function showLoadingAnimation() {
        inputSection.style.display = 'none';
        resultSection.style.display = 'block';
        resultContent.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Calculating your relationship...</p>
            </div>
        `;
        
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    function showResult(flamesLetter) {
        const relationship = relationships[flamesLetter];
        const name1 = name1Input.value.trim();
        const name2 = name2Input.value.trim();
        
        resultContent.innerHTML = `
            <div class="result-container">
                <div class="names-container">
                    <div class="name-box">${name1}</div>
                    <div class="heart">❤️</div>
                    <div class="name-box">${name2}</div>
                </div>
                
                <div class="flames-container">
                    ${'FLAMES'.split('').map(letter => `
                        <div class="flame-letter ${letter === flamesLetter ? 'active' : ''}">
                            ${letter}
                        </div>
                    `).join('')}
                </div>
                
                <div class="relationship-result">
                    <div class="relationship-label">Your Relationship Status:</div>
                    <div class="relationship-name">${relationship}</div>
                    <div class="relationship-emoji">${getRelationshipEmoji(relationship)}</div>
                </div>
            </div>
        `;
        
        // Trigger confetti effect
        triggerConfetti();
    }

    function resetGame() {
        resultSection.style.display = 'none';
        inputSection.style.display = 'block';
        resultContent.innerHTML = '';
        name1Input.value = '';
        name2Input.value = '';
        name1Input.focus();
        
        document.querySelectorAll('.confetti').forEach(el => el.remove());
    }

    function getRelationshipEmoji(relationship) {
        const emojis = {
            'Friends': '👬',
            'Love': '💑',
            'Affection': '😊',
            'Marriage': '💍',
            'Enemies': '😠',
            'Siblings': '👨‍👧‍👦'
        };
        return emojis[relationship] || '✨';
    }

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        gameBox.insertBefore(errorElement, inputSection);
        
        setTimeout(() => {
            errorElement.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            errorElement.classList.remove('show');
            setTimeout(() => errorElement.remove(), 300);
        }, 3000);
    }

    function triggerConfetti() {
        // Simple confetti effect
        const colors = ['#ff6b6b', '#ff8e8e', '#ffb3b3', '#ffd8d8', '#ffffff'];
        const container = document.querySelector('.result-container');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.setProperty('--random-rotation', Math.random() * 360 + 'deg');
            confetti.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'vw');
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
});