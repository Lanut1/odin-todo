import { Task } from "./task";
import { isToday, isTomorrow, isThisWeek, isBefore, startOfToday } from "date-fns";
import { openDialog, createDOMElement } from "./utils";

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    addTask(title, description, date, priority, projectId) {
        const newTask = new Task(title, description, new Date(date), priority, projectId);
        this.tasks.push(newTask);
        this.saveTasks();
    }

    updateTask(taskId, updatedData) {
        const taskIndex = this.tasks.findIndex(task => task.id == taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedData };
            this.saveTasks();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id != taskId);
        this.saveTasks();
    }

    completeTask(taskId, isCompleted) {
        this.updateTask(taskId, { completed: isCompleted });
    }

    submitTaskForm(taskDialog, taskProjectId) {
        const taskTitle = document.querySelector("#task-title").value;
        const taskDescription = document.querySelector("#task-description").value;
        const taskDate = document.querySelector("#task-date").value;
        const taskPriority = document.querySelector("#task-priority").value;

        if (taskDialog.dataset.isEdit == "true") {
            this.updateTask(taskDialog.dataset.taskId, {
                title: taskTitle,
                description: taskDescription,
                date: new Date(taskDate),
                priority: taskPriority
            });
            taskDialog.dataset.isEdit = "false";
        } else {
            this.addTask(taskTitle, taskDescription, taskDate, taskPriority, taskProjectId)
        }
    }

    createCheckbox(task) {
        const checkboxContainer = createDOMElement("div", "pretty", "p-icon", "p-round", "p-tada");
        const checkbox = createDOMElement("input", "task-checkbox");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkboxContainer.appendChild(checkbox);

        const stateDiv = createDOMElement("div", "state", "p-success");
        const icon = createDOMElement("i", "icon", "mdi", "mdi-check");
        stateDiv.appendChild(icon);

        const label = createDOMElement("label");
        label.innerText = "";
        stateDiv.appendChild(label);
  
        checkboxContainer.appendChild(stateDiv);
      
        return checkboxContainer;
    }

    createFirstCardRow(task) {
        const firstRowContainer = createDOMElement("div", "first-row-container");
        const titleContainer = createDOMElement("div", "title-container");
        
        const taskCheckbox = this.createCheckbox(task);
        titleContainer.appendChild(taskCheckbox);

        const taskCardTitle = createDOMElement("div", "task-card-title");
        taskCardTitle.innerText = task.title;
        titleContainer.appendChild(taskCardTitle);
        firstRowContainer.appendChild(titleContainer);

        const editContainer = createDOMElement("div", "edit-container");
        const taskCardDate = createDOMElement("div", "task-card-date");
        const date = new Date(task.date);
        const formattedDate = date.toISOString().split('T')[0];
        taskCardDate.innerText = formattedDate;
        editContainer.appendChild(taskCardDate);

        const editButton = createDOMElement("span", "material-symbols-outlined", "task-edit");
        editButton.innerText = "edit_note";
        editContainer.appendChild(editButton);

        const deleteButton = createDOMElement("span", "material-symbols-outlined", "task-delete");
        deleteButton.innerText = "delete";

        editContainer.appendChild(deleteButton);
        firstRowContainer.appendChild(editContainer);

        return firstRowContainer;
    }

    createSecondCardRow(task) {
        const secondRowContainer = createDOMElement("div", "second-row-container");
        const taskCardDescription = createDOMElement("div", "task-card-description");
        taskCardDescription.innerText = task.description;
        secondRowContainer.appendChild(taskCardDescription);

        const taskCardProject = createDOMElement("div", "task-card-project");
        const projectId = task.projectId;
        if (projectId > 0) {
            const projects = JSON.parse(localStorage.getItem("projects"));
            const projectToDisplay = projects.find(project => project.id == projectId);
            taskCardProject.innerText = projectToDisplay.title;
        }
        secondRowContainer.appendChild(taskCardProject);
        return secondRowContainer;
    }

    createTaskCard(task, mainSectionContent) {
        const taskCard = createDOMElement("div", "task-card");
        taskCard.dataset.taskId = task.id;
        if (task.completed) taskCard.classList.add("completed");

        if (task.priority === "high") taskCard.classList.add("priority-high");
        else if (task.priority === "medium") taskCard.classList.add("priority-medium");
        else taskCard.classList.add("priority-low");

        const firstRowContainer = this.createFirstCardRow(task);
        taskCard.appendChild(firstRowContainer);
        const secondRowContainer = this.createSecondCardRow(task);
        taskCard.appendChild(secondRowContainer);

        mainSectionContent.appendChild(taskCard);
    }

    showAddTaskDialog(projectId, taskDialog) {
        taskDialog.dataset.projectId = projectId;
        openDialog(taskDialog);
    }

    openEditTaskDialog(taskId, taskDialog) {
        const task = this.tasks.find((task) => task.id == taskId);
        if (task) {
            document.querySelector("#task-title").value = task.title;
            document.querySelector("#task-description").value = task.description;
            const formattedDate = new Date(task.date).toISOString().split('T')[0];
            document.querySelector("#task-date").value = formattedDate;
            document.querySelector("#task-priority").value = task.priority;
            taskDialog.dataset.projectId = task.projectId;
            taskDialog.dataset.taskId = taskId;
            taskDialog.dataset.isEdit = "true";
            openDialog(taskDialog);
        }
    }

    showTasks(mainSectionHeader, mainSectionContent, filterFunction, headerText) {
        mainSectionHeader.innerText = headerText;
        mainSectionContent.replaceChildren();
        const filteredTasks = this.tasks.filter(filterFunction);
        filteredTasks.forEach((task) => this.createTaskCard(task, mainSectionContent));
    }

    showAllTasks(mainSectionHeader, mainSectionContent) {
        this.showTasks(mainSectionHeader, mainSectionContent, () => true, "All Tasks");
    }

    showTodayTasks(mainSectionHeader, mainSectionContent) {
        this.showTasks(mainSectionHeader, mainSectionContent, (task) => isToday(task.date), "Today Tasks");
    }

    showTomorrowTasks(mainSectionHeader, mainSectionContent) {
        this.showTasks(mainSectionHeader, mainSectionContent, (task) => isTomorrow(task.date), "Tomorrow Tasks");
    }

    showWeekTasks(mainSectionHeader, mainSectionContent) {
        this.showTasks(mainSectionHeader, mainSectionContent, (task) => isThisWeek(task.date), "Week Tasks");
    }

    showOverdue(mainSectionHeader, mainSectionContent) {
        const today = startOfToday();
        this.showTasks(mainSectionHeader, mainSectionContent, 
            (task) => isBefore(task.date, today) && !task.completed, "Overdue Tasks");
    }

    showImportant(mainSectionHeader, mainSectionContent) {
        this.showTasks(mainSectionHeader, mainSectionContent, (task) => task.priority === "high", "Important Tasks");
    }

    showCompleted(mainSectionHeader, mainSectionContent) {
        this.showTasks(mainSectionHeader, mainSectionContent, (task) => task.completed, "Completed Tasks");
    }
}

export default TaskManager;