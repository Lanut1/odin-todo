import { Task } from "./task.js";
import { Project } from "./project.js"
import { isToday, isTomorrow, isThisWeek, isBefore, startOfToday } from "date-fns";
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
    showAddTaskDialog(0);
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

function showAddTaskDialog(projectId) {
    taskDialog.dataset.projectId = projectId;
    taskDialog.showModal();
}

function initializeTaskNextId() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (tasks.length > 0) {
        Task.nextId = Math.max(...tasks.map(task => task.id)) + 1;
    }
}

initializeTaskNextId();

function initializeProjectNextId() {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    if (projects.length > 0) {
        Project.nextId = Math.max(...projects.map(project => project.id)) + 1;
    }
}

initializeProjectNextId();

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskTitle = document.querySelector("#task-title").value;
    const taskDescription = document.querySelector("#task-description").value;
    const taskDate = document.querySelector("#task-date").value;
    const formattedTaskDate = new Date(taskDate);
    const taskPriority = document.querySelector("#task-priority").value;
    const taskProjectId = taskDialog.dataset.projectId;
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
    taskForm.reset();
    taskDialog.close();
    if (taskProjectId == 0) {
        showAllTasks();
    } else {
        displayProject(taskProjectId);
    }
    
})

projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const projectTitle = document.querySelector("#project-title").value;
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    if (projectDialog.dataset.isEdit == "true") {
        const projectToEdit = projects.find(project => project.id == projectDialog.dataset.projectId);
        projectToEdit.title = projectTitle;
        projectDialog.dataset.isEdit = "false";
    } else {
        const newProject = new Project(projectTitle);
        projects.push(newProject); 
    }
    localStorage.setItem("projects", JSON.stringify(projects));
    projectForm.reset();
    projectDialog.close();
    showAllProjects();
})


const mainSectionHeader = document.querySelector(".main-section-header");
const mainSectionContent = document.querySelector(".main-section-content");

showAllTasks();

function createTaskCard(task) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.dataset.taskId = task.id;

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

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.classList.add("task-checkbox");
    taskCheckbox.checked = task.completed;
    if (task.completed) {
        taskCard.classList.add("completed");
    }
    taskCard.appendChild(taskCheckbox);

    const taskCardProject = document.createElement("div");
    taskCardProject.classList.add("task-card-project");
    taskCardProject.innerText = task.projectId;
    taskCard.appendChild(taskCardProject);

    const completeButton = document.createElement("button");
    completeButton.classList.add("task-completed");

    const editButton = document.createElement("span");
    editButton.classList.add("material-symbols-outlined", "task-edit");
    editButton.innerText = "edit_note";
    taskCard.appendChild(editButton);

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("material-symbols-outlined", "task-delete");
    deleteButton.innerText = "delete";
    taskCard.appendChild(deleteButton);

    mainSectionContent.appendChild(taskCard);
}

const sidebarProjects = document.querySelector(".projects-container");
sidebarProjects.addEventListener("click", (event) => {
    if (event.target.classList.contains("sidebar-button")) {
        const projectToShow = event.target.closest(".sidebar-project-card");
        const projectId = projectToShow.dataset.projectId;
        displayProject(projectId);
    }
})

function createProjectCard(project) {
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");
    projectCard.innerText = project.title;
    projectCard.dataset.projectId = project.id;
    mainSectionContent.appendChild(projectCard);

    createSidebarProject(project);
}

function createSidebarProject(project) {
    const sidebarProjectCard = document.createElement("button");
    sidebarProjectCard.classList.add("sidebar-project-card", "sidebar-button");
    sidebarProjectCard.dataset.projectId = project.id;

    const folderIcon = document.createElement("span");
    folderIcon.classList.add("material-symbols-outlined", "sidebar-button");
    folderIcon.innerText = "folder_open";
    sidebarProjectCard.appendChild(folderIcon);

    const projectHeader = document.createElement("div");
    projectHeader.classList.add("sidebar-project-card-header", "sidebar-button");
    projectHeader.innerText = project.title;
    sidebarProjectCard.appendChild(projectHeader);

    sidebarProjects.appendChild(sidebarProjectCard);
}

const projects = JSON.parse(localStorage.getItem('projects')) || [];
projects.forEach((project) => createSidebarProject(project));

function displayProject(projectId) {
    mainSectionHeader.replaceChildren();
    mainSectionContent.replaceChildren();

    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const projectTpDisplay = projects.find((project) => project.id == projectId);
    const projectHeader = document.createElement("div");
    projectHeader.classList.add("project-header");
    projectHeader.innerText = `${projectTpDisplay.title} Project`;
    mainSectionHeader.appendChild(projectHeader);

    const editButton = document.createElement("span");
    editButton.classList.add("material-symbols-outlined", "project-edit");
    editButton.innerText = "edit_note";
    mainSectionHeader.appendChild(editButton);

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("material-symbols-outlined", "project-delete");
    deleteButton.innerText = "delete";
    mainSectionHeader.dataset.projectId = projectId;
    mainSectionHeader.appendChild(deleteButton);

    const addTaskToProjectButton = document.createElement("button");
    addTaskToProjectButton.id = "add-project-task";
    addTaskToProjectButton.dataset.projectId = projectId;

    const addIcon = document.createElement("span");
    addIcon.classList.add("material-symbols-outlined");
    addIcon.innerText = "add_circle";
    addTaskToProjectButton.appendChild(addIcon);

    const addTask = document.createElement("div");
    addTask.classList.add("add-task-label");
    addTask.innerText = "Add Project Task";
    addTaskToProjectButton.appendChild(addTask);

    mainSectionContent.appendChild(addTaskToProjectButton);
    tasks.filter((task) => task.projectId === projectId).forEach((task) => createTaskCard(task));
}

