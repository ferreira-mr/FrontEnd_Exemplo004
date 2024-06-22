document.addEventListener('DOMContentLoaded', () => {
    carregarUsuarios();
    
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;

        const hashedPassword = CryptoJS.SHA256(newPassword).toString();
        const users = JSON.parse(localStorage.getItem('users'));
        
        if (users[newUsername]) {
            mostrarFeedback('Usuário já existe.', 'danger');
        } else {
            users[newUsername] = { password: hashedPassword, tasks: [] };
            localStorage.setItem('users', JSON.stringify(users));
            mostrarFeedback('Usuário registrado com sucesso.', 'success');
            registerForm.reset();
            carregarUsuarios();
        }
    });
});

function carregarUsuarios() {
    const users = JSON.parse(localStorage.getItem('users'));
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    for (const username in users) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>${username}</span>
            <div>
                <button class="btn btn-warning btn-sm mr-2" onclick="resetarSenha('${username}')" title="Resetar Senha">
                    <i class="fas fa-redo"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${username}')" title="Excluir Usuário">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        userList.appendChild(li);
    }
}

function resetarSenha(username) {
    if (confirm(`Você tem certeza que deseja resetar a senha do usuário ${username}?`)) {
        const users = JSON.parse(localStorage.getItem('users'));
        const newPassword = '123456';
        users[username].password = CryptoJS.SHA256(newPassword).toString();
        localStorage.setItem('users', JSON.stringify(users));
        mostrarFeedback(`Senha do usuário ${username} resetada para ${newPassword}`, 'success');
    }
}

function excluirUsuario(username) {
    if (confirm(`Você tem certeza que deseja excluir o usuário ${username}?`)) {
        const users = JSON.parse(localStorage.getItem('users'));
        delete users[username];
        localStorage.setItem('users', JSON.stringify(users));
        carregarUsuarios();
        mostrarFeedback(`Usuário ${username} excluído com sucesso.`, 'success');
    }
}

function sair() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

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
