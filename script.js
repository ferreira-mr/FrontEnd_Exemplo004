document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
    atualizarContadores();
});

function adicionarTarefa() {
    const entradaTarefa = document.getElementById('entradaTarefa');
    const listaAFazer = document.getElementById('listaAFazer');
    const textoTarefa = entradaTarefa.value.trim();

    if (textoTarefa === '') {
        mostrarFeedback('Por favor, insira uma tarefa.', 'warning');
        return;
    }

    criarTarefa(listaAFazer, textoTarefa);
    entradaTarefa.value = '';
    salvarTarefas();
    mostrarFeedback('Tarefa adicionada com sucesso.', 'success');
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