const projectTitleEdit = document.querySelector("#project-title");

const confirmDeleteDialog = document.querySelector("#confirm-project-delete");
const cancelButton = document.querySelector("#cancel-delete");
const confirmDeleteButton = document.querySelector("#confirm-delete");

function openEditProjectDialog(projectId) {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const project = projects.find((project) => project.id == projectId);
    if (project) {
        projectTitleEdit.value = project.title;
        projectDialog.dataset.projectId = projectId;
        projectDialog.dataset.isEdit = "true";
        projectDialog.showModal();
    }
}

function openEditTaskDialog(taskId) {
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
        taskDialog.showModal();
    }
}

function openDeleteProjectDialog(projectId) {
    confirmDeleteDialog.dataset.projectId = projectId;
    confirmDeleteDialog.showModal();
}

cancelButton.addEventListener("click", () => {
    confirmDeleteDialog.close();
})

confirmDeleteButton.addEventListener("click", () => {
    const projectId = confirmDeleteDialog.dataset.projectId;
    deleteProject(projectId);
    confirmDeleteDialog.close();
})

function deleteProject(projectId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let projects = JSON.parse(localStorage.getItem("projects"));

    projects = projects.filter((project) => project.id != projectId) || [];
    tasks = tasks.filter((task) => task.projectId !=projectId);

    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("tasks", JSON.stringify(tasks));

    showAllProjects();
}


mainSectionHeader.addEventListener("click", (event) => {
    if (event.target.classList.contains("project-delete")) {
        const projectToDelete = mainSectionHeader.dataset.projectId;
        openDeleteProjectDialog(projectToDelete);
    } else if (event.target.classList.contains("project-edit")) {
        const projectToEdit = mainSectionHeader.dataset.projectId;
        openEditProjectDialog(projectToEdit);
    }
})

mainSectionContent.addEventListener("click", (event) => {
    if (event.target.classList.contains("task-delete")) {
        const taskToDelete = event.target.closest(".task-card");
        const taskIndex = taskToDelete.dataset.taskId;
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.id != taskIndex);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        taskToDelete.remove();
    } else if (event.target.classList.contains("task-checkbox")) {
        const taskToComplete = event.target.closest(".task-card");
        const taskIndex = taskToComplete.dataset.taskId;
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const isCompleted = event.target.checked;
        const taskToChange = tasks.find(task => task.id == taskIndex);
        if (taskToChange) {
            taskToChange.completed = isCompleted;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            taskToComplete.classList.toggle("completed", isCompleted);
        }
    } else if (event.target.classList.contains("task-edit")) {
        const taskToEdit = event.target.closest(".task-card");
        const taskIndex = taskToEdit.dataset.taskId;
        openEditTaskDialog(taskIndex);

    } else if (event.target.classList.contains("project-card")) {
        const projectCard = event.target.closest(".project-card");
        const projectId = projectCard.dataset.projectId;
        displayProject(projectId);
    } else if (event.target.closest("#add-project-task")) {
        const button = event.target.closest("#add-project-task");
        const projectId = button.dataset.projectId;
        showAddTaskDialog(projectId);
    }
})

function showAllProjects() {
    mainSectionHeader.innerText = "All Projects";
    mainSectionContent.replaceChildren();
    sidebarProjects.replaceChildren();
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.forEach((project) => createProjectCard(project));
}

function showAllTasks() {
    mainSectionHeader.innerText = "All Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => createTaskCard(task));
}

const showAllTasksButton = document.querySelector("#show-all-tasks");
showAllTasksButton.addEventListener("click", () => showAllTasks());

const showAllProjectsButton = document.querySelector("#show-all-projects");
showAllProjectsButton.addEventListener("click", () => showAllProjects());

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
    const today = startOfToday();
    tasks.filter((task) => isBefore(task.date, today) && !(task.completed)).forEach((task) => createTaskCard(task));
}

const showOverdueButton = document.querySelector("#show-overdue");
showOverdueButton.addEventListener("click", () => showOverdue());

function showImportant() {
    mainSectionHeader.innerText = "Important Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => task.priority === "high").forEach((task) => createTaskCard(task));
}

const showImportantButton = document.querySelector("#show-important");
showImportantButton.addEventListener("click",  () => showImportant());

function showCompleted() {
    mainSectionHeader.innerText = "Completed Tasks";
    mainSectionContent.replaceChildren();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter((task) => task.completed).forEach((task) => createTaskCard(task));
}

const showCompletedButton = document.querySelector("#show-completed");
showCompletedButton.addEventListener("click", () => showCompleted());