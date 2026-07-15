const taskInput = document.getElementById("taskInput");
const taskDescription = document.getElementById("taskDescription");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");
const searchInput = document.getElementById("searchInput");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editIndex = -1;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskStats() {
  totalTasks.textContent = tasks.length;

  const completed = tasks.filter((task) => task.completed).length;

  completedTasks.textContent = completed;

  pendingTasks.textContent = tasks.length - completed;
}

searchInput.addEventListener("input", function () {
  displayTasks();
});

const today = new Date().toISOString().split("T")[0];
dueDate.min = today;

function displayTasks() {
  taskContainer.innerHTML = "";

  updateTaskStats();

  if (tasks.length === 0) {
    taskContainer.innerHTML = `
    <div class="empty-state">
      <div style="font-size: 60px;">📝</div>
      <h3>No Tasks Yet</h3>
      <p>Create your first task and stay productive!</p>
    </div>
  `;
    return;
  }

  const searchText = searchInput.value.toLowerCase();

  tasks.forEach(function (task, index) {
    if (
      !task.title.toLowerCase().includes(searchText) &&
      !task.description.toLowerCase().includes(searchText)
    ) {
      return;
    }

    const taskCard = document.createElement("div");

    if (task.completed) {
      taskCard.classList.add("completed");
    }

    taskCard.classList.add("task-card");

    let priorityClass = "";

    if (task.priority === "High") {
      priorityClass = "high-priority";
    } else if (task.priority === "Medium") {
      priorityClass = "medium-priority";
    } else {
      priorityClass = "low-priority";
    }

    const formattedDate = new Date(task.dueDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    taskCard.innerHTML = `
      <h3>${task.title}</h3>

      <p>${task.description}</p>

      <div class="task-info">
          
      <span class="priority ${priorityClass}">
  ${task.priority} Priority
</span> 
          <span class="date">${formattedDate}</span>
      </div>

      <div class="task-actions">
          <button class="complete-btn">
  ${task.completed ? "↩ Undo" : "✔ Complete"}
</button>
          <button class="edit-btn">✏ Edit</button>
          <button class="delete-btn">🗑 Delete</button>
      </div>
    `;

    taskContainer.appendChild(taskCard);

    const deleteBtn = taskCard.querySelector(".delete-btn");

    const completeBtn = taskCard.querySelector(".complete-btn");

    completeBtn.addEventListener("click", function () {
      task.completed = !task.completed;

      saveTasks();

      displayTasks();
    });

    const editBtn = taskCard.querySelector(".edit-btn");

    editBtn.addEventListener("click", function () {
      taskInput.value = task.title;
      taskDescription.value = task.description;
      priority.value = task.priority;
      dueDate.value = task.dueDate;

      editIndex = index;

      addTaskBtn.textContent = "Update Task";

      taskInput.focus();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    deleteBtn.addEventListener("click", function () {
      const confirmDelete = confirm(
        "Are you sure you want to delete this task?",
      );

      if (!confirmDelete) return;

      tasks.splice(index, 1);

      saveTasks();

      displayTasks();
    });
  });
}

addTaskBtn.addEventListener("click", function () {
  const title = taskInput.value.trim();
  const description = taskDescription.value.trim();
  const taskPriority = priority.value;
  const taskDueDate = dueDate.value;

  if (
    title === "" ||
    description === "" ||
    taskPriority === "" ||
    taskDueDate === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    title: title,
    description: description,
    priority: taskPriority,
    dueDate: taskDueDate,
    completed: editIndex === -1 ? false : tasks[editIndex].completed,
  };

  if (editIndex === -1) {
    tasks.push(task);
  } else {
    tasks[editIndex] = task;

    editIndex = -1;

    addTaskBtn.textContent = "Add Task";
  }

  saveTasks();

  displayTasks();

  taskInput.value = "";
  taskDescription.value = "";
  priority.value = "";
  dueDate.value = "";
});

taskInput.value = "";
taskDescription.value = "";
priority.value = "";
dueDate.value = "";

displayTasks();
