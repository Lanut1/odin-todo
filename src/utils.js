import { Project } from "./project";
import { Task } from "./task";
import { addDays, nextFriday, nextSaturday, nextSunday } from "date-fns";

function initializeNextId(objectName, objectClass) {
    const objects = JSON.parse(localStorage.getItem(objectName)) || [];
    if (objects.length > 0) {
        objectClass.nextId = Math.max(...objects.map(object => object.id)) + 1; 
    }
}

function openDialog(dialog) {
    dialog.classList.add("show");
    dialog.showModal();
}

function closeDialog(dialog) {
    dialog.classList.remove("show");
    dialog.classList.add("hide");
    dialog.dataset.isEdit = "false";
    setTimeout(() => {
        dialog.close();
        dialog.classList.remove("hide");
    }, 500);
}

function isMobile() {
    return window.innerWidth <= 768;
  }

 function createDOMElement(tagName, ...className) {
    const element = document.createElement(tagName);
    if (className && className.length > 0) element.classList.add(...className);
    return element;
}
function initializeEventListeners(actions) {
    actions.forEach(action => {
        const button = document.querySelector(action.selector);
        button.addEventListener("click", action.handler);
    });
};

function initializeSampleData() {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (projects.length === 0 && tasks.length === 0) {
        const sampleProjects = [
            new Project("Programming"),
            new Project("Weekend"),
            new Project("Cooking")
        ];

        const today = new Date();
        const tomorrow = addDays(today, 1);
        const nextFri = nextFriday(today);
        const nextSat = nextSaturday(today);
        const nextSun = nextSunday(today);

        const sampleTasks = [
            new Task("Read a book", 'Continue reading "The Count of Monte Cristo"', tomorrow, "low", 0),
            new Task("Dentist appointment", "Regular checkup at 2 PM", addDays(today, 6), "high", 0),
            new Task("Yoga session", "Relax yoga lesson", today, "medium", 0),
            new Task("Finish to-do list app", "Complete remaining features and testing", today, "high", 1),
            new Task("Learn SOLID principles", "Study and apply SOLID principles to current project", today, "high", 1),
            new Task("Complete algorithms course", "Finish online course on advanced algorithms", tomorrow, "medium", 1),
            new Task("Study Advanced HTML and CSS", "Learn more about 3D elements and animations", addDays(today, 3), "high", 1),
            new Task("Dinner at new restaurant", "Try the highly-rated Italian place downtown", nextSat, "low", 2),
            new Task("Gym session", "45 minutes cardio and strength training", nextSat, "medium", 2),
            new Task("Hike at national park", "Take a 5-mile trail and picnic", nextSun, "medium", 2),
            new Task("Plan weekly meal prep", "Decide on recipes and create shopping list", today, "medium", 3),
            new Task("Buy ingredients", "Shop for meal prep ingredients", addDays(today, 2), "medium", 3),
            new Task("Visit local farmer's market", "Buy fresh meat and vegies", nextFri, "low", 3),
            new Task("Prepare and cook meals", "Cook and portion meals for the week", nextSun, "high", 3)
        ];

        sampleTasks[3].completed = true;
        sampleTasks[4].completed = true;

        sampleProjects.forEach(project => {
            projects.push(project);
        });

        sampleTasks.forEach(task => {
            tasks.push(task);
        });

        localStorage.setItem("projects", JSON.stringify(projects));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

export { initializeNextId, openDialog, closeDialog, isMobile, createDOMElement, initializeEventListeners, initializeSampleData };