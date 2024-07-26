import { Project } from "./project";
import { createTaskCard } from "./taskManager";
import { openDialog } from "./utils";

function submitProjectForm(projectDialog) {
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
}

function createProjectCard(project, mainSectionContent, sidebarProjects) {
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");
    projectCard.innerText = project.title;
    projectCard.dataset.projectId = project.id;
    mainSectionContent.appendChild(projectCard);

    createSidebarProject(project, sidebarProjects);
}

function createSidebarProject(project, sidebarProjects) {
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

function displayProject(projectId, mainSectionContent, mainSectionHeader) {
    mainSectionHeader.replaceChildren();
    mainSectionContent.replaceChildren();

    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const projectTpDisplay = projects.find((project) => project.id == projectId);
    const projectHeader = document.createElement("div");
    projectHeader.classList.add("project-header");
    projectHeader.innerText = `${projectTpDisplay.title} Project`;
    mainSectionHeader.appendChild(projectHeader);

    const editContainer = document.createElement("div");
    editContainer.classList.add("peoject-edit-container");

    const editButton = document.createElement("span");
    editButton.classList.add("material-symbols-outlined", "project-edit");
    editButton.innerText = "edit_note";
    editContainer.appendChild(editButton);

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("material-symbols-outlined", "project-delete");
    deleteButton.innerText = "delete";
    mainSectionHeader.dataset.projectId = projectId;
    editContainer.appendChild(deleteButton);
    mainSectionHeader.appendChild(editContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("add-button-container");
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
    buttonContainer.appendChild(addTaskToProjectButton);

    mainSectionContent.appendChild(buttonContainer);
    tasks.filter((task) => task.projectId === projectId).forEach((task) => createTaskCard(task, mainSectionContent));
}

function openEditProjectDialog(projectId, projectDialog) {
    const projectTitleEdit = document.querySelector("#project-title");
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const project = projects.find((project) => project.id == projectId);
    if (project) {
        projectTitleEdit.value = project.title;
        projectDialog.dataset.projectId = projectId;
        projectDialog.dataset.isEdit = "true";
        openDialog(projectDialog);
    }
}

function openDeleteProjectDialog(projectId) {
    const confirmDeleteDialog = document.querySelector("#confirm-project-delete");
    confirmDeleteDialog.dataset.projectId = projectId;
    openDialog(confirmDeleteDialog);
}

function deleteProject(projectId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let projects = JSON.parse(localStorage.getItem("projects"));

    projects = projects.filter((project) => project.id != projectId) || [];
    tasks = tasks.filter((task) => task.projectId !=projectId);

    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showAllProjects(mainSectionHeader, mainSectionContent, sidebarProjects) {
    mainSectionHeader.innerText = "All Projects";
    mainSectionContent.replaceChildren();
    sidebarProjects.replaceChildren();
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.forEach((project) => createProjectCard(project, mainSectionContent, sidebarProjects));
}

export { submitProjectForm, createSidebarProject, displayProject, openEditProjectDialog, openDeleteProjectDialog, deleteProject, showAllProjects };