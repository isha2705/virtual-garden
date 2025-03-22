document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    
    // फॉलिंग लीव्स एनिमेशन
    const leafContainer = document.querySelector('.leaf-container');
    createFallingLeaves();

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // वैलिडेशन
        if (!fullName || !email || !password || !confirmPassword) {
            showError('कृपया सभी फील्ड भरें');
            return;
        }

        if (!isValidEmail(email)) {
            showError('कृपया वैध ईमेल एड्रेस डालें');
            return;
        }

        if (password.length < 6) {
            showError('पासवर्ड कम से कम 6 अक्षर का होना चाहिए');
            return;
        }

        if (password !== confirmPassword) {
            showError('पासवर्ड मैच नहीं कर रहे हैं');
            return;
        }

        try {
            // मौजूदा यूजर्स को लोकल स्टोरेज से लें
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // चेक करें कि ईमेल पहले से रजिस्टर्ड तो नहीं है
            if (users.some(user => user.email === email)) {
                showError('यह ईमेल पहले से रजिस्टर्ड है');
                return;
            }

            // नया यूजर बनाएं
            const newUser = {
                fullName,
                email,
                password, // वास्तविक एप्लिकेशन में पासवर्ड को हैश करें
                createdAt: new Date().toISOString()
            };

            // यूजर को लोकल स्टोरेज में सेव करें
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // सफल रजिस्ट्रेशन एनिमेशन
            document.body.style.opacity = '0';
            
            // सक्सेस मैसेज दिखाएं और लॉगिन पेज पर रीडायरेक्ट करें
            setTimeout(() => {
                alert('रजिस्ट्रेशन सफल! कृपया लॉगिन करें।');
                window.location.replace('login.html');
            }, 500);

        } catch (error) {
            console.error('Error during registration:', error);
            showError('रजिस्ट्रेशन में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        }
    });

    // एरर मैसेज दिखाने का फंक्शन
    function showError(message) {
        registerError.textContent = message;
        registerError.style.display = 'block';
        
        // 3 सेकंड बाद एरर मैसेज हटा दें
        setTimeout(() => {
            registerError.style.display = 'none';
        }, 3000);
    }

    // ईमेल वैलिडेशन फंक्शन
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // फॉलिंग लीव्स एनिमेशन फंक्शन
    function createFallingLeaves() {
        const colors = ['#4CAF50', '#45a049', '#2c3e50'];
        
        function createLeaf() {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            
            const size = Math.random() * 20 + 10;
            const startPosition = Math.random() * window.innerWidth;
            const delay = Math.random() * 5;
            const rotation = Math.random() * 360;
            
            leaf.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${startPosition}px;
                animation: fall ${Math.random() * 10 + 5}s linear ${delay}s infinite;
                transform: rotate(${rotation}deg);
            `;
            
            leafContainer.appendChild(leaf);
            
            // 20 सेकंड बाद लीफ को हटा दें
            setTimeout(() => {
                leaf.remove();
            }, 20000);
        }

        // हर 300ms में एक नया लीफ बनाएं
        setInterval(createLeaf, 300);
    }
});
