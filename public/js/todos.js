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
    if (e.target.checkbox === 'checkbox') {
        toggleTodoComplete(e.target.getAttribute('data-id'), e.target.checked)
    }
}

function toggleTodoComplete(todoId, isComplete) {

    if (isComplete) {
        fetch('/api/v1/todos/' + todoId + '/complete')
    }
    
    else {
        fetch('/api/v1/todos/' + todoId + '/incomplete')
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
        .then(showTodos)
            // .then(getTodos)


        
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
    todos.forEach(function(todo) {
        showTodos(todo)
    })
}

function showTodos(todo) {
    var categoryColor = document.querySelector('#categoryColor')
    var todoList = 
    `
    <li class="list-group-item"> 
        <div class="checkbox">
            <label>
                <input type="checkbox" data-id="${todo.id}"/>
                ${todo.todo} 
                <span class="label label-default" id="categoryColor">${todo.category}</span>
                <span class="label label-default">${moment(todo.due_date).format('MM/DD/YYYY')}</span>
            </label>
        </div>
    
    </li>`

    todosContainer.innerHTML = todoList + todosContainer.innerHTML;

    if (document.querySelector('#categoryColor').innerText === 'Personal') {
        document.querySelector('#categoryColor').classList.remove('label-default')
        document.querySelector('#categoryColor').classList.add('label-danger')
    }

    else if (document.querySelector('#categoryColor').innerText === 'Work') {
        document.querySelector('#categoryColor').classList.remove('label-default')
        document.querySelector('#categoryColor').classList.add('label-warning')
    }

    else if (document.querySelector('#categoryColor').innerText === 'Projects') {
        document.querySelector('#categoryColor').classList.remove('label-default')
        document.querySelector('#categoryColor').classList.add('label-primary')
    }

    else if (document.querySelector('#categoryColor').innerText === 'Bills') {
        document.querySelector('#categoryColor').classList.remove('label-default')
        document.querySelector('#categoryColor').classList.add('label-success')
    }

    else if (document.querySelector('#categoryColor').innerText === 'Chores') {
        document.querySelector('#categoryColor').classList.remove('label-default')
        document.querySelector('#categoryColor').classList.add('label-info')
    }
}
