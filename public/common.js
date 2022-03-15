window.onclick = function(e) {
    if (!e.target.matches('.sn')) {
        const navItems = ['menu']
        for (idx in navItems){
            const button = document.getElementById(navItems[idx] + "-bt")
            button.classList.remove("clicked")
            const dropdown = document.getElementById(navItems[idx] + "-sn")
            dropdown.classList.add("hidden")
        }
    }
}

// (Sub-)Navigation Bar --------------------------------------------------

function toggleSubnav(navID){
    const button = document.getElementById(navID + "-bt")
    button.classList.toggle("clicked")
    const dropdown = document.getElementById(navID + "-sn")
    dropdown.classList.toggle("hidden")
}


// Sidebar Categories ---------------------------------------------------

function fillCategories(categories) {
    const categoriesElement = document.getElementById("categories")
    for (let category in categories) {
        count = categories[category]
        const catP = document.createElement("p")
        const catLink = document.createElement("a")
        catLink.href = "/index.html?category=" + category
        catLink.innerHTML = category + " (" + count + ")"
        catP.append(catLink)
        categoriesElement.append(catP)
    }
}

function countCategories(books) {
    const allCategories = {}
    for (idx in books) {
        const book = books[idx]
        const bookCategory = book.category
        if (! (bookCategory in allCategories)){
            allCategories[bookCategory] = 0
        }
        allCategories[bookCategory] += 1
    }
    return allCategories
}

function loadCategories(){
    fetch('/api/books')
        .then(data => data.json())
        .then(books => countCategories(books))
        .then(categories => fillCategories(categories))
}
