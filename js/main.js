// Находим элементы на странице:
const form = document.querySelector('#form') 
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

form.addEventListener('submit', addTask) // Отправка формы при событии submit
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

let tasks = []

// Проверяем есть ли данные в localStorage:
if (localStorage.getItem('tasks')) 
{
    // Добавляем даные из localStorage в массив tasks:
    tasks = JSON.parse(localStorage.getItem('tasks'))

    // Перебираем массив после добавления задач из localStorage и рендерим на страницу:
    tasks.forEach(task => {
        renderTask(task)
    })
}

checkEmptyList()

// if (localStorage.getItem('tasksHTML')) {
//     tasksList.innerHTML = localStorage.getItem('tasksHTML')
// }

// Добавление задачи
function addTask(event) {

    // Отменяем отправку формы:
    event.preventDefault() 

    // Добавляем текст задачи из поля ввода:
    const taskText = taskInput.value 

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    // Добавляем задачу в массив с задачами: 
    tasks.push(newTask)

    saveToLocalStorage()

    renderTask(newTask)

    // Очищаем поле ввода и возвращаем на него фокус:
    taskInput.value = ''
    taskInput.focus()

    // Скрывам блок "Список дел пуст":
    // if (tasksList.children.length > 1) {
    //     emptyList.classList.add('none') // Создаем класс none
    // }

    checkEmptyList()

    // saveHTMLtoLS()
    
} 

//Удааление задачи
function deleteTask(event) {

    // Проверяем нажатие именно на кнопку удаления - крестик
    if (event.target.dataset.action !== 'delete') {
        return // return если "нет"
    }

    // Продолжаем выполнение функции если "да"
    const parentNode = event.target.closest('.list-group-item') // Ищем элемент среди родителей, как querySelector только в наружную сторону

    // Определяем ID задачи
    const id = +parentNode.id
    
    // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id === id)
    
    // Удаляем задачу из массива с задачами:
    tasks.splice(index, 1)

    saveToLocalStorage()

    // Способ удаления задачи из массива путем фильтрации:
    // tasks = tasks.filter((task) => task.id !== id)

    // Удаляем задачу из разметки
    parentNode.remove()
    
    // Проверяем если в списке задач нет элементов:
    // if (tasksList.children.length === 1) {
    //     emptyList.classList.remove('none') // Удаляем класс none
    // }

    checkEmptyList()

    // saveHTMLtoLS()

}

// Отмечаем задачу выполненной
function doneTask(event) {

    if (event.target.dataset.action !== 'done') return

    const parentNode = event.target.closest('.list-group-item')

    // Определяем ID задачи:
    const id = +parentNode.id

    const task = tasks.find(function (task) {
        if (task.id === id) {
            return true
        }
    })

    task.done = !task.done

    saveToLocalStorage()

    const taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')

    // saveHTMLtoLS()

}

// Добавляем или удаляем блок "Список дел пуст":
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML =    `<li id="emptyList" class="list-group-item empty-list">
                                        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                        <div class="empty-list__title">Список дел пуст</div>
                                    </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null
    }
}

// Передаем в localStorage массив с данными tasks:
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Передаем в localStorage всю разметку HTML:
// function saveHTMLtoLS() {
//     localStorage.setItem('tasksHTML', tasksList.innerHTML)
// }

// Добавляем задачу на страницу:
function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

    // Формируем разметку для новой задачи:
    const taskHTML =    `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                            <span class="${cssClass}">${task.text}</span>
                            <div class="task-item__buttons">
                                <button type="button" data-action="done" class="btn-action">
                                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                                </button>
                                <button type="button" data-action="delete" class="btn-action">
                                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                                </button>
                            </div>
                        </li>` 

    // Добавляем задачу на страницу:
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}