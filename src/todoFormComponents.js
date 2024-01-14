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

export function resetForm(formId) {
    const form = document.querySelector(formId);
    console.log(form);
    if (form) {
        form.reset();
    }
}

export function resetAndHideForm(formId) {
    const form = document.querySelector(formId);
    console.log(form);
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
     console.log(`populateEditForm priority & category: ${todoObjCopy.priority} & ${todoObjCopy.category}`);
     document.getElementById('edit-category').value = todoObjCopy.category;
     document.getElementById('edit-form').dataset.id = todoId; 
}

export function getEditTodoId(e) {
    e.preventDefault();
    
    const todoId = parseInt(e.target.dataset.id, 10); 

    return todoId; 
}