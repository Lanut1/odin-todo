class Task {
    constructor(title, description, date, priority, projectId = 0) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.projectId = projectId;
    }
};

export { Task };