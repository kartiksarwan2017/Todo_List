const taskInput = document.querySelector(".add-todo-input input");

const filters = document.querySelectorAll(".filters span");

const clearAll = document.querySelector(".clear-btn");

const taskBox = document.querySelector(".todolist");
const addTodoButton = document.querySelector(".todo-button .add-button");

let editId;
let isEditedTask = false;

let todos = JSON.parse(localStorage.getItem("todo-list"));

const totalTasks = document.querySelector(".total-tasks span");
const completedTasks = document.querySelector(".completed-tasks span");
const remainingTasks = document.querySelector(".remaining-tasks span");

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    // console.log(btn);
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

// function to store the tasks added by the user
function storeItems() {
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

// displays the tasks created in filtered category such as pending, completed, all tasks
function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      // console.log(id, todo);

      if (filter == todo.status || filter == "all") {
        li += ` <li class="task">
        <label for="${id}">
          <input class="select-taskitem" onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
          <p class="task-details" class="${isCompleted}" >${todo.name}</p>
        </label>
        <div class="settings">
          <i onclick="showMenu(this)" id="menu-icon" class="fa-solid fa-ellipsis fa-lg"></i>  
          <ul class="task-menu">
            <li onclick="editTask(${id}, '${todo.name}')">
            <i id="edit-icon" class="fa-solid fa-pen-to-square"></i>
            <p id="edit-item">
            Edit
            </p>
          </li>
          <li onclick="deleteTask(${id})" >
            <i id="delete-icon" class="fa-solid fa-trash-can"></i>
            <p id="delete-item">
            Delete
            <p>
          </li>
          </ul>
        </div>
        </li>
      `;
      }
    });
  }

  taskBox.innerHTML =
    li ||
    `<span class="no-task-entered-title">You don't have any task here!!!</span>`;
  countTasks();
}

showTodo("all");

function showMenu(selectedTask) {
  // console.log(selectedTask);
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

// performs updation of task
function editTask(taskId, taskName) {
  //   console.log(taskId, taskName);
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
}

// performs deletion of task
function deleteTask(deleteId) {
  //   console.log(deleteId);
  todos.splice(deleteId, 1);
  storeItems();
  showTodo("all");
}

// performs the deletion of all tasks
clearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  storeItems();
  showTodo("all");
});

// updating status of the selected task
function updateStatus(selectedTask) {
  //   console.log(selectedTask);

  let taskName = selectedTask.parentElement.lastElementChild;
  // check if the task selected is checked or not
  if (selectedTask.checked) {
    // if the task added is seleted then mark it as completed
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    // if the task added is not checked then mark it as pending
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  storeItems();
}

// adding Task upon pressing keyboard keys such as enter
taskInput.addEventListener("keyup", e => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditedTask) {
      if (!todos) {
        todos = [];
      }
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }

    taskInput.value = "";
    storeItems();
    showTodo("all");
  }
});

// performs the createtask operation
addTodoButton.onclick = () => {
  let userTask = taskInput.value;
  let getLocalStorage = localStorage.getItem("todo-list");

  if (getLocalStorage == null) {
    todos = [];
  } else {
    todos = JSON.parse(getLocalStorage);
  }

  if (!isEditedTask) {
    if (!todos) {
      todos = [];
    }
    let taskInfo = { name: userTask, status: "pending" };
    todos.push(taskInfo);
  } else {
    isEditedTask = false;
    todos[editId].name = userTask;
  }

  taskInput.value = "";
  storeItems();
  showTodo("all");
};

taskInput.onkeyup = () => {
  let userTask = taskInput.value;
  if (userTask.trim() != 0) {
    // activate the todo Add Button if taskInput contains letters, words
    addTodoButton.classList.add("active");
  } else {
    // deactibate the todo Add button if taskInput is empty
    addTodoButton.classList.remove("active");
  }
};

// computes the count of the tasks completed, remaining and pending
function countTasks() {
  let itemcount = document.querySelectorAll('input[type="checkbox"]').length;
  totalTasks.textContent = itemcount;

  const checkedTasks = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  ).length;

  completedTasks.textContent = checkedTasks;
  remainingTasks.textContent = itemcount - checkedTasks;
}
