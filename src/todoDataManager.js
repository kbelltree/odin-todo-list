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
       if (text.trim().length === 0) {
            this._title = text.substring(0, 49);
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
        if(!categories.includes(categoryName)) return;

        this.category = categoryName; 
    }

    toggleCompleted() {
        this.completed = !this.completed; 
    }

}

let allTodos = loadAllTodos(ALL_TODOS_KEY, Todo); 
let categories = loadCategories(CATEGORIES_KEY);// 'inbox' is defaulted from localStorage

export function addTodo(todoInstance) {
    allTodos.push(todoInstance);
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

function filterTodosByBeforeTodaysDate() {
    const todaysDate = getTodaysDate();

    return allTodos.filter(todo => todo.dueDate !== '' && todo.dueDate < todaysDate);
}

function filterTodosByDueDate(date) {
    return allTodos.filter(todo => todo.dueDate === date);
}

function filterTodosByCategory(categoryName) {
    return allTodos.filter(todo => todo.category === categoryName);
}

function getTodaysTodos() {
    const arrayReturned = filterTodosByDueDate(getTodaysDate());
    return arrayReturned;  
}

function getUpcomingTodos() {
    const arrayReturned = filterTodosByAfterTodaysDate(); 
    return arrayReturned;
}

function getUnscheduledTodos() {
    const arrayReturned = filterTodosByDueDate('');
    return arrayReturned;  
}

function getCompletedTodos() {
    const arrayReturned = allTodos.filter(todo => todo.completed);
    return arrayReturned; 
}

function getOverdueTodos() {
    const arrayReturned = filterTodosByBeforeTodaysDate();
    return arrayReturned;
}

function getAllTodosShallowCopy() {
    return [...allTodos];
}

function getUnfinishedTodos(filteredArray) {
    const arrayReturned = filteredArray.filter(todo => !todo.completed);
    return arrayReturned; 
}

function getTodosByCategory(categoryName) {
    const arrayReturned = filterTodosByCategory(categoryName);
    return arrayReturned;
}

function getSortedTodosByPriority(filteredArray) {
    return filteredArray.sort(sortAscendingByPriority);
}

function getSortedTodosByDueDate(filteredArray) {
    return filteredArray.sort(sortTodosByDueDate);
}


export function deleteTodoById(todoId) {
    const index = findTodoIndexById(todoId);
        
    if (index !== -1) {
        allTodos.splice(index, 1);
        saveArray(ALL_TODOS_KEY, allTodos);
        return true; 
    } 
        
    return false; 
}

export function getTodoById(todoId) {
    const todoObj = findTodoById(todoId);

    if(todoObj) return todoObj; 

    return null;
}

export function toggleCompletedById(todoId) {
    const todoObj = findTodoById(todoId); 
        if (todoObj) {
            todoObj.toggleCompleted();
            saveArray(ALL_TODOS_KEY, allTodos); 
            return true; 
        } 

        return false;   
}

export function editTodoById(todoId, formData) {
    const todoObj = findTodoById(todoId);
    if (todoObj) {
        todoObj.editTodo(formData);
        saveArray(ALL_TODOS_KEY, allTodos);
        return true; 
    }

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

export function getFilteredTodos(filterType) {
    switch (filterType) {
        case 'today': 
            return getUnfinishedTodos(getTodaysTodos());
        case 'upcoming':
            return getUnfinishedTodos(getUpcomingTodos());
        case 'unscheduled':
            return getUnfinishedTodos(getUnscheduledTodos());
        case 'completed':
            return getCompletedTodos();
        case 'overdue':
            return getUnfinishedTodos(getOverdueTodos());
        case 'all':
            return getAllTodosShallowCopy();
        default: 
            return getUnfinishedTodos(getTodosByCategory(filterType));
    }
}

export function sortFilteredTodos(filteredArray, sortType, sortOrder) {
    let sortedArray;

    switch (sortType) {
        case 'by-priority':
            sortedArray = getSortedTodosByPriority(filteredArray);
            break; 
        case 'by-date':
            sortedArray = getSortedTodosByDueDate(filteredArray);
            break; 
        case '':
            return filteredArray; 
        default: 
            console.log('No matching sorter found.');
            return; 
    }
    
    if (sortOrder === 'descending') {
        sortedArray.reverse();
    }

    return sortedArray; 
}