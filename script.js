document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const body = document.body;
  
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      body.classList.add(savedTheme);
    }
  
    themeToggleBtn.addEventListener("click", () => {
      if (body.classList.contains("light-theme")) {
        body.classList.replace("light-theme", "dark-theme");
        localStorage.setItem("theme", "dark-theme");
      } else if (body.classList.contains("dark-theme")) {
        body.classList.replace("dark-theme", "light-theme");
        localStorage.setItem("theme", "light-theme");
      } else {
        // Default to light theme if no theme is currently set
        body.classList.add("light-theme");
        localStorage.setItem("theme", "light-theme");
      }
    });
});

const taskInput = document.querySelector(".task-input input"),
      priorityDropdown = document.querySelector(".priority-dropdown"),
      addTaskBtn = document.getElementById("add-task-btn"),
      filters = document.querySelectorAll(".filters span"),
      clearAll = document.querySelector(".clear-btn"),
      taskBox = document.querySelector(".task-box");

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo();
    });
});

function showTodo() {
    let liTag = "";
    if (todos) {
        const priorityOrder = { "high": 1, "medium": 2, "low": 3, "no priority": 4 };
        todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        todos.forEach((todo, id) => {
            let completed = todo.status === "completed" ? "checked" : "";
            liTag += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                            <p class="${completed}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onclick='editTask(${id}, "${todo.name}", "${todo.priority}")'><i class="uil uil-pen"></i>Edit</li>
                                <li onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                        <span class="priority">${todo.priority.toUpperCase()}</span>
                    </li>`;
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo();

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName !== "I" || e.target !== selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function addTask() {
    let userTask = taskInput.value.trim();
    let taskPriority = priorityDropdown.value;
    if (userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending", priority: taskPriority };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].priority = taskPriority;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo();
    }
}
function editTask(taskId, textName, priority) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    priorityDropdown.value = priority;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

function addTask() {
    let userTask = taskInput.value.trim();
    let taskPriority = priorityDropdown.value;
    if (userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending", priority: taskPriority };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].priority = taskPriority;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo();
    }
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        addTask();
    }
});

const searchInput = document.getElementById('search-input');
const taskList = document.querySelector('.task-box');

searchInput.addEventListener('keyup', (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const tasks = taskList.querySelectorAll('.task');

  tasks.forEach(task => {
    const taskText = task.querySelector('p').textContent.toLowerCase();
    task.style.display = taskText.includes(searchTerm) ? 'flex' : 'none';
  });
});
