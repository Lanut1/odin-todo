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

export { initializeNextId, openDialog, closeDialog, isMobile, createDOMElement, initializeEventListeners };