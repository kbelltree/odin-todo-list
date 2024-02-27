import { format, parseISO } from 'date-fns';

import highPriorityImage from './assets/images/icons8-high-priority-24.png';
import mediumPriorityImage from './assets/images/icons8-medium-priority-24.png';
import lowPriorityImage from './assets/images/icons8-low-priority-24.png';

function getPriorityImage(todoObj) {
    switch (todoObj.priority) {
        case 'high':
            case 'high':
            return { src: highPriorityImage, alt: 'High Priority' };
        case 'medium':
            return { src: mediumPriorityImage, alt: 'Medium Priority' };
        case 'low':
            return { src: lowPriorityImage, alt: 'Low Priority' };
        case 'none':
        default:
            return { src: '', alt: '' }; 
    }
}

function formatDateForList(todoObj) {
    const dateString = todoObj.dueDate; 
    if (dateString === '') {
        return dateString; 
    }
    const parsedDate = parseISO(dateString);
    const formattedDate = format(parsedDate, 'EEE, MMM d, yyyy');

    return formattedDate; 
}

function markCompletedTodos(todoObj) {
    const completed = todoObj.completed;
    if (completed) return 'completed';  
}

function formatListToHTML(todo) {
    const template = document.getElementById('list-template');
    const clone = template.content.cloneNode(true);

    const priorityImg = getPriorityImage(todo);
    const dueDate = formatDateForList(todo);
    const completed = markCompletedTodos(todo);

    clone.querySelector('.todo-item').dataset.id = todo.id; 
    clone.querySelector('.todo-item').classList.add(completed);
    clone.querySelector('.todo-title').textContent = todo.title; 
    clone.querySelector('.todo-details').textContent = todo.details; 
    clone.querySelector('.priority-indicator').src = priorityImg.src; 
    clone.querySelector('.priority-indicator').alt = priorityImg.alt; 
    clone.querySelector('.todo-date').textContent = dueDate; 
    
    return clone; 
}

function clearTodoList(wrapperDiv) {
    while (wrapperDiv.firstChild) {
        wrapperDiv.removeChild(wrapperDiv.firstChild);
         } 
}

function createTodoList(array) {
    if (!array || array.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'nice! no todos in this project.';
        p.classList.add('message-format');
        return p; 

    } else {
        const ul = document.createElement('ul');
        array.forEach(todoObj => {
            const todoItem = formatListToHTML(todoObj);
            ul.appendChild(todoItem);
        })
        return ul; 
    }
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
        li.appendChild(menuButton);
        
        if (category !== 'inbox') {
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('data-filter-name', category); 
            deleteButton.classList.add('delete-category');
            deleteButton.classList.add('button-image');
            deleteButton.setAttribute('aria-label', 'Delete this category');
            li.appendChild(deleteButton);
        }

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

export function refreshTodoList(containerId, array) {   
    const container = document.getElementById(containerId);
    const listsHTML = createTodoList(array);
    clearTodoList(container);
    container.appendChild(listsHTML);
}

export function updateCategoryList(containerId, array) {
    const container = document.getElementById(containerId);
    clearTodoList(container);

    const listsHTML = createCategoryMenu(array);

    container.appendChild(listsHTML);

}

export function displayForm(containerId) {
    const container = document.getElementById(containerId);
    container.setAttribute('style', 'display: block;');
}

export function closeForm(containerId) {
    const container = document.getElementById(containerId);
    container.setAttribute('style', 'display: none;');
}

export function resetForm(formId) {
    const form = document.getElementById(formId);
    
    if (form) {
        form.reset();
    }
}

export function resetAndHideForm(formId) {
    const form = document.querySelector(formId);

    if (form) {
        form.reset();
        form.classList.add('hidden');
    }
}

export function populateCategorySelect(categoriesArray, selectId) {
    const select = document.getElementById(selectId);
    
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    categoriesArray.forEach(category => {
        const option = document.createElement('option');
        option.value = category; 
        option.textContent = category;
        
        // Default is 'inbox'
        if (category === 'inbox') {
            option.selected = true; 
        } 

        select.appendChild(option);
    })

}

export function populateEditForm(todoObjCopy, todoId) {
     document.getElementById('edit-title').value = todoObjCopy.title; 
     document.getElementById('edit-details').value = todoObjCopy.details; 
     document.getElementById('edit-date').value = todoObjCopy.dueDate;
     document.getElementById('edit-priority').value = todoObjCopy.priority;
     document.getElementById('edit-category').value = todoObjCopy.category;
     document.getElementById('edit-form').dataset.id = todoId; 
}

