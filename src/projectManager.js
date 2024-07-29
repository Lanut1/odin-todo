import { Project } from "./project";
import TaskManager from "./taskManager";
import { openDialog, createDOMElement } from "./utils";

class ProjectManager {
    constructor() {
        this.projects = this.loadProjects();
        this.tasks = this.loadTasks();
    }

    loadProjects() {
        return JSON.parse(localStorage.getItem("projects")) || [];
    }

    loadTasks() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }

    saveProjects() {
        localStorage.setItem("projects", JSON.stringify(this.projects));
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    submitProjectForm(projectDialog) {
        const projectTitle = document.querySelector("#project-title").value;
        if (projectDialog.dataset.isEdit == "true") {
            const projectToEdit = this.projects.find(project => project.id == projectDialog.dataset.projectId);
            projectToEdit.title = projectTitle;
            projectDialog.dataset.isEdit = "false";
        } else {
            const newProject = new Project(projectTitle);
            this.projects.push(newProject);
        }
        this.saveProjects();
    }

    createSidebarProject(project, sidebarProjects) {
        const sidebarProjectCard = createDOMElement("button", "sidebar-project-card", "sidebar-button");
        sidebarProjectCard.dataset.projectId = project.id;

        const folderIcon = createDOMElement("span", "material-symbols-outlined", "sidebar-button");
        folderIcon.innerText = "folder_open";
        sidebarProjectCard.appendChild(folderIcon);

        const projectHeader = createDOMElement("div", "sidebar-project-card-header", "sidebar-button");
        projectHeader.innerText = project.title;
        sidebarProjectCard.appendChild(projectHeader);

        sidebarProjects.appendChild(sidebarProjectCard);
    }

    createProjectCard(project, mainSectionContent, sidebarProjects) {
        const projectCard = createDOMElement("div", "project-card");
        projectCard.innerText = project.title;
        projectCard.dataset.projectId = project.id;
        mainSectionContent.appendChild(projectCard);
    
        this.createSidebarProject(project, sidebarProjects);
    }

    displayProject(projectId, mainSectionContent, mainSectionHeader) {
        mainSectionHeader.replaceChildren();
        mainSectionContent.replaceChildren();
        const projectTpDisplay = this.projects.find((project) => project.id == projectId);
        const projectHeader = createDOMElement("div", "project-header");
        projectHeader.innerText = `${projectTpDisplay.title} Project`;
        mainSectionHeader.appendChild(projectHeader);

        const editContainer = createDOMElement("div", "peoject-edit-container");
        const editButton = createDOMElement("span", "material-symbols-outlined", "project-edit");
        editButton.innerText = "edit_note";
        editContainer.appendChild(editButton);

        const deleteButton = createDOMElement("span", "material-symbols-outlined", "project-delete");
        deleteButton.innerText = "delete";
        mainSectionHeader.dataset.projectId = projectId;
        editContainer.appendChild(deleteButton);
        mainSectionHeader.appendChild(editContainer);

        const buttonContainer = createDOMElement("div", "add-button-container");
        const addTaskToProjectButton = createDOMElement("button");
        addTaskToProjectButton.id = "add-project-task";
        addTaskToProjectButton.dataset.projectId = projectId;

        const addIcon = createDOMElement("span", "material-symbols-outlined");
        addIcon.innerText = "add_circle";
        addTaskToProjectButton.appendChild(addIcon);

        const addTask = createDOMElement("div", "add-task-label");
        addTask.innerText = "Add Project Task";
        addTaskToProjectButton.appendChild(addTask);
        buttonContainer.appendChild(addTaskToProjectButton);

        mainSectionContent.appendChild(buttonContainer);
    }

    openEditProjectDialog(projectId, projectDialog) {
        const projectTitleEdit = document.querySelector("#project-title");
        const project = this.projects.find((project) => project.id == projectId);
        if (project) {
            projectTitleEdit.value = project.title;
            projectDialog.dataset.projectId = projectId;
            projectDialog.dataset.isEdit = "true";
            openDialog(projectDialog);
        }
    }

    openDeleteProjectDialog(projectId) {
        const confirmDeleteDialog = document.querySelector("#confirm-project-delete");
        confirmDeleteDialog.dataset.projectId = projectId;
        openDialog(confirmDeleteDialog);
    }

    deleteProject(projectId) {
        this.projects = this.projects.filter((project) => project.id != projectId) || [];
        this.tasks = this.tasks.filter((task) => task.projectId != projectId);

        this.saveProjects();
        this.saveTasks();
    }
    
    showAllProjects(mainSectionHeader, mainSectionContent, sidebarProjects) {
        mainSectionHeader.innerText = "All Projects";
        mainSectionContent.replaceChildren();
        sidebarProjects.replaceChildren();
        this.projects.forEach((project) => this.createProjectCard(project, mainSectionContent, sidebarProjects));
    }
}

export default ProjectManager;