let currentState = {
    filter: '',
    sort: {
        type: '', 
        order: '' 
    }
};

export function getCurrentFilterTitle() {
    return currentState.filter; 
}

export function setCurrentFilterTitle(latestTitle) {
    currentState.filter = latestTitle; 
}

export function getCurrentSortType() {
    return currentState.sort.type;
}

export function setSortType(selectedType) {
    currentState.sort.type = selectedType; 
}

export function getCurrentSortOrder() {
    return currentState.sort.order;
}

export function setSortOrder(selectedOrder) {
    currentState.sort.order = selectedOrder; 
}