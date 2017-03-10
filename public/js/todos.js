var todosContainer = document.querySelector('#todos')
var todoItem = document.querySelector('#todoItem')
var todoButton = document.querySelector('#todoButton')
var categoryItem = document.querySelector('#categoryItem')
var dueDate = document.querySelector('#dueDate')
var categoryColor = document.querySelector('#categoryColor')
var datePickerUI 

getTodos()

todoItem.addEventListener('keypress', handleKeyPressOnTodoItem)
todoButton.addEventListener('click', addTodo)


    datepickerUI = new Pikaday({
        field: document.querySelector('#dueDate')
    })

todosContainer.addEventListener('click', handleClickOnCheckbox)

function handleKeyPressOnTodoItem(e) {
    if (e.key === 'Enter') {
        addTodo()
    }
}

function handleClickOnCheckbox(e) {
    if (e.target.type === 'checkbox') {
        toggleTodoComplete(e.target.getAttribute('data-id'), e.target.checked)
    }
}

function toggleTodoComplete(todoId, isComplete) {

    if (isComplete) {
        fetch('/api/v1/todos/' + todoId + '/complete')
        .then(getTodos)
    }
    
    else {
        fetch('/api/v1/todos/' + todoId + '/incomplete')
        .then(getTodos)
    }

}

function addTodo() {
    var todoTask = todoItem.value.trim()
    var category = categoryItem.value.trim()
    var dateValue = dueDate.value.trim()


    // Begin form validation
    if (todoTask !== '' && category !== '' && dateValue !== '') {
    
        todoItem.value = ''
        categoryItem.value = ''
        dueDate.value = ''  

        var body = {
            todo: todoTask,
            category: category,
            due_date: dateValue,
            completed: false
        }
        

        fetch('http://localhost:3000/api/v1/todos', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(getTodos)


        
    }
}

function getTodos() {
    fetch('http://localhost:3000/api/v1/todos')
        .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        loopTodos(response);
    })
}

function loopTodos(todos) {
    document.querySelector('#todos').innerHTML = ''
    todos.forEach(function(todo) {
        showTodos(todo)
    })
}

function showTodos(todo) {
    var labelCategory

    switch(todo.category) {
        case 'Work':
            labelCategory = 'green'
            break
        case 'Personal':
            labelCategory = 'salmon'
            break
        case 'Chores':
            labelCategory = 'blue'
            break
        case 'Bills':
            labelCategory = 'turquoise'
            break
        case 'Projects':
            labelCategory = 'sand'
            break
        default: 
            labelCategory = 'label-default'

    }
    var todoList = 
    
    `<li class="list-group-item"> 
        <div class="checkbox">
            <label>
                <input type="checkbox" data-id="${todo.id}" ${todo.completed === 'yes' ? 'checked' : ''}/>
                <span class="${todo.completed === 'yes' ? "done" : ''}">${todo.todo} </span>
                <span class="label ${labelCategory}">${todo.category}</span>
                <span class="label label-default label-date">${moment(todo.due_date).format('MM/DD/YYYY')}</span>
            </label>
        </div>
    
    </li>`

    todosContainer.innerHTML = todoList + todosContainer.innerHTML;

}
