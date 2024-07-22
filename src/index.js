import { Task } from "./task";
import { isToday } from "date-fns";
import { isTomorrow } from "date-fns";
import { isThisWeek } from "date-fns";
import { isBefore } from "date-fns";
import "./style.css";
import logo from "./images/check.png";

document.querySelector(".sidebar-logo img").src = logo;

const addTaskButton = document.querySelector("#new-task");
const addProjectButton = document.querySelector("#new-project");
const taskDialog = document.querySelector("#task-dialog");
const projectDialog = document.querySelector("#project-dialog");
const closeTaskDialog = document.querySelector("#close-task-dialog");
const closeProjectDialog = document.querySelector("#close-project-dialog");

const taskForm = document.querySelector("#task-form");
const projectForm = document.querySelector("#project-form");

addTaskButton.addEventListener("click", () => {
    taskDialog.showModal();
});

addProjectButton.addEventListener("click", () => {
    projectDialog.showModal();
});

closeTaskDialog.addEventListener("click", () => {
    taskDialog.close();
});

closeProjectDialog.addEventListener("click", () => {
    projectDialog.close();
});

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskTitle = document.querySelector("#task-title").value;
    const taskDescription = document.querySelector("#task-description").value;
    const taskDate = document.querySelector("#task-date").value;
    const formattedTaskDate = new Date(taskDate);
    const taskPriority = document.querySelector("#task-priority").value;
    const newTask = new Task(taskTitle, taskDescription, formattedTaskDate, taskPriority);
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskForm.reset();
    taskDialog.close();
    showAllTasks();
})

projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const projectTitle = document.querySelector("#project-title").value;
    // this is my projects folder, inside each folder i can create tasks, but how to implement the idea of adding tasks to the current folder?

})


const mainSectionHeader = document.querySelector(".main-section-header");
const mainSectionContent = document.querySelector(".main-section-content");

function createTaskCard(task) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    const taskCardTitle = document.createElement("div");
    taskCardTitle.classList.add("task-card-title");
    taskCardTitle.innerText = task.title;
    taskCard.appendChild(taskCardTitle);

    const taskCardDescription = document.createElement("div");
    taskCardDescription.classList.add("task-card-description");
    taskCardDescription.innerText = task.description;
    taskCard.appendChild(taskCardDescription);

    const taskCardDate = document.createElement("div");
    taskCardDate.classList.add("task-card-date");
    taskCardDate.innerText = task.date;
    taskCard.appendChild(taskCardDate);

    const taskCardPriority = document.createElement("div");
    taskCardPriority.classList.add("task-card-priority");
    taskCardPriority.innerText = task.priority;
    taskCard.appendChild(taskCardPriority);

    const taskCardProject = document.createElement("div");
    taskCardProject.classList.add("task-card-project");
    taskCardProject.innerText = task.projectId;
    taskCard.appendChild(taskCardProject);

    const completeButton = document.createElement("button");
    completeButton.classList.add("task-completed");

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("material-symbols-outlined", "task-delete");
    deleteButton.innerText = "delete";

    mainSectionContent.appendChild(taskCard);
}

// Need to add task id for better usage 
// mainSectionContent.addEventListener("click", (event) => {
//     if (event.target.classList.contains("task-delete")) {
//         const taskToDelete = event.target.closest(".task-card");
//         const taskTitle = taskToDelete.querySelector
//     }
// })

function showAllTasks() {
    mainSectionHeader.innerText = "All Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => createTaskCard(task));
}

const showAllTasksButton = document.querySelector("#show-all-tasks");
showAllTasksButton.addEventListener("click", () => showAllTasks());

function showTodayTasks() {
    mainSectionHeader.innerText = "Today Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => isToday(task.date)).forEach((task) => createTaskCard(task));
}

const showTodayTasksButton = document.querySelector("#show-today-tasks");
showTodayTasksButton.addEventListener("click", () => showTodayTasks());

function showTomorrowTasks() {
    mainSectionHeader.innerText = "Tomorrow Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => isTomorrow(task.date)).forEach((task) => createTaskCard(task));
}

const showTomorrowTasksButton = document.querySelector("#show-tomorrow-tasks");
showTomorrowTasksButton.addEventListener("click", () => showTomorrowTasks());

function showWeekTasks() {
    mainSectionHeader.innerText = "Week Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => isThisWeek(task.date)).forEach((task) => createTaskCard(task));
}

const showWeekTasksButton = document.querySelector("#show-week-tasks");
showWeekTasksButton.addEventListener("click", () => showWeekTasks());

function showOverdue() {
    mainSectionHeader.innerText = "Overdue Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => isBefore(task.date)).forEach((task) => createTaskCard(task));
}

const showOverdueButton = document.querySelector("#show-overdue");
showOverdueButton.addEventListener("click", () => showOverdue());

function showImportant() {
    mainSectionHeader.innerText = "Overdue Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => task.priority === "high").forEach((task) => createTaskCard(task));
}

const showImportantButton = document.querySelector("#show-important");
showImportantButton.addEventListener("click",  () => showImportant());


