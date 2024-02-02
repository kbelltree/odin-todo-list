export function getFormDataObject(e) {
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

export function getCategoryInputValue(e) {
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

export function getEditTodoId(e) {
    e.preventDefault();
    
    const todoId = parseInt(e.target.dataset.id, 10); 

    return todoId; 
}