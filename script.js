document.addEventListener('DOMContentLoaded', function () {
    const todoColumn = document.querySelector('.column.todo');
    const doingColumn = document.querySelector('.column.doing');
    const doneColumn = document.querySelector('.column.done');
    const taskList = document.querySelector('.list-view');
    const modal = document.querySelector('.modal');
    const toggleViewButton = document.getElementById('toggle-view');
    const taskForm = document.getElementById('task-form');
    const body = document.body;
    const darkModeButton = document.getElementById('toggle-view');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentTaskId = null;

    darkModeButton.addEventListener('click', function () {

        body.classList.toggle('dark-mode');
    });

    function renderTasks() {
        todoColumn.innerHTML = '';
        doingColumn.innerHTML = '';
        doneColumn.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            if (task.status === 'todo') {
                todoColumn.appendChild(taskElement);
            } else if (task.status === 'doing') {
                doingColumn.appendChild(taskElement);
            } else {
                doneColumn.appendChild(taskElement);
            }
        });

        
        todoColumn.classList.toggle('empty', todoColumn.children.length === 0);
        doingColumn.classList.toggle('empty', doingColumn.children.length === 0);
        doneColumn.classList.toggle('empty', doneColumn.children.length === 0);
    }

    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <div>Title: ${task.title}</div>
            <div>Description: ${task.description || 'N/A'}</div>
            <div>Status: ${task.status}</div>
            <div>Due Date: ${formatDueDate(task.dueDate)}</div>
            <input type="checkbox" class="complete-checkbox" data-id="${task.id}" ${task.status === 'done' ? 'checked' : ''}> Complete
            <button class="edit-btn" data-id="${task.id}">Edit</button>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        taskElement.classList.toggle('completed', task.status === 'done');
        taskElement.addEventListener('click', handleTaskClick);
        return taskElement;
    }

    function formatDueDate(dueDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dueDate).toLocaleDateString(undefined, options);
    }


    function handleTaskClick(event) {
        const taskId = event.target.dataset.id;
        const task = tasks.find(task => task.id === taskId);

        if (event.target.classList.contains('edit-btn')) {
            showModal(task);
        } else if (event.target.classList.contains('delete-btn')) {
            const confirmDelete = confirm('Are you sure you want to delete this task?');
            if (confirmDelete) {
                tasks = tasks.filter(task => task.id !== taskId);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            }
        }
    }

    function sortTasks() {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        renderTasks();
    }
    document.getElementById('sort-tasks').addEventListener('click', sortTasks);


    function showModal(task) {
        currentTaskId = task.id;
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description || '';
        document.getElementById('status').value = task.status;
        document.getElementById('due-date').valueAsDate = new Date(task.dueDate);

        modal.style.display = 'block';
    }
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <div>Title: ${task.title}</div>
            <div>Description: ${task.description || 'N/A'}</div>
            <div>Status: ${task.status}</div>
            <div>Due Date: ${formatDueDate(task.dueDate)}</div>
            <input type="checkbox" class="complete-checkbox" data-id="${task.id}" ${task.status === 'done' ? 'checked' : ''}> Complete
            <button class="edit-btn" data-id="${task.id}">Edit</button>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        taskElement.classList.toggle('completed', task.status === 'done');
        taskElement.addEventListener('click', handleTaskClick);
        return taskElement;
    }

    function handleTaskClick(event) {
        const taskId = event.target.dataset.id;
        const task = tasks.find(task => task.id === taskId);

        if (event.target.classList.contains('complete-checkbox')) {
            
            task.status = event.target.checked ? 'done' : 'todo';
        } else if (event.target.classList.contains('edit-btn')) {
            showModal(task);
        } else if (event.target.classList.contains('delete-btn')) {
          
            const confirmDelete = confirm('Are you sure you want to delete this task?');
            if (confirmDelete) {
                tasks = tasks.filter(task => task.id !== taskId);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            }
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }




    document.getElementById('sort-tasks').addEventListener('click', function () {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        renderTasks();
    });

    document.getElementById('delete-completed').addEventListener('click', function (event) {
        event.preventDefault();
        deleteCompletedTasks();
    });

    function deleteCompletedTasks() {
        const confirmDelete = confirm('Are you sure you want to delete all completed tasks?');
        if (confirmDelete) {
            tasks = tasks.filter(task => task.status !== 'done');
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }

   
    document.getElementById('task-form').addEventListener('click', function (event) {
        event.stopPropagation();
    });


    function toggleView() {
        taskList.classList.toggle('list-view');
    }

    function handleSubmit(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const status = document.getElementById('status').value;
        const dueDate = document.getElementById('due-date').value;

        if (currentTaskId) {
          
            
            const existingTaskIndex = tasks.findIndex(task => task.id === currentTaskId);
            tasks[existingTaskIndex] = {
                id: currentTaskId,
                title,
                description,
                status,
                dueDate
            };
        } else {
            
            const newTask = {
                id: generateUniqueId(),
                title,
                description,
                status,
                dueDate
            };
            tasks.push(newTask);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();

    }

    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    renderTasks();

    
    toggleViewButton.addEventListener('click', toggleView);
    taskForm.addEventListener('submit', handleSubmit);
});
