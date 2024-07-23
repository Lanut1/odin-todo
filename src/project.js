class Project {
    static nextId = 0;

    constructor(title) {
        this.title = title;
        this.id = Project.nextId++;
    }
}

export { Project };