import { Task } from "./task.js";
import { Project } from "./project.js"
import "./style.css";
import logo from "./images/check.png";
import { submitProjectForm, createSidebarProject, displayProject, openEditProjectDialog, openDeleteProjectDialog, deleteProject, showAllProjects } from "./projectManager.js";
import { submitTaskForm, showAddTaskDialog, openEditTaskDialog, deleteTask, completeTask, showAllTasks, showTodayTasks, showTomorrowTasks, showWeekTasks, showOverdue, showImportant, showCompleted } from "./taskManager.js";
import { initializeNextId } from "./utils.js";
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

addTaskButton.addEventListener("click", () => {
    showAddTaskDialog(0, taskDialog);
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

initializeNextId("tasks", Task);
initializeNextId("projects", Project);

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskProjectId = taskDialog.dataset.projectId;
    submitTaskForm(taskDialog, taskProjectId);
    taskForm.reset();
    taskDialog.close();

    if (taskProjectId == 0) {
        showAllTasks(mainSectionHeader, mainSectionContent);
    } else {
        displayProject(taskProjectId, mainSectionContent, mainSectionHeader);
    }
})

projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitProjectForm(projectDialog);
    projectForm.reset();
    projectDialog.close();
    showAllProjects(mainSectionHeader, mainSectionContent, sidebarProjects);
})

showAllTasks(mainSectionHeader, mainSectionContent);

const sidebarProjects = document.querySelector(".projects-container");
sidebarProjects.addEventListener("click", (event) => {
    if (event.target.classList.contains("sidebar-button")) {
        const projectToShow = event.target.closest(".sidebar-project-card");
        const projectId = projectToShow.dataset.projectId;
        displayProject(projectId, mainSectionContent, mainSectionHeader);
    }
})

const projects = JSON.parse(localStorage.getItem('projects')) || [];
projects.forEach((project) => createSidebarProject(project, sidebarProjects));

const confirmDeleteDialog = document.querySelector("#confirm-project-delete");
const cancelButton = document.querySelector("#cancel-delete");
const confirmDeleteButton = document.querySelector("#confirm-delete");

cancelButton.addEventListener("click", () => {
    confirmDeleteDialog.close();
})

confirmDeleteButton.addEventListener("click", () => {
    const projectId = confirmDeleteDialog.dataset.projectId;
    deleteProject(projectId);
    showAllProjects(mainSectionHeader, mainSectionContent, sidebarProjects); //
    confirmDeleteDialog.close();
})

mainSectionHeader.addEventListener("click", (event) => {
    const project = mainSectionHeader.dataset.projectId;
    if (event.target.classList.contains("project-delete")) {
        openDeleteProjectDialog(project);
    } else if (event.target.classList.contains("project-edit")) {
        openEditProjectDialog(project, projectDialog);
    }
})

mainSectionContent.addEventListener("click", (event) => {
    const taskCard = event.target.closest(".task-card");
    const projectCard = event.target.closest(".project-card");
    const addProject = event.target.closest("#add-project-task");

    if (taskCard) {
        const taskId = taskCard.dataset.taskId;
        if (event.target.classList.contains("task-delete")) {
            deleteTask(taskId);
            taskCard.remove();
        } else if (event.target.classList.contains("task-checkbox")) {
            const isCompleted = event.target.checked;
            completeTask(taskId, isCompleted);
            taskCard.classList.toggle("completed", isCompleted);
        } else if (event.target.classList.contains("task-edit")) {
            openEditTaskDialog(taskId, taskDialog);
        }
    } else if (projectCard) {
        const projectId = projectCard.dataset.projectId;
        displayProject(projectId, mainSectionContent, mainSectionHeader);
    } else if (addProject) {
        const projectId = addProject.dataset.projectId;
        showAddTaskDialog(projectId, taskDialog);
    }
});

const showAllTasksButton = document.querySelector("#show-all-tasks");
showAllTasksButton.addEventListener("click", () => showAllTasks(mainSectionHeader, mainSectionContent));

const showAllProjectsButton = document.querySelector("#show-all-projects");
showAllProjectsButton.addEventListener("click", () => showAllProjects(mainSectionHeader, mainSectionContent, sidebarProjects));

const showTodayTasksButton = document.querySelector("#show-today-tasks");
showTodayTasksButton.addEventListener("click", () => showTodayTasks(mainSectionHeader, mainSectionContent));

const showTomorrowTasksButton = document.querySelector("#show-tomorrow-tasks");
showTomorrowTasksButton.addEventListener("click", () => showTomorrowTasks(mainSectionHeader, mainSectionContent));

const showWeekTasksButton = document.querySelector("#show-week-tasks");
showWeekTasksButton.addEventListener("click", () => showWeekTasks(mainSectionHeader, mainSectionContent));

const showOverdueButton = document.querySelector("#show-overdue");
showOverdueButton.addEventListener("click", () => showOverdue(mainSectionHeader, mainSectionContent));

const showImportantButton = document.querySelector("#show-important");
showImportantButton.addEventListener("click",  () => showImportant(mainSectionHeader, mainSectionContent));

const showCompletedButton = document.querySelector("#show-completed");
showCompletedButton.addEventListener("click", () => showCompleted(mainSectionHeader, mainSectionContent));