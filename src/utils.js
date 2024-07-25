function initializeNextId(objectName, objectClass) {
    const objects = JSON.parse(localStorage.getItem(objectName)) || [];
    if (objects.length > 0) {
        objectClass.nextId = Math.max(...objects.map(object => object.id)) + 1; 
    }
}

export { initializeNextId };