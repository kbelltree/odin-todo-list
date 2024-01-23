function formatListToHTML(todo) {
    const template = document.getElementById('list-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.todo-item').dataset.id = todo.id; 
    clone.querySelector('.todo-title').textContent = todo.title; 
    clone.querySelector('.todo-details').textContent = todo.details; 
    
    return clone; 
}

function clearTodoList(wrapperDiv) {
    while (wrapperDiv.firstChild) {
        wrapperDiv.removeChild(wrapperDiv.firstChild);
         } 
}

function createTodoList(array) {
    
    if (!array) return; 
    
    const ul = document.createElement('ul');
  
    array.forEach(todoObj => {
        const todoItem = formatListToHTML(todoObj);
        ul.appendChild(todoItem);
    })

    return ul; 
}

function createCategoryMenu(array) {
    const ul = document.createElement('ul');

    array.forEach(category => {
        const li = document.createElement('li');
        const menuButton = document.createElement('button');
        const deleteButton = document.createElement('button');
        li.classList.add('category-item');
        menuButton.setAttribute('type', 'button');
        menuButton.setAttribute('data-filter-name', category); 
        menuButton.classList.add('dynamic-button');
        menuButton.textContent = category; 
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('data-filter-name', category); 
        deleteButton.classList.add('delete-category');
        deleteButton.classList.add('button-image');
        deleteButton.setAttribute('aria-label', 'Delete this category');
        
        li.append(menuButton, deleteButton);
        ul.appendChild(li);
    })

    return ul; 
}

export function overwriteTodoHeading(filterName) {
    if (filterName === 'by-priority' || filterName === 'by-date'){
       return; 
    }
    const todoHeading = document.querySelector('#todo-heading h2');
    todoHeading.textContent = filterName; 
    todoHeading.dataset.filterName = filterName;
    
    return todoHeading;
}

export function refreshTodoList(wrapperDiv, array) {   
    const listsHTML = createTodoList(array);
    clearTodoList(wrapperDiv);
    wrapperDiv.appendChild(listsHTML);
}

export function updateCategoryList(wrapperDiv, array) {
    
    clearTodoList(wrapperDiv);

    const listsHTML = createCategoryMenu(array);

    wrapperDiv.appendChild(listsHTML);

}
