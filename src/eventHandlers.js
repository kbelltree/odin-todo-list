import { Todo, addTodo, getTodoById, deleteTodoById, toggleCompletedById, editTodoById, addNewCategory, deleteCategory, resetCategoryToInbox, shallowCopyCategories, getFilteredTodos, sortFilteredTodos, getPriorityById } from './todoDataManager.js';

import { overwriteTodoHeading, refreshTodoList, updateCategoryList, addClassToCompletedTodos, displayForm, closeForm, resetForm, populateCategorySelect, populateEditForm } from './UI.js';

import { getCurrentFilterTitle, setCurrentFilterTitle } from './stateManager.js';

function getFormDataObject(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);

    return { 
        title: formData.get('title'), 
        details: formData.get('details'), 
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority'),
        category: formData.get('category-option')
    }
}

function getCategoryInputValue(e) {
    e.preventDefault();

    const newCategory = document.querySelector('#new-category').value;

    // Prevent white space or empty entry from being passed as new category
    if (newCategory.trim().length === 0) {
        console.log('empty entry, ignored.')
        return; 
    } else {
        console.log('new category: ' + newCategory);
        return newCategory.toLowerCase();
    }    
}

function getEditTodoId(e) {
    e.preventDefault();
    
    const todoId = parseInt(e.target.dataset.id, 10); 

    return todoId; 
}

function displayEditForm(todoId) {
    console.log('edit-todo button clicked.');
    // Display edit form
    displayForm('edit-modal');
    console.log('Todo Object:', getTodoById(todoId));
    
    // Reflect category box with current categories array values
    populateCategorySelect(shallowCopyCategories(), 'edit-category');

    // Populate the form with the current todo data
    populateEditForm(getTodoById(todoId), todoId);
}

function updateDataAfterDeleteTodo(todoId) {
    const isConfirmed = confirm('Are you sure it is permanently deleted?');
        
    if(!isConfirmed) return;
        
    deleteTodoById(todoId); 
}

function refreshUIAfterUpdateTodo(currentFilterTitle) {
    refreshTodoList('todo-list', getFilteredTodos(currentFilterTitle));
    addClassToCompletedTodos(currentFilterTitle); 
}

function updateDataAfterDeleteCategory(categoryName) {
    const isConfirmed = confirm('Are you sure this category is deleted?');
    
    if (!isConfirmed) return; 

    deleteCategory(categoryName); 
    resetCategoryToInbox(categoryName);
}

function refreshUIAfterDeleteCategory(categoryName, currentFilterTitle) {
    updateCategoryList('category-list', shallowCopyCategories());
    // in case currentFilterTitle is the same value as categoryName, reset to none. 
    if (currentFilterTitle === categoryName) {
        setCurrentFilterTitle('');  
    } 
    const filterTitleAfterDelete = getCurrentFilterTitle();
    overwriteTodoHeading(filterTitleAfterDelete);
    refreshTodoList('todo-list', getFilteredTodos(filterTitleAfterDelete));    
}

export function handleAddNewTodoClick() {
    // TODO: Display Todo form
    displayForm('add-todo-modal');
    console.log('addNewTodo triggered. categories copy array: ' + shallowCopyCategories());

    // New category appears on click of the button and open add todo form.  
    populateCategorySelect(shallowCopyCategories(), 'category-option');
}

export function handleTodoFormSubmit(e) {
    const formData = getFormDataObject(e);
    
    console.log('formData: ' + formData.title, formData.details, formData.dueDate, formData.priority, formData.category);
    
    const newTodo = new Todo(formData.title, formData.details, formData.dueDate, formData.priority, formData.category);
    
    addTodo(newTodo);   
    refreshTodoList('todo-list', getFilteredTodos(getCurrentFilterTitle()));
    e.target.reset();
};

export function handleTodoFormClose() {
    resetForm('todo-form');
    closeForm('add-todo-modal');
}

export function handleTodoFormClear() {
    resetForm('todo-form');
}

export function handleAddCategoryClick() {
    console.log('currentFilterTitle on addCategoryBtn click: ' + getCurrentFilterTitle());
    resetForm('category-form');
    displayForm('category-form-modal');
}

