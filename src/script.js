const inputTask = document.getElementById("input-task");
const addTaskButton = document.getElementById("add-task-button");
const taskListElement = document.getElementById("task-list");

// Retrieve tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to fetch a random motivational quote
function fetchQuote() {
    fetch('https://zenquotes.io/api/random')
        .then(response => response.json())
        .then(data => {
            const quote = data[0].q; // The quote text
            const author = data[0].a; // The quote author
            document.getElementById('quote-text').textContent = `"${quote}" - ${author}`;
        })
        .catch(error => {
            console.error('Error fetching quote:', error);
            document.getElementById('quote-text').textContent = "Stay positive!";
        });
}

// Call fetchQuote when the page loads
fetchQuote();

// Function to render tasks from the tasks array
function renderTasks() {
    taskListElement.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("li");

        // Checkbox for marking task as complete
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTaskComplete(index));

        // Span for task name
        const taskSpan = document.createElement("span");
        taskSpan.className = "task";
        taskSpan.textContent = task.name;
        if (task.completed) {
            taskSpan.style.textDecoration = "line-through";
        }

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "✎";
        editButton.addEventListener("click", () => editTask(index));

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "✖";
        deleteButton.addEventListener("click", () => deleteTask(index));

        // Append elements to the task item
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
        taskListElement.appendChild(taskItem);
    });
}

// Function to add a new task
function addTask() {
    const taskName = inputTask.value.trim();
    if (taskName === "") {
        alert("Task name cannot be empty.");
        return;
    }

    // Create a new task object and add it to the tasks array
    const newTask = { name: taskName, completed: false };
    tasks.push(newTask);

    // Save to local storage and re-render the tasks
    saveTasks();
    renderTasks();

    // Clear the input field
    inputTask.value = "";
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Function to edit a task
function editTask(index) {
    const newTaskName = prompt("Edit your task:", tasks[index].name);
    if (newTaskName !== null && newTaskName.trim() !== "") {
        tasks[index].name = newTaskName.trim();
        saveTasks();
        renderTasks();
    }
}

// Function to toggle task completion
function toggleTaskComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Event listener for the "Add Task" button
addTaskButton.addEventListener("click", addTask);

// Render tasks on page load
renderTasks();
