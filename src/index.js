import { handleTodoFormSubmit, handleTodoFormClose, handleTodoFormClear, handleAddCategoryClick, handleCategoryFormSubmit, handleCategoryFormCancel, handleCategoryDelete, handleFilterTitleClick, handleSortOptionSelect, handleAddNewTodoClick, handleTodoListUpdate, handleEditFormSubmit, handleEditFormCancel, loadDefaultContent } from './eventHandlers.js';

import './style.css';

// Todo form related 
const todoForm = document.getElementById('todo-form');
const todoFormCloseBtn = document.getElementById('close');
const todoFormClearBtn = document.getElementById('clear');

// Category form related
const categoryForm = document.getElementById('category-form');
const addCategoryBtn = document.getElementById('add-new-category');
const categoryCancelBtn = document.getElementById('cancel-category');

// Header related
const prioritySorter = document.getElementById('priority-sorter');
const dateSorter = document.getElementById('date-sorter');

// Sidebar menu related 
const categoryListWrapper = document.getElementById('category-list');
const sidebar = document.getElementById('sidebar');
const addNewTodoBtn = document.getElementById('add-new');

// Main related
const todoListWrapper = document.getElementById('todo-list');

// Edit todo form related 
const editForm = document.getElementById('edit-form');
const editFormCancelBtn = document.getElementById('cancel-edit');

addNewTodoBtn.addEventListener('click', handleAddNewTodoClick);

todoForm.addEventListener('submit', handleTodoFormSubmit);

todoFormCloseBtn.addEventListener('click', handleTodoFormClose);

todoFormClearBtn.addEventListener('click', handleTodoFormClear);

addCategoryBtn.addEventListener('click', handleAddCategoryClick);

categoryForm.addEventListener('submit', handleCategoryFormSubmit);

categoryCancelBtn.addEventListener('click', handleCategoryFormCancel);

categoryListWrapper.addEventListener('click', handleCategoryDelete); 

sidebar.addEventListener('click', handleFilterTitleClick);

prioritySorter.addEventListener('change', handleSortOptionSelect);

dateSorter.addEventListener('change', handleSortOptionSelect);

todoListWrapper.addEventListener('click', handleTodoListUpdate);

editForm.addEventListener('submit', handleEditFormSubmit);

editFormCancelBtn.addEventListener('click', handleEditFormCancel);

document.addEventListener('DOMContentLoaded', loadDefaultContent, { once: true });