export function handleCategoryFormSubmit(e) {
    const categoryValue = getCategoryInputValue(e);
    
    // Add new category to categories array
    if (categoryValue) {
        addNewCategory(categoryValue);
       
        console.log('category array: ' + shallowCopyCategories());  
    }

    console.log('currentFilterTitle on category form submit: ' + getCurrentFilterTitle());
    updateCategoryList('category-list', shallowCopyCategories());
    e.target.reset();
    closeForm('category-form-modal');
}

export function handleCategoryFormCancel() {
    resetForm('category-form');
    closeForm('category-form-modal');
}

// Handler attached to a parent element
export function handleCategoryDelete(e) {
    const deleteButton = e.target.matches('.delete-category');
    
    if (!deleteButton) return; 

    const categoryName = e.target.dataset.filterName; 
    const currentFilterTitle = getCurrentFilterTitle();
    console.log('category delete button clicked, currentFilterTitle: ' + currentFilterTitle);

    updateDataAfterDeleteCategory(categoryName);

    refreshUIAfterDeleteCategory(categoryName, currentFilterTitle);
}

// Handler attached to a parent element 
export function handleFilterTitleClick(e) {
    const classList = e.target.classList;

    if (!classList || e.target.tagName !== 'BUTTON') {
        console.log('Not a click on static/dynamic buttons.')
        return; 
    }
    
    const filterName = e.target.dataset.filterName; 
    if (classList.contains('static-button') || classList.contains('dynamic-button')) {
        setCurrentFilterTitle(filterName);
        const currentFilterTitle = getCurrentFilterTitle();
        overwriteTodoHeading(currentFilterTitle);
        refreshTodoList('todo-list', getFilteredTodos(currentFilterTitle));
        addClassToCompletedTodos(currentFilterTitle);
    }
}

// Handler attached to a parent element
export function handleSortBtnClick(e) {
    if (e.target.tagName !== 'BUTTON') {
        console.log('Not a click on buttons.')
        return; 
    }

    const currentFilterTitle = getCurrentFilterTitle();
    const sorterName = e.target.dataset.filterName; 
    const filteredArray = getFilteredTodos(currentFilterTitle);
    console.log(`sorter: ${sorterName}`);
    const sortedArray = sortFilteredTodos(filteredArray, sorterName);

    refreshTodoList('todo-list', sortedArray);
    addClassToCompletedTodos(currentFilterTitle);
}

// Handler attached to a parent element
export function handleTodoListUpdate(e) {
    const todoItem = e.target.closest('.todo-item');
    
    if (!todoItem) {
       console.log('A click is made outside of todoList.');
       return; 
    }

    const todoId = parseInt(todoItem.dataset.id, 10); 
    
    console.log('todoId retrieved onclick: ' + todoId);

    const currentFilterTitle = getCurrentFilterTitle();
    
    // Completed box 
    if (e.target.matches('.todo-checkbox')) {
        setTimeout(() => {
            toggleCompletedById(todoId);
            refreshUIAfterUpdateTodo(currentFilterTitle);
        }, 150);

    // Edit button 
    } else if (e.target.matches('.edit-todo') && currentFilterTitle !== 'completed') {
        displayEditForm(todoId);
    
    // Delete button 
    } else if (e.target.matches('.delete-todo')) {
        updateDataAfterDeleteTodo(todoId);
        refreshUIAfterUpdateTodo(currentFilterTitle);
    }
}

export function handleEditFormSubmit(e) {
    const formData = getFormDataObject(e);
    const todoIdOnEdit = getEditTodoId(e);
    const currentFilterTitle = getCurrentFilterTitle();
    
    console.log('formData and ID: ' + formData.title, formData.details, formData.dueDate, formData.priority, formData.category, formData, todoIdOnEdit);
    
    // Update the object with new formData
    editTodoById(todoIdOnEdit, formData);
    
    console.log('currentFilterTitle on submit: ' + currentFilterTitle)
    refreshTodoList('todo-list', getFilteredTodos(currentFilterTitle));
    e.target.reset();   
    closeForm('edit-modal');
}

export function handleEditFormCancel() {
    resetForm('edit-form');
    closeForm('edit-modal');
}

 // On load, display default page 'today' with today's todos objects, and display all existing categories from categories array
export function loadDefaultContent() {
    setCurrentFilterTitle('today');
    const currentFilterTitle = getCurrentFilterTitle();
    overwriteTodoHeading(currentFilterTitle);
    refreshTodoList('todo-list', getFilteredTodos(currentFilterTitle));
    updateCategoryList('category-list', shallowCopyCategories());
}