// Event Handlers -----------------------------------------------------------

window.onload = () => {
    loadCategories();
    getAuthorDropdown();
    getCategoryDropdown();
    document.getElementById("categorydropdown").addEventListener('change', checkNewCategory)
}

function checkNewCategory(){
    // if the category dropdown changes, check if the value equals "new"; if no, hide the "new category" input field 
    const selectedCategory = document.getElementById("categorydropdown").value
    const newCatInput = document.getElementById("newcategory")
    if (selectedCategory == "new") {
        newCatInput.type = "text"
        newCatInput.required = true
    } else {
        newCatInput.type = "hidden"
        newCatInput.required = false
    }
}

// Add book -----------------------------------------------------------------

function addNewBook() {
    // get array of authors
    let authors = []
    const authorElements = document.getElementsByClassName("authordropdown")
    for (let i=0; i < authorElements.length; i++) {
        dropdown = authorElements[i]
        if (dropdown.value !== "new") {
            authors.push(dropdown.value)
        } else {
            // get the id of the associated input text field
            const newAuthorInputId = dropdown.id.replace('author', 'newauthor')
            // get value of input text field
            const newAuthorInput = document.getElementById(newAuthorInputId).value
            if (newAuthorInput !== '') {
                authors.push(newAuthorInput)
            }
        }
    }
    // get correct category value
    let categoryIn = ''
    const categoryDropdown = document.getElementById("categorydropdown")
    if (categoryDropdown.value === 'new') {
        const categoryNew = document.getElementById("newcategory")
        categoryIn = categoryNew.value
    } else {
        categoryIn = categoryDropdown.value
    }


    // construct book data
    const book = {
        title: document.getElementById("booktitle").value,
        authors: [...new Set(authors)], // only use unique authors
        image: document.getElementById("image").value,
        rating: document.getElementById("rating").value,
        numberrating: document.getElementById("numberrating").value,
        category: categoryIn
    }

    // check if some value or authors were left empty
    const missingInput = Object.values(book).includes('') || authors.length === 0
    if (missingInput) {
        alert("At least one input field was not filled. Book was not added to the Database.")
        console.log("Adding books aborted due to misssing input")
    } else {
        // issue post request
        fetch("/api/books", {
            method: "POST",
            headers: {
                'content-type':'application/json;charset=utf-8'
            },
            body: JSON.stringify(book)
        })
    }
}


// Authors Section -----------------------------------------------------------

// Option to remove author input
function removeAuthor(buttonId) {
    // get id of section that is associated to clicked button
    const dropdownSectionId = buttonId.replace("remove", "author-section")

    // remove that section
    const dropdownSection = document.getElementById(dropdownSectionId)
    dropdownSection.remove()
}


function addAuthorDropdown(authors, removeButton) {
    const authorsSection = document.getElementById("authorselection")
    const dropdownSection = document.createElement('div')
    let id = ""
    if (authorsSection.childElementCount > 0) {
        // define id for author input by incrementing highest existing author input id by one
        const lastAuthorId = authorsSection.lastChild.firstChild.id
        id = parseInt(lastAuthorId.replace("author-", "")) + 1
    } else {
        id = 1
    }
    dropdownSection.id = "author-section-" + id
	const dropdown = document.createElement('select')
    dropdown.classList = "authordropdown input-dropdown"
    dropdown.id = "author-" + id
    // Add option for new author to dropdown
    const newAuthorOption = document.createElement("option")
    newAuthorOption.innerHTML = "New Author"
    newAuthorOption.value = "new"
    dropdown.append(newAuthorOption)
    // Add all authors retrieved from /api/authors to dropdown
    for(let i=0; i<authors.length; i++){
        const authorName = authors[i].name
        const option = document.createElement("option")
        option.innerHTML = authorName
        option.value = authorName
        dropdown.append(option)
    }
    const newAuthorInput = document.createElement("input")
    newAuthorInput.type = "text"
    newAuthorInput.id = "newauthor-" + id
    newAuthorInput.placeholder = "e.g. J. K. Rowling"
    dropdown.addEventListener("change", () => {checkNewAuthor(id)})

    dropdownSection.append(dropdown)

    if (removeButton === true) {
        const rButton = document.createElement('button')
        rButton.className = "remove-author"
        rButton.id = "remove-" + id
        rButton.innerHTML = "✖"
        rButton.onclick = () => removeAuthor(rButton.id)
        dropdownSection.append(rButton)
    }

    dropdownSection.append(newAuthorInput)
    authorsSection.append(dropdownSection)
}

function getAuthorDropdown(removeButton){
    fetch('/api/authors')
        .then(data => data.json())
        .then(authors => addAuthorDropdown(authors, removeButton))
}

// listener for new author input
function checkNewAuthor(dropdownId) {
    // if the author dropdown changes, check if the value equals "new"; if no, hide the "new author" input field
    const selectedAuthor = document.getElementById("author-" + dropdownId).value
    const newAuthorInput = document.getElementById("newauthor-" + dropdownId)
    if (selectedAuthor == "new") {
        newAuthorInput.type = "text"
    } else {
        newAuthorInput.type = "hidden"
    }
}
 
// Add categories dropdown --------------------------------------------------------

function fillCategoryDropdown(categories) {
    const categoryDropdown = document.getElementById("categorydropdown")
    // create an option for each category
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