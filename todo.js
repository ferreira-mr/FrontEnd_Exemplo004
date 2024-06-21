document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('loggedInUser')) {
        window.location.href = 'index.html';
    } else {
        carregarTarefas();
        atualizarContadores();
    }
});

function adicionarTarefa() {
    const entradaTarefa = document.getElementById('entradaTarefa');
    const listaAFazer = document.getElementById('listaAFazer');
    const textoTarefa = entradaTarefa.value.trim();

    if (textoTarefa === '') {
        mostrarFeedback('Por favor, insira uma tarefa.', 'warning');
        return;
    }

    if (tarefaJaExiste(textoTarefa)) {
        mostrarFeedback('Esta tarefa já existe.', 'danger');
        return;
    }

    criarTarefa(listaAFazer, textoTarefa);
    entradaTarefa.value = '';
    salvarTarefas();
    mostrarFeedback('Tarefa adicionada com sucesso.', 'success');
}

function tarefaJaExiste(textoTarefa) {
    const todasTarefas = [...document.getElementById('listaAFazer').children, 
                         ...document.getElementById('listaEmProgresso').children, 
                         ...document.getElementById('listaConcluido').children];

    return todasTarefas.some(tarefa => tarefa.firstChild.textContent.trim() === textoTarefa);
}

function salvarTarefas() {
    const listaAFazer = document.getElementById('listaAFazer');
    const listaEmProgresso = document.getElementById('listaEmProgresso');
    const listaConcluido = document.getElementById('listaConcluido');
    const loggedInUser = localStorage.getItem('loggedInUser');

    const tarefas = {
        aFazer: [],
        emProgresso: [],
        concluido: []
    };

    listaAFazer.querySelectorAll('li').forEach(tarefa => {
        tarefas.aFazer.push(tarefa.firstChild.textContent.trim());
    });

    listaEmProgresso.querySelectorAll('li').forEach(tarefa => {
        tarefas.emProgresso.push(tarefa.firstChild.textContent.trim());
    });

    listaConcluido.querySelectorAll('li').forEach(tarefa => {
        tarefas.concluido.push(tarefa.firstChild.textContent.trim());
    });

    const users = JSON.parse(localStorage.getItem('users'));
    users[loggedInUser].tasks = tarefas;
    localStorage.setItem('users', JSON.stringify(users));
    atualizarContadores();
}

function carregarTarefas() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users'));
    const tarefas = users[loggedInUser].tasks;

    const listaAFazer = document.getElementById('listaAFazer');
    const listaEmProgresso = document.getElementById('listaEmProgresso');
    const listaConcluido = document.getElementById('listaConcluido');

    tarefas.aFazer.forEach(texto => criarTarefa(listaAFazer, texto));
    tarefas.emProgresso.forEach(texto => criarTarefa(listaEmProgresso, texto));
    tarefas.concluido.forEach(texto => criarTarefa(listaConcluido, texto, true));
}

function sair() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Moved functions from common.js

// Função para mostrar feedback
function mostrarFeedback(mensagem, tipo = 'success') {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = mensagem;
    feedbackElement.className = `alert alert-${tipo}`;
    feedbackElement.classList.remove('d-none');
    setTimeout(() => {
        feedbackElement.classList.add('d-none');
    }, 3000);
}

// Função para criar um elemento de tarefa
function criarTarefa(lista, texto, concluido = false) {
    const li = document.createElement('li');
    li.textContent = texto;
    li.className = 'list-group-item';

    const btnEditar = document.createElement('button');
    btnEditar.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    btnEditar.className = 'edit-btn';
    btnEditar.onclick = function(event) {
        event.stopPropagation();
        editarTarefa(li);
    };

    const btnExcluir = document.createElement('button');
    btnExcluir.innerHTML = '<i class="fas fa-trash"></i>';
    btnExcluir.className = 'delete-btn';
    btnExcluir.onclick = function(event) {
        event.stopPropagation();
        if (confirm('Você tem certeza que deseja excluir esta tarefa?')) {
            lista.removeChild(li);
            salvarTarefas();
            atualizarContadores();
            mostrarFeedback('Tarefa removida com sucesso.', 'success');
        }
    };

    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);
    li.onclick = function() {
        moverTarefa(li);
        salvarTarefas();
        atualizarContadores();
        mostrarFeedback('Tarefa movida com sucesso.', 'success');
    };

    if (concluido) {
        li.classList.add('completed');
    }

    lista.appendChild(li);
    atualizarContadores();
}

// Função para editar uma tarefa
function editarTarefa(tarefa) {
    const novoTexto = prompt('Edite a tarefa:', tarefa.firstChild.textContent);
    if (novoTexto !== null && novoTexto.trim() !== '') {
        tarefa.firstChild.textContent = novoTexto.trim();
        salvarTarefas();
        mostrarFeedback('Tarefa editada com sucesso.', 'success');
    }
}

// Função para mover uma tarefa entre listas
function moverTarefa(tarefa) {
    const listaAFazer = document.getElementById('listaAFazer');
    const listaEmProgresso = document.getElementById('listaEmProgresso');
    const listaConcluido = document.getElementById('listaConcluido');

    if (tarefa.parentElement.id === 'listaAFazer') {
        listaEmProgresso.appendChild(tarefa);
    } else if (tarefa.parentElement.id === 'listaEmProgresso') {
        listaConcluido.appendChild(tarefa);
        tarefa.classList.add('completed');
    } else if (tarefa.parentElement.id === 'listaConcluido') {
        listaAFazer.appendChild(tarefa);
        tarefa.classList.remove('completed');
    }
    salvarTarefas();
    atualizarContadores();
    mostrarFeedback('Tarefa movida com sucesso.', 'success');
}

// Função para atualizar contadores de tarefas
function atualizarContadores() {
    const contadorAFazer = document.getElementById('contadorAFazer');
    const contadorEmProgresso = document.getElementById('contadorEmProgresso');
    const contadorConcluido = document.getElementById('contadorConcluido');

    contadorAFazer.setAttribute('data-count', document.getElementById('listaAFazer').childElementCount);
    contadorEmProgresso.setAttribute('data-count', document.getElementById('listaEmProgresso').childElementCount);
    contadorConcluido.setAttribute('data-count', document.getElementById('listaConcluido').childElementCount);
}
