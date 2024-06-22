document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    const adminUsername = 'admin';
    const adminPasswordHash = CryptoJS.SHA256('admin').toString();

    if (!localStorage.getItem('users')) {
        const users = {
            [adminUsername]: {
                password: adminPasswordHash,
                tasks: []
            }
        };
        localStorage.setItem('users', JSON.stringify(users));
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const hashedPassword = CryptoJS.SHA256(password).toString();
        const users = JSON.parse(localStorage.getItem('users'));

        if (users[username] && users[username].password === hashedPassword) {
            localStorage.setItem('loggedInUser', username);
            if (username === adminUsername) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'todo.html';
            }
        } else {
            mostrarFeedback('Login falhou. Usuário ou senha incorretos.', 'danger');
        }
    });
});

function mostrarFeedback(mensagem, tipo = 'success') {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = mensagem;
    feedbackElement.className = `alert alert-${tipo} show`;
    feedbackElement.classList.remove('d-none');
    setTimeout(() => {
        feedbackElement.classList.add('hide');
        setTimeout(() => {
            feedbackElement.classList.remove('show', 'hide');
            feedbackElement.classList.add('d-none');
        }, 500);
    }, 3000);
}
