import { Todo, addTodo, getTodoById, deleteTodoById, toggleCompletedById, editTodoById, addNewCategory, deleteCategory, resetCategoryToInbox, shallowCopyCategories, getFilteredTodos, sortFilteredTodos } from './todoDataManager.js';

import { overwriteTodoHeading, refreshTodoList, updateCategoryList, displayForm, closeForm, resetForm, populateCategorySelect, populateEditForm, resetSelectElementToDefault } from './UI.js';

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
        return newCategory.toLowerCase();
    }    
}

function getEditTodoId(e) {
    e.preventDefault();
    const todoId = parseInt(e.target.dataset.id, 10); 

    return todoId; 
}

function displayEditForm(todoId) {
    // Display edit form
    displayForm('edit-modal');
    
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

function resetOtherSelectOnChange(sorterName, optionValue) {
    if (optionValue === '') return; 

    switch (sorterName) {
        case 'by-priority':
            resetSelectElementToDefault('date-sorter', '');
            break; 
        case 'by-date':
            resetSelectElementToDefault('priority-sorter', '');
            break;
        default:
            return; 
    }
}

function resetSortToDefault(){
    resetSelectElementToDefault('priority-sorter', '');
    resetSelectElementToDefault('date-sorter', '');
}

export function handleAddNewTodoClick() {
    // TODO: Display Todo form
    displayForm('add-todo-modal');

    // New category appears on click of the button and open add todo form.  
    populateCategorySelect(shallowCopyCategories(), 'category-option');
}

export function handleTodoFormSubmit(e) {
    const formData = getFormDataObject(e);
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
    resetForm('category-form');
    displayForm('category-form-modal');
}

export function handleCategoryFormSubmit(e) {
    const categoryValue = getCategoryInputValue(e);
    
    // Add new category to categories array
    if (categoryValue) {
        addNewCategory(categoryValue);
    }

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
        resetSortToDefault();
    }
}

export function handleSortOptionSelect(e) {
    const sorterName = e.target.dataset.filterName; 
    const order = e.target.value; 

    resetOtherSelectOnChange(sorterName, order);
    const currentFilterTitle = getCurrentFilterTitle();
    const filteredArray = getFilteredTodos(currentFilterTitle);
    const sortedArray = sortFilteredTodos(filteredArray, sorterName, order);
    refreshTodoList('todo-list', sortedArray);
} 

// Handler attached to a parent element
export function handleTodoListUpdate(e) {
    const todoItem = e.target.closest('.todo-item');
    
    if (!todoItem) {
       console.log('A click is made outside of todoList.');
       return; 
    }

    const todoId = parseInt(todoItem.dataset.id, 10); 
    const currentFilterTitle = getCurrentFilterTitle();
    
    // Completed box 
    if (e.target.matches('.todo-checkbox')) {
        setTimeout(() => {
            toggleCompletedById(todoId);
            refreshTodoList('todo-list', getFilteredTodos(currentFilterTitle));
        }, 150);

    // Edit button 
    } else if (e.target.matches('.edit-todo') && currentFilterTitle !== 'completed') {
        displayEditForm(todoId);
    
    // Delete button 
    } else if (e.target.matches('.delete-todo')) {
        updateDataAfterDeleteTodo(todoId);
        refreshTodoList('todo-list', getFilteredTodos(currentFilterTitle));
    }
}

export function handleEditFormSubmit(e) {
    const formData = getFormDataObject(e);
    const todoIdOnEdit = getEditTodoId(e);
    const currentFilterTitle = getCurrentFilterTitle();
        
    // Update the object with new formData
    editTodoById(todoIdOnEdit, formData);
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