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
    setTimeout(() => {
        dialog.close();
        dialog.classList.remove("hide");
    }, 500);
}

export { initializeNextId, openDialog, closeDialog };