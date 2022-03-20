// make sure that when menu dropdown is opened, it gets closed if user clicks somewhere else
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
    // Order categories alphabetically
    const categoriesOrdered = Object.keys(categories).sort().reduce(
        (obj, key) => { 
          obj[key] = categories[key]; 
          return obj;
        }, 
        {}
      );
    const categoriesElement = document.getElementById("categories")
    // create link for each category, also displaying the count
    for (let category in categoriesOrdered) {
        count = categoriesOrdered[category]
        const catP = document.createElement("p")
        const catLink = document.createElement("a")
        catLink.href = "/index.html?category=" + category
        catLink.innerHTML = category + " (" + count + ")"
        catP.append(catLink)
        categoriesElement.append(catP)
    }
}


function getCount(arr, key) {
    const counts = {}
    for (idx in arr) {
        const dict = arr[idx]
        const element = dict[key]
        if (! (element in counts)){
            counts[element] = 0
        }
        counts[element] += 1
    }
    return counts
}


function getCountNested(arr, key) {
    const counts = {}
    for (idx in arr) {
        const dict = arr[idx]
        const elementArr = dict[key]
        for (idx in elementArr) {
            const element = elementArr[idx]
            if (! (element in counts)){
                counts[element] = 0
            }
            counts[element] += 1
        }
    }
    return counts
}


function loadCategories(){
    fetch('/api/books')
        .then(data => data.json())
        .then(books => getCount(books, 'category'))
        .then(categories => fillCategories(categories))
}
