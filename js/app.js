// Varibles
const formAddTask = document.getElementById('form-add-task'),
      campTaskTitle = document.getElementById('task-title'),
      campTaskDesc = document.getElementById('task-desc'),
      btnAddtask = document.getElementById('btn-add-task'),
      tasksArea = document.getElementById('tasks-area');

// Eventos
campTaskTitle.addEventListener('blur', validateLength);
campTaskDesc.addEventListener('blur', validateLength);

campTaskTitle.addEventListener('input', toggleDisabled);
campTaskDesc.addEventListener('input', toggleDisabled);

// Cargar Tareas
window.addEventListener('load', loadTasksLS);

// Eliminar Tarea
tasksArea.addEventListener('click', deleteTask);

// Actualizar Tarea
tasksArea.addEventListener('click', updateTask);

// Al enviar el Formulario
formAddTask.addEventListener('submit', addTask);

// Sistema de IDS
let id = getId();

function getId() {
    datosLS = getLS();
    if(datosLS.length > 0) {
        const ids = datosLS.map(dato => {
            return dato.id
        })
        return (Math.max(...ids)) + 1;
    }else {
        return 1;
    }
}

// Funciones
function validateLength(e) {
    const camp = e.target;
    if(camp.value !== '') {
        camp.style.borderColor = 'lime';
    }else {
        camp.style.borderColor = 'red';
    }
}

function toggleDisabled(e) {
    if(campTaskTitle.value !== '' && campTaskDesc.value !== '') {
        btnAddtask.removeAttribute('disabled');
    }else {
        btnAddtask.setAttribute('disabled', true);
    }
}

// Añadir Tarea
function addTask(e) {
    // Prevenir el comportamiento por defecto del evento
    e.preventDefault();
    // Crear un div y añadirle clases
    const task = document.createElement('div');
    task.classList.add('task', 'card', 'card-body', 'd-block', 'shadow', 'mb-3');
    const taskContent = `
        <h2 class="card-title h5">${campTaskTitle.value}</h2>
        <p class="card-text">${campTaskDesc.value}</p>
        <a href="#" class="btn btn-danger delete" data-id="${id}"><i class="fa fa-trash-alt"></i> Eliminar</a>
        <a href="#" class="btn btn-warning update" data-id="${id}"><i class="fa fa-edit"></i> Actualizar</a>
    `;
    task.innerHTML = taskContent;

    // Insertar el div en el HTML
    tasksArea.appendChild(task);

    // Añadir tarea al LS
    addTaskLS(campTaskTitle.value, campTaskDesc.value, id);

    // Incrementar el ID
    id++;

    // Reset Del Formulario
    formAddTask.reset();
    campTaskTitle.style.borderColor = '';
    campTaskDesc.style.borderColor = '';
}

// Eliminar Tarea
function deleteTask(e) {
    if(e.target.classList.contains('delete')) {
        e.preventDefault();
        e.target.parentElement.remove();
        deleteTaskLS(e.target.dataset.id);
    }
}

// Actualizar Tarea
function updateTask(e) {
    if(e.target.classList.contains('update')) {
        e.preventDefault();
        e.target.parentElement.querySelector('.card-title').setAttribute('contenteditable', true);
        e.target.parentElement.querySelector('.card-text').setAttribute('contenteditable', true);
        e.target.classList.remove('update');
        e.target.classList.add('updateOk');
        e.target.innerHTML = '<i class="fa fa-check"></i> Listo';
    }else if(e.target.classList.contains('updateOk')) {
        e.preventDefault();
        e.target.parentElement.querySelector('.card-title').removeAttribute('contenteditable');
        e.target.parentElement.querySelector('.card-text').removeAttribute('contenteditable');
        e.target.classList.remove('updateOk');
        e.target.classList.add('update');
        e.target.innerHTML = '<i class="fa fa-edit"></i> Actualizar';

        // Actualizar en el Local Storage
        updateTaskLS(
            e.target.parentElement.querySelector('.card-title').textContent,
            e.target.parentElement.querySelector('.card-text').textContent,
            e.target.dataset.id
        );
    }
}

function updateTaskLS(title, desc, id) {
    const datosLS = getLS();
    datosLS.forEach(dato => {
        if(dato.id === Number(id)) {
            dato.title = title;
            dato.desc = desc;
        }
    });
    localStorage.setItem('tareas', JSON.stringify(datosLS));
}

function deleteTaskLS(id) {
    const datosLS = getLS();
    datosLS.forEach((dato, index) => {
        if(dato.id === Number(id)) {
            datosLS.splice(index, 1);
        }
    })
    localStorage.setItem('tareas', JSON.stringify(datosLS));
}

function loadTasksLS() {
    const datosLS = getLS();
    if(datosLS.length > 0) {
        datosLS.forEach(dato => {
            // Crear un div y añadirle clases
            const task = document.createElement('div');
            task.classList.add('task', 'card', 'card-body', 'd-block', 'shadow', 'mb-3');
            const taskContent = `
                <h2 class="card-title h5">${dato.title}</h2>
                <p class="card-text">${dato.desc}</p>
                <a href="#" class="btn btn-danger delete" data-id="${dato.id}"><i class="fa fa-trash-alt"></i> Eliminar</a>
                <a href="#" class="btn btn-warning update" data-id="${dato.id}"><i class="fa fa-edit"></i> Actualizar</a>
            `;
            task.innerHTML = taskContent;

            // Insertar el div en el HTML
            tasksArea.appendChild(task);
        })
    }
}

// Añadir Tarea al Local Storage
function addTaskLS(title, desc, id) {
    const datosLS = getLS();
    datosLS.push({
        title,
        desc,
        id
    });
    localStorage.setItem('tareas', JSON.stringify(datosLS));
}

// Obtener los Datos del Local Storage
function getLS() {
    const datos = localStorage.getItem('tareas');
    if(datos) {
        return JSON.parse(datos);
    }else {
        return [];
    }
}