// Keep key name consistent to prevent from duplicating array contents with different key name
export const ALL_TODOS_KEY = 'savedAllTodos';
export const TODO_ID_COUNTER_KEY = 'todoIDCounter';
export const CATEGORIES_KEY = 'savedCategories';

export function loadAllTodos(key, objClass) {
    const savedAllTodos = JSON.parse(localStorage.getItem(key));

    if (!savedAllTodos) {
        return [];
    }
    
    // Reattach all prototype methods and getter/setters to reconstructed todo objects
    return savedAllTodos.map(savedTodoObj => Object.create(objClass.prototype, Object.getOwnPropertyDescriptors(savedTodoObj)));

}

export function loadTodoIdCounter(){
    const savedTodoId = parseInt(localStorage.getItem(TODO_ID_COUNTER_KEY), 10);
    if (!savedTodoId){
        return 0;
    }
    return savedTodoId; 
}

export function loadCategories(key) {
    const savedCategories = JSON.parse(localStorage.getItem(key));

    // If no categories in localStorage, save the default 
    if (!savedCategories) {
        return ['inbox'];
    }

    return savedCategories;
}


export function saveArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

export function saveTodoId(key, classKey) {
    localStorage.setItem(key, classKey);
}