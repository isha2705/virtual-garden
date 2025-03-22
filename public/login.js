const leafContainer = document.querySelector('.leaf-container');
const leafEmojis = ["🍃", "🌿", "🍂", "🍁", "☘️"];

function createLeaf() {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    leaf.style.left = Math.random() * 100 + 'vw';
    leaf.style.animationDuration = Math.random() * 3 + 5 + 's';
    leaf.style.fontSize = Math.random() * 10 + 20 + 'px';
    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
    leafContainer.appendChild(leaf);

    setTimeout(() => {
        leaf.remove();
    }, 8000);
}

setInterval(createLeaf, 300);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    // अगर यूजर पहले से लॉग्ड इन है तो डैशबोर्ड पर भेज दें
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
        window.location.replace('dashboard.html');
        return;
    }

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // बेसिक वैलिडेशन
        if (!email || !password) {
            showError('कृपया सभी फील्ड भरें');
            return;
        }

        // ईमेल वैलिडेशन
        if (!isValidEmail(email)) {
            showError('कृपया वैध ईमेल एड्रेस डालें');
            return;
        }

        try {
            // रजिस्टर्ड यूजर्स को लोकल स्टोरेज से लें
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // यूजर को ढूंढें और वेरिफाई करें
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // लॉगिन सफल
                loginSuccess(user);
            } else {
                showError('गलत ईमेल या पासवर्ड');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showError('लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        }
    });

    // एंटर की प्रेस करने पर लॉगिन करें
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    // एरर मैसेज दिखाने का फंक्शन
    function showError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
        
        // 3 सेकंड बाद एरर मैसेज हटा दें
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }

    // सफल लॉगिन पर क्या करना है
    function loginSuccess(user) {
        // यूजर डेटा को लोकल स्टोरेज में सेव करें
        localStorage.setItem('currentUser', JSON.stringify({
            fullName: user.fullName,
            email: user.email,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        }));

        // एनिमेटेड ट्रांजिशन के साथ डैशबोर्ड पर रीडायरेक्ट
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.replace('dashboard.html');
        }, 500);
    }

    // ईमेल वैलिडेशन फंक्शन
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

document.getElementById('loginEmail').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('loginPassword').focus();
    }
});

document.getElementById('loginPassword').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('loginBtn').click();
    }
});
