import { ALL_TODOS_KEY, TODO_ID_COUNTER_KEY, CATEGORIES_KEY, loadAllTodos, loadCategories, loadTodoIdCounter, saveArray, saveTodoId } from './localStorage.js';

import { format } from 'date-fns';

export class Todo {
    static idCounter = loadTodoIdCounter();

    constructor(title, details, dueDate, priority, category) {
        this.title = title, 
        this.details = details, 
        this.dueDate = dueDate, 
        this.priority = priority, 
        this.category = category, 
        this.completed = false,
        this.id = ++Todo.idCounter
    }

    set title(text) {
       if (text.length >= 30) {
            this._title = text.substring(0, 29) + '...';
       } else if (text.trim().length === 0){
            this._title = 'untitled';
       } else {
            this._title = text; 
       }
    }

    get title() {
        return this._title;
    }

    set details(text) {
        if (text.length >= 200) {
            this._details = text.substring(0, 199);
        } else {
            this._details = text; 
        }
    }

    get details() {
        return this._details;
    }

    set priority(string) {
        // Keep priority value in two different type of data (string and number)
        this._priority = string; 

        switch(string) {
            case 'high':
                this._priorityOrder = 1;
                break; 
            case 'medium':
                this._priorityOrder = 2; 
                break; 
            case 'low':
                this._priorityOrder = 3; 
                break;
            case 'none':
            default:
                this._priorityOrder = 4;
                break; 
        }
    }

    get priority(){
        return this._priority;
    }

    get priorityOrder(){
        return this._priorityOrder;
    }

    set category(string) {
        if(string === null){
            this._category = 'inbox';
        } else {
            this._category = string; 
        }
    }

    get category() {
        return this._category; 
    }

    // Method to update the existing todo 
    editTodo(formData) {
        if (formData.title !== this._title) {
            this.title = formData.title;
        } 
        if (formData.details !== this.details) {
            this.details = formData.details; 
        }
        if (formData.dueDate !== this.dueDate) {
            this.dueDate = formData.dueDate; 
        }
        if (formData.priority !== this._priority) {
            this.priority = formData.priority; 
        }
        if (formData.category !== this.category) {
            this.category = formData.category; 
        }
       
    }

    updateCategory(categoryName) {
        if(!categories.includes(categoryName)){
            return;
        }
        this.category = categoryName; 
    }

    toggleCompleted() {
        this.completed = !this.completed; 
    }

}

let allTodos = loadAllTodos(ALL_TODOS_KEY, Todo); 
let categories = loadCategories(CATEGORIES_KEY);// 'inbox' is defaulted from localStorage

// Store filtered todos for dynamic response. 
let filteredTodos = []; 


export function addTodo(todoInstance) {
    allTodos.push(todoInstance);
    console.log(`addTodo: ${allTodos[allTodos.length-1]}`)
    saveArray(ALL_TODOS_KEY, allTodos);
    saveTodoId(TODO_ID_COUNTER_KEY, Todo.idCounter);
}

function findTodoIndexById(todoId) {
    return allTodos.findIndex(todo => todo.id === todoId);
}

function findTodoById(todoId) {
    return allTodos.find(todo => todo.id === todoId);
}

function sortTodosByDueDate(a, b) {
    if (a.dueDate === '') return 1;
    if (b.dueDate === '') return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
}

function sortAscendingByPriority(a, b) {
    return a.priorityOrder - b.priorityOrder; 
}

function getTodaysDate() {
    const today = new Date();
    return format(today, 'yyyy-MM-dd'); 
}

function filterTodosByAfterTodaysDate() {
    const todaysDate = getTodaysDate();
   
    return allTodos.filter(todo => todo.dueDate > todaysDate);
}

function filterTodosByDueDate(date) {
    return allTodos.filter(todo => todo.dueDate === date);
}

function filterTodosByCategory(categoryName) {
    return allTodos.filter(todo => todo.category === categoryName);
}


function getTodaysTodos() {
    filteredTodos = filterTodosByDueDate(getTodaysDate());
    return filteredTodos;  
}

function getUpcomingTodos() {
    filteredTodos = filterTodosByAfterTodaysDate(); 
    return filteredTodos;
}

function getUnscheduledTodos() {
    const filteredTodos = filterTodosByDueDate('');
    return filteredTodos;  
}

function getCompletedTodos() {
    const filteredTodos = allTodos.filter(todo => todo.completed);
    return filteredTodos; 
}

function getSortedTodosByPriority() {
    return filteredTodos.sort(sortAscendingByPriority);
}

function getSortedTodosByDueDate() {
    return filteredTodos.sort(sortTodosByDueDate);
}

function getTodosByCategory(categoryName) {
    filteredTodos = filterTodosByCategory(categoryName);
    return filteredTodos;
}

export function deleteTodoById(todoId) {
    const index = findTodoIndexById(todoId);
    
    console.log('index: ' + index);
    
    if (index !== -1) {
        allTodos.splice(index, 1);
        saveArray(ALL_TODOS_KEY, allTodos);
        return true; 
    } 
    
    console.log('deleteTodoById did not find matching todoId.: ' + todoId);
    
    return false; 
}

export function getTodoById(todoId) {
    const todoObj = findTodoById(todoId);
    if(todoObj) {
        console.log(`todoById: ${todoObj}`);
        return todoObj; 
    }
    return null;
}

export function toggleCompletedById(todoId) {
    const todoObj = findTodoById(todoId); 
        if (todoObj) {
            todoObj.toggleCompleted();
            saveArray(ALL_TODOS_KEY, allTodos); 
            return true; 
        } 
        console.log('toggleCompletedById did not find matching todoId.: ' + todoId);
        return false;   
}

export function editTodoById(todoId, formData) {
    const todoObj = findTodoById(todoId);
    if (todoObj) {
        todoObj.editTodo(formData);
        saveArray(ALL_TODOS_KEY, allTodos);
        return true; 
    }
    console.log('editTodoByIndex did not find matching Id.');
    return false; 
}

export function addNewCategory(categoryName) {
    
    if (categories.includes(categoryName) || !categoryName.trim()) {
        return false; 
    } 
    categories.push(categoryName);
    saveArray(CATEGORIES_KEY, categories);
    return true; 
}

export function deleteCategory(categoryName) {
    const index = categories.indexOf(categoryName);
    
    if (index !== -1 && categoryName !== 'inbox') {
        categories.splice(index, 1);
        saveArray(CATEGORIES_KEY, categories);
        return true; 
    }
    console.log('deleteCategory did not find matching category name: ' + categoryName);
    return false;
}

export function resetCategoryToInbox(removedCategoryName) { 
    // Default to 'inbox'
    allTodos.forEach(todo => {
    if (todo.category === removedCategoryName) {
        todo.category = 'inbox';
    }
   });
   
   saveArray(ALL_TODOS_KEY, allTodos);
}

export function shallowCopyCategories() {
    return [...categories];
}

export function getModifiedTodos(modifierType) {
    switch (modifierType) {
        case 'today': 
            return getTodaysTodos();
        case 'upcoming':
            return getUpcomingTodos();
        case 'unscheduled':
            return getUnscheduledTodos();
        case 'completed':
            return getCompletedTodos();   
        case 'by-priority':
            return getSortedTodosByPriority();
        case 'by-date':
            return getSortedTodosByDueDate();
        default: 
            return getTodosByCategory(modifierType);
    }
}