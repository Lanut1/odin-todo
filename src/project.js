class Project {
    static nextId = 1;

    constructor(title) {
        this.title = title;
        this.id = Project.nextId++;
    }
}

export { Project };