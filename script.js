document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
    atualizarContadores();
});

function adicionarTarefa() {
    const entradaTarefa = document.getElementById('entradaTarefa');
    const listaAFazer = document.getElementById('listaAFazer');
    const textoTarefa = entradaTarefa.value.trim();

    if (textoTarefa === '') {
        alert('Por favor, insira uma tarefa.');
        return;
    }

    const li = document.createElement('li');
    li.textContent = textoTarefa;
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
        listaAFazer.removeChild(li);
        salvarTarefas();
        atualizarContadores();
    };

    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);
    li.onclick = function() {
        moverTarefa(li);
        salvarTarefas();
        atualizarContadores();
    };

    listaAFazer.appendChild(li);
    entradaTarefa.value = '';
    salvarTarefas();
    atualizarContadores();
}

function editarTarefa(tarefa) {
    const novoTexto = prompt('Edite a tarefa:', tarefa.firstChild.textContent);
    if (novoTexto !== null && novoTexto.trim() !== '') {
        tarefa.firstChild.textContent = novoTexto.trim();
        salvarTarefas();
    }
}

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
}

function salvarTarefas() {
    const listaAFazer = document.getElementById('listaAFazer');
    const listaEmProgresso = document.getElementById('listaEmProgresso');
    const listaConcluido = document.getElementById('listaConcluido');

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

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    atualizarContadores();
}

function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || {
        aFazer: [],
        emProgresso: [],
        concluido: []
    };

    const listaAFazer = document.getElementById('listaAFazer');
    const listaEmProgresso = document.getElementById('listaEmProgresso');
    const listaConcluido = document.getElementById('listaConcluido');

    tarefas.aFazer.forEach(texto => criarTarefa(listaAFazer, texto));
    tarefas.emProgresso.forEach(texto => criarTarefa(listaEmProgresso, texto));
    tarefas.concluido.forEach(texto => criarTarefa(listaConcluido, texto, true));
}

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
        lista.removeChild(li);
        salvarTarefas();
        atualizarContadores();
    };

    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);
    li.onclick = function() {
        moverTarefa(li);
        salvarTarefas();
        atualizarContadores();
    };

    if (concluido) {
        li.classList.add('completed');
    }

    lista.appendChild(li);
    atualizarContadores();
}

function atualizarContadores() {
    const contadorAFazer = document.getElementById('contadorAFazer');
    const contadorEmProgresso = document.getElementById('contadorEmProgresso');
    const contadorConcluido = document.getElementById('contadorConcluido');

    contadorAFazer.setAttribute('data-count', document.getElementById('listaAFazer').childElementCount);
    contadorEmProgresso.setAttribute('data-count', document.getElementById('listaEmProgresso').childElementCount);
    contadorConcluido.setAttribute('data-count', document.getElementById('listaConcluido').childElementCount);
}

