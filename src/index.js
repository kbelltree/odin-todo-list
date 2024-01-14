import { Todo, addTodo, getTodoById, deleteTodoById, toggleCompletedById, editTodoById, addNewCategory, deleteCategory, resetCategoryToInbox, shallowCopyCategories, getModifiedTodos } from './todoDataManager.js';

import { overwriteTodoHeading, refreshTodoList, updateCategoryList } from './pageComponents.js';

import { getFormDataObject, resetForm, resetAndHideForm, getCategoryInputValue, populateCategorySelect, populateEditForm, getEditTodoId } from './todoFormComponents.js';

// Todo form related 
const todoForm = document.getElementById('todo-form');
const todoFormCloseBtn = document.getElementById('close');
const todoFormClearBtn = document.getElementById('clear');

// Category form related
const categoryForm = document.getElementById('category-form');
const categoryCancelBtn = document.getElementById('cancel-category');

// Header related
const sorterWrapper = document.getElementById('sorter');
const addNewTodoBtn = document.getElementById('add-new');

// Sidebar menu related 
const categoryListWrapper = document.getElementById('category-list');
const sidebar = document.getElementById('sidebar');

// Main related
const todoListWrapper = document.getElementById('todo-list');

// Edit todo form related 
const editForm = document.getElementById('edit-form');

// State Management variable
let currentFilterTitle = '';

todoForm.addEventListener('submit', (e) => {
    const formData = getFormDataObject(e);
    
    console.log('formData: ' + formData.title, formData.details, formData.dueDate, formData.priority, formData.category);
    
    const newTodo = new Todo(formData.title, formData.details, formData.dueDate, formData.priority, formData.category);
    
    addTodo(newTodo);   
    
    console.log(newTodo);
   
    e.target.reset();
});

todoFormCloseBtn.addEventListener('click', () => resetAndHideForm('#todo-form'));

todoFormClearBtn.addEventListener('click', () => resetForm('#todo-form'));

categoryForm.addEventListener('submit', (e) => {
    const categoryValue = getCategoryInputValue(e);
    
    // Add new category to categories array
    if (categoryValue) {
        addNewCategory(categoryValue);
       
        console.log('category array: ' + shallowCopyCategories());  
    }

    updateCategoryList(categoryListWrapper, shallowCopyCategories());
    e.target.reset();
})

categoryCancelBtn.addEventListener('click', () => resetAndHideForm('#category-form'));

// Add eventlistener to parent element that handles delete category
categoryListWrapper.addEventListener('click', (e) => { 
    // let categoryName = e.target.dataset.filterName; 
    currentFilterTitle = e.target.dataset.filterName; 

    if (e.target.matches('.delete-category')){
        
        if (currentFilterTitle === 'inbox'){
            alert('This category can not be deleted.')
            return; 
        }

        const isConfirmed = confirm('Are you sure this category is deleted?');
        
        if (!isConfirmed) return; 

        deleteCategory(currentFilterTitle); 
        resetCategoryToInbox(currentFilterTitle);
        updateCategoryList(categoryListWrapper, shallowCopyCategories());
        refreshTodoList(todoListWrapper, getModifiedTodos(currentFilterTitle));
        
        currentFilterTitle = '';
        overwriteTodoHeading(currentFilterTitle);
    }    
})

function sharedEventListener (e) {
    const classList = e.target.classList;
    currentFilterTitle = e.target.dataset.filterName;

    if (!classList || e.target.tagName !== 'BUTTON') {
        console.log('Not a click on static/dynamic buttons.')
        return; 
    }
    
    // if (classList.contains('static-button')|| classList.contains('dynamic-button')) {
    //     // const buttonName = e.target.dataset.filterName; 
    //     currentFilterTitle = e.target.dataset.filterName; 
        
    //     console.log(`sidebar menu button clicked: ${currentFilterTitle}`);
        
    //     overwriteTodoHeading(currentFilterTitle);

    //     updateTodoListByMenuName(todoListWrapper, currentFilterTitle);
    // }
    if (classList.contains('static-button') || classList.contains('dynamic-button')) {
        
        overwriteTodoHeading(currentFilterTitle);
        refreshTodoList(todoListWrapper, getModifiedTodos(currentFilterTitle));
    }
}

// Add event to the parent elements that responds click on filter or sort buttons 
sidebar.addEventListener('click', sharedEventListener);

sorterWrapper.addEventListener('click', sharedEventListener);

addNewTodoBtn.addEventListener('click', () => {
    // TODO: Display Todo form

    console.log('addNewTodo triggered. categories copy array: ' + shallowCopyCategories())
    // New category appears on click of the button and open add todo form.  
    populateCategorySelect(shallowCopyCategories(), 'category-option');
})

const addCategoryBtn = document.getElementById('add-category');
// add eventListener that displays the form on click 


todoListWrapper.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    const todoId = parseInt(todoItem.dataset.id, 10); 
    
    console.log('todoId retrieved onclick: ' + todoId);
    
    // const menuName = document.querySelector('#todo-heading h2').dataset.filterName;
    
    if (!todoItem) {
       console.log('A click is made outside of todoList.');
       return; 
    }

    // Completed box 
    if (e.target.matches('.todo-checkbox')) {
        toggleCompletedById(todoId);
        // Add a UI function that strike-through the list responding by boolean

    // Edit button 
    } else if (e.target.matches('.edit-todo')) {
        console.log('edit-todo button clicked.');
        // Display edit form

        console.log('Todo Object:', getTodoById(todoId));
        
        // Reflect category box with current categories array values
        populateCategorySelect(shallowCopyCategories(), 'edit-category');

        // Populate the form with the current todo data
        populateEditForm(getTodoById(todoId), todoId);
      

    // Delete button 
    } else if (e.target.matches('.delete-todo')) {
        
        const isConfirmed = confirm('Are you sure it is permanently deleted?');
        
        if(!isConfirmed) return;
        
        deleteTodoById(todoId);
        console.log(currentFilterTitle);
        refreshTodoList(todoListWrapper, getModifiedTodos(currentFilterTitle));
    }
} )

editForm.addEventListener('submit', (e) => {
    const formData = getFormDataObject(e);
    const todoIdOnEdit = getEditTodoId(e);
    // const menuName = document.querySelector('#todo-heading h2').dataset.filterName;

    console.log('formData and ID: ' + formData.title, formData.details, formData.dueDate, formData.priority, formData.category, formData, todoIdOnEdit);
    
    // Update the object with new formData
    editTodoById(todoIdOnEdit, formData);
    refreshTodoList(todoListWrapper, getModifiedTodos(currentFilterTitle));
    e.target.reset();   
});

// On load, display default page 'today' with today's todos objects, and display all existing categories from categories array
document.addEventListener('DOMContentLoaded', () => {
    refreshTodoList(todoListWrapper, getModifiedTodos('today'));
    updateCategoryList(categoryListWrapper, shallowCopyCategories());
    populateCategorySelect(shallowCopyCategories(), 'category-option');
}, { once: true });

