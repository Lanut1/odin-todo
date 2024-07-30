import { Task } from "./task.js";
import { Project } from "./project.js"
import "./style.css";
import logo from "./images/check.png";
import TaskManager from "./taskManager.js";
import ProjectManager from "./projectManager.js";
import { openDialog, closeDialog, initializeNextId, isMobile, initializeEventListeners, initializeSampleData } from "./utils.js";
import 'pretty-checkbox/dist/pretty-checkbox.min.css';

document.querySelector(".sidebar-logo img").src = logo;

const mainSectionHeader = document.querySelector(".main-section-header");
const mainSectionContent = document.querySelector(".main-section-content");
const addTaskButton = document.querySelector("#new-task");
const addProjectButton = document.querySelector("#new-project");
const taskDialog = document.querySelector("#task-dialog");
const projectDialog = document.querySelector("#project-dialog");
const closeTaskDialog = document.querySelector("#close-task-dialog");
const closeProjectDialog = document.querySelector("#close-project-dialog");
const taskForm = document.querySelector("#task-form");
const projectForm = document.querySelector("#project-form");

initializeSampleData();

const taskManager = new TaskManager;
const projectManager = new ProjectManager;

initializeNextId("tasks", Task);
initializeNextId("projects", Project);

// Task form submission
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskProjectId = taskDialog.dataset.projectId;
    taskManager.submitTaskForm(taskDialog, taskProjectId);
    taskForm.reset();
    closeDialog(taskDialog);

    if (taskProjectId == 0) taskManager.showAllTasks(mainSectionHeader, mainSectionContent);
    else {
        projectManager.displayProject(taskProjectId, mainSectionContent, mainSectionHeader);
        const tasksToDisplay = taskManager.loadTasks().filter((task) => task.projectId == taskProjectId);
        tasksToDisplay.forEach((task) => taskManager.createTaskCard(task, mainSectionContent));
    }
})

// Project form submisson
projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    projectManager.submitProjectForm(projectDialog);
    projectForm.reset();
    closeDialog(projectDialog);
    projectManager.showAllProjects(mainSectionHeader, mainSectionContent, sidebarProjects);
})

// Event delegation for the sidebar events
const sidebarProjects = document.querySelector(".projects-container");
sidebarProjects.addEventListener("click", (event) => {
    if (event.target.classList.contains("sidebar-button")) {
        const projectToShow = event.target.closest(".sidebar-project-card");
        const projectId = projectToShow.dataset.projectId;
        projectManager.displayProject(projectId, mainSectionContent, mainSectionHeader);
        const tasksToDisplay = taskManager.loadTasks().filter((task) => task.projectId == projectId);
        tasksToDisplay.forEach((task) => taskManager.createTaskCard(task, mainSectionContent));
    }
})

// Event delegation for the main section header events
mainSectionHeader.addEventListener("click", (event) => {
    const project = mainSectionHeader.dataset.projectId;
    if (event.target.classList.contains("project-delete")) projectManager.openDeleteProjectDialog(project);
    else if (event.target.classList.contains("project-edit")) projectManager.openEditProjectDialog(project, projectDialog);
})

// Event delegation for the main section events
mainSectionContent.addEventListener("click", (event) => {
    const taskCard = event.target.closest(".task-card");
    const projectCard = event.target.closest(".project-card");
    const addProject = event.target.closest("#add-project-task");

    if (taskCard) {
        const taskId = taskCard.dataset.taskId;
        if (event.target.classList.contains("task-delete")) {
            taskManager.deleteTask(taskId);
            taskCard.remove();
        } else if (event.target.classList.contains("task-checkbox")) {
            const isCompleted = event.target.checked;
            taskManager.completeTask(taskId, isCompleted);
            taskCard.classList.toggle("completed", isCompleted);
        } else if (event.target.classList.contains("task-edit")) {
            taskManager.openEditTaskDialog(taskId, taskDialog);
        }
    } else if (projectCard) {
        const projectId = projectCard.dataset.projectId;
        projectManager.displayProject(projectId, mainSectionContent, mainSectionHeader);
        const tasksToDisplay = taskManager.loadTasks().filter((task) => task.projectId == projectId);
        tasksToDisplay.forEach((task) => taskManager.createTaskCard(task, mainSectionContent));
    } else if (addProject) {
        const projectId = addProject.dataset.projectId;
        taskManager.showAddTaskDialog(projectId, taskDialog);
    }
});

// Opening and closing dialogs elements
addTaskButton.addEventListener("click", () => {
    taskManager.showAddTaskDialog(0, taskDialog);
});

addProjectButton.addEventListener("click", () => {
    openDialog(projectDialog);
});

closeTaskDialog.addEventListener("click", () => {
    taskForm.reset();
    closeDialog(taskDialog);
});

closeProjectDialog.addEventListener("click", () => {
    projectForm.reset();
    closeDialog(projectDialog);
});

// Confirmation dialog for project deletion
const confirmDeleteDialog = document.querySelector("#confirm-project-delete");
const cancelButton = document.querySelector("#cancel-delete");
const confirmDeleteButton = document.querySelector("#confirm-delete");

cancelButton.addEventListener("click", () => {
    closeDialog(confirmDeleteDialog);
})

confirmDeleteButton.addEventListener("click", () => {
    const projectId = confirmDeleteDialog.dataset.projectId;
    projectManager.deleteProject(projectId);
    projectManager.showAllProjects(mainSectionHeader, mainSectionContent, sidebarProjects);
    closeDialog(confirmDeleteDialog);
})

// Initialize event listeners for the main sidebar buttons
const taskAndProjectsManagerActions = [
    { selector: "#show-all-tasks", handler: () => taskManager.showAllTasks(mainSectionHeader, mainSectionContent) },
    { selector: "#show-today-tasks", handler: () => taskManager.showTodayTasks(mainSectionHeader, mainSectionContent) },
    { selector: "#show-tomorrow-tasks", handler: () => taskManager.showTomorrowTasks(mainSectionHeader, mainSectionContent) },
    { selector: "#show-week-tasks", handler: () => taskManager.showWeekTasks(mainSectionHeader, mainSectionContent) },
    { selector: "#show-overdue", handler: () => taskManager.showOverdue(mainSectionHeader, mainSectionContent) },
    { selector: "#show-important", handler: () => taskManager.showImportant(mainSectionHeader, mainSectionContent) },
    { selector: "#show-completed", handler: () => taskManager.showCompleted(mainSectionHeader, mainSectionContent) },
    { selector: "#show-all-projects", handler: () => projectManager.showAllProjects(mainSectionHeader, mainSectionContent, sidebarProjects) }
];

initializeEventListeners(taskAndProjectsManagerActions);

// Event listeners for menu toggler for mobile version
const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector("#menu-toggle");
const closeMenu = document.querySelector("#close-menu");

menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
});

closeMenu.addEventListener("click", () => {
    sidebar.classList.remove("active");
})

document.addEventListener("click", (event) => {
    const clickedMenuToggle = event.target.closest('#menu-toggle');
    if (isMobile() && !sidebar.contains(event.target) && !clickedMenuToggle) {
        sidebar.classList.remove("active");
    }
})

// Displaying tasks and projects
taskManager.showAllTasks(mainSectionHeader, mainSectionContent);
projectManager.loadProjects().forEach((project) => projectManager.createSidebarProject(project, sidebarProjects));