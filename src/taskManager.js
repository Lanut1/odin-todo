import { Task } from "./task";
import { isToday, isTomorrow, isThisWeek, isBefore, startOfToday } from "date-fns";
import { openDialog } from "./utils";

function submitTaskForm(taskDialog, taskProjectId) {
    const taskTitle = document.querySelector("#task-title").value;
    const taskDescription = document.querySelector("#task-description").value;
    const taskDate = document.querySelector("#task-date").value;
    const formattedTaskDate = new Date(taskDate);
    const taskPriority = document.querySelector("#task-priority").value;
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (taskDialog.dataset.isEdit == "true") {
        const taskToEdit = tasks.find(task => task.id == taskDialog.dataset.taskId);
        taskToEdit.title = taskTitle;
        taskToEdit.description = taskDescription;
        taskToEdit.date = formattedTaskDate;
        taskToEdit.priority = taskPriority;
        taskDialog.dataset.isEdit = "false";
    } else {
        const newTask = new Task(taskTitle, taskDescription, formattedTaskDate, taskPriority, taskProjectId);
        tasks.push(newTask);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createCheckbox(task) {
    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("pretty", "p-icon", "p-round", "p-tada");
  
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.checked = task.completed;
    checkboxContainer.appendChild(checkbox);
  
    const stateDiv = document.createElement("div");
    stateDiv.classList.add("state", "p-success");
  
    const icon = document.createElement("i");
    icon.classList.add("icon", "mdi", "mdi-check");
    stateDiv.appendChild(icon);

    const label = document.createElement("label");
    label.textContent = "";
    stateDiv.appendChild(label);
  
    checkboxContainer.appendChild(stateDiv);
  
    return checkboxContainer;
  }

function createTaskCard(task, mainSectionContent) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.dataset.taskId = task.id;
    const firstRowContainer = document.createElement("div");
    firstRowContainer.classList.add("first-row-container");

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");

    const taskCheckbox = createCheckbox(task);

    // const taskCheckbox = document.createElement("input");
    // taskCheckbox.type = "checkbox";
    // taskCheckbox.classList.add("task-checkbox");
    // taskCheckbox.checked = task.completed;
    if (task.completed) {
        taskCard.classList.add("completed");
    }
    titleContainer.appendChild(taskCheckbox);

    const taskCardTitle = document.createElement("div");
    taskCardTitle.classList.add("task-card-title");
    taskCardTitle.innerText = task.title;
    titleContainer.appendChild(taskCardTitle);
    firstRowContainer.appendChild(titleContainer);

    const editContainer = document.createElement("div");
    editContainer.classList.add("edit-container");

    const taskCardDate = document.createElement("div");
    taskCardDate.classList.add("task-card-date");
    const date = new Date(task.date);
    const formattedDate = date.toISOString().split('T')[0];
    taskCardDate.innerText = formattedDate;
    editContainer.appendChild(taskCardDate);

    if (task.priority === "high") {
        taskCard.classList.add("priority-high");
    } else if (task.priority === "medium") {
        taskCard.classList.add("priority-medium");
    } else if (task.priority === "low") {
        taskCard.classList.add("priority-low");
    }

    const editButton = document.createElement("span");
    editButton.classList.add("material-symbols-outlined", "task-edit");
    editButton.innerText = "edit_note";
    editContainer.appendChild(editButton);

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("material-symbols-outlined", "task-delete");
    deleteButton.innerText = "delete";
    editContainer.appendChild(deleteButton);
    firstRowContainer.appendChild(editContainer);

    taskCard.appendChild(firstRowContainer);

    const secondRowContainer = document.createElement("div");
    secondRowContainer.classList.add("second-row-container");

    const taskCardDescription = document.createElement("div");
    taskCardDescription.classList.add("task-card-description");
    taskCardDescription.innerText = task.description;
    secondRowContainer.appendChild(taskCardDescription);

    const taskCardProject = document.createElement("div");
    taskCardProject.classList.add("task-card-project");
    const projectId = task.projectId;
    if (projectId > 0) {
        const projects = JSON.parse(localStorage.getItem("projects"));
        const projectToDisplay = projects.find(project => project.id == projectId);
        taskCardProject.innerText = projectToDisplay.title;
    }
    secondRowContainer.appendChild(taskCardProject);

    taskCard.appendChild(secondRowContainer);

    mainSectionContent.appendChild(taskCard);
}

function showAddTaskDialog(projectId, taskDialog) {
    taskDialog.dataset.projectId = projectId;
    openDialog(taskDialog);
}

function openEditTaskDialog(taskId, taskDialog) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks.find((task) => task.id == taskId);
    if (task) {
        document.querySelector("#task-title").value = task.title;
        document.querySelector("#task-description").value = task.description;
        const date = new Date(task.date);
        const formattedDate = date.toISOString().split('T')[0];
        document.querySelector("#task-date").value = formattedDate;
        document.querySelector("#task-priority").value = task.priority;
        taskDialog.dataset.projectId = task.projectId;
        taskDialog.dataset.taskId = taskId;
        taskDialog.dataset.isEdit = "true";
        openDialog(taskDialog);
    }
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.id != taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function completeTask(taskId, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskToComplete = tasks.find(task => task.id == taskId);
    taskToComplete.completed = isCompleted;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showAllTasks(mainSectionHeader, mainSectionContent) {
    mainSectionHeader.innerText = "All Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => createTaskCard(task, mainSectionContent));
}

function showTodayTasks(mainSectionHeader, mainSectionContent) {
    mainSectionHeader.innerText = "Today Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => isToday(task.date)).forEach((task) => createTaskCard(task, mainSectionContent));
}

function showTomorrowTasks(mainSectionHeader, mainSectionContent) {
    mainSectionHeader.innerText = "Tomorrow Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => isTomorrow(task.date)).forEach((task) => createTaskCard(task, mainSectionContent));
}

function showWeekTasks(mainSectionHeader, mainSectionContent) {
    mainSectionHeader.innerText = "Week Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => isThisWeek(task.date)).forEach((task) => createTaskCard(task, mainSectionContent));
}

function showOverdue(mainSectionHeader, mainSectionContent) {
    mainSectionHeader.innerText = "Overdue Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const today = startOfToday();
    tasks.filter((task) => isBefore(task.date, today) && !(task.completed)).forEach((task) => createTaskCard(task, mainSectionContent));
}

function showImportant(mainSectionHeader, mainSectionContent) {
    mainSectionHeader.innerText = "Important Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => task.priority === "high").forEach((task) => createTaskCard(task, mainSectionContent));
}

function showCompleted(mainSectionHeader, mainSectionContent) {
    mainSectionHeader.innerText = "Completed Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => task.completed).forEach((task) => createTaskCard(task, mainSectionContent));
}

export { submitTaskForm, showAddTaskDialog, openEditTaskDialog, createTaskCard, deleteTask, completeTask, showAllTasks, showTodayTasks, showTomorrowTasks, showWeekTasks, showOverdue, showImportant, showCompleted };