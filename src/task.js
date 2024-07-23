class Task {
    static nextId = 0;

    constructor(title, description, date, priority, projectId = 0) {
        this.id = Task.nextId++;
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.completed = false;
        this.projectId = projectId;
    }
};

export { Task };