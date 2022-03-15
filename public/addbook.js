// Event Handlers -----------------------------------------------------------

window.onload = () => {
    loadCategories();
    getAuthorDropdown();
    getCategoryDropdown();
    document.getElementById("categorydropdown").addEventListener('change', checkNewCategory)
}

function checkNewCategory(){
    console.log("listened")
    const selectedCategory = document.getElementById("categorydropdown").value
    console.log(selectedCategory)
    const newCatInput = document.getElementById("newcategory")
    if (selectedCategory == "New Category") {
        newCatInput.type = "text"
    } else {
        newCatInput.type = "hidden"
    }
}

// Add book -----------------------------------------------------------------

function addNewBook() {
    //confirm("Book was added to the Database")
    console.log("addNewBook triggered")
    // get array of authors
    let authors = []
    const authorElements = document.getElementsByClassName("author")
    for (let i=0; i < authorElements.length; i++) {
        element = authorElements[i]
        authors.push(element.value)
    }

    // construct book data
    const book = {
        title: document.getElementById("booktitle").value,
        authors: authors,
        image: document.getElementById("image").value,
        rating: document.getElementById("rating").value,
        numberrating: document.getElementById("numberrating").value
    }

    // issue post request
    fetch("/api/books", {
        method: "POST",
        headers: {
            'content-type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(book)
    })
}


// Add author dropdown -----------------------------------------------------------

function addAuthorDropdown(authors) {
    const authorsSection = document.getElementById("authorselection")
	const dropdown = document.createElement('select')
    for(let i=0; i<authors.length; i++){
        const authorId = authors[i].id
        const authorName = authors[i].name
        const option = document.createElement("option")
        option.innerHTML = authorName
        option.value = authorId
        dropdown.append(option)
    }
    authorsSection.append(dropdown)
}

function getAuthorDropdown(){
    fetch('/api/authors')
        .then(data => data.json())
        .then(authors => addAuthorDropdown(authors))
}
 
// Add categories dropdown --------------------------------------------------------

function fillCategoryDropdown(categories) {
    const categoryDropdown = document.getElementById("categorydropdown")
    for(let i=0; i<categories.length; i++){
        const option = document.createElement("option")
        option.innerHTML = categories[i].category
        option.value = categories[i].category
        categoryDropdown.append(option)
    }
}

function getCategoryDropdown(){
    fetch('/api/categories')
        .then(data => data.json())
        .then(categories => fillCategoryDropdown(categories))
}