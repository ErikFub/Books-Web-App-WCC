// Event Handlers -----------------------------------------------------------

window.onload = () => {
    loadCategories();
    getAuthorDropdown();
    getCategoryDropdown();
    document.getElementById("categorydropdown").addEventListener('change', checkNewCategory)
}

function checkNewCategory(){
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
    //confirm("Book was added to the Database")
    console.log("addNewBook triggered")

    // get array of authors
    let authors = []
    const authorElements = document.getElementsByClassName("authordropdown")
    for (let i=0; i < authorElements.length; i++) {
        dropdown = authorElements[i]
        if (dropdown.value !== "new") {
            authors.push(dropdown.value)
        } else {
            const newAuthorInputId = dropdown.id.replace('author', 'newauthor')
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
        authors: [...new Set(authors)],
        image: document.getElementById("image").value,
        rating: document.getElementById("rating").value,
        numberrating: document.getElementById("numberrating").value,
        category: categoryIn
    }

    const missingInput = Object.values(book).includes('') || authors.length === 0
    if (missingInput) {
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


// Add author dropdown -----------------------------------------------------------

function removeAuthor(buttonId) {
    const dropdownSectionId = buttonId.replace("remove", "author-section")
    const dropdownSection = document.getElementById(dropdownSectionId)
    dropdownSection.remove()
}


function addAuthorDropdown(authors, removeButton) {
    const authorsSection = document.getElementById("authorselection")
    const dropdownSection = document.createElement('div')
    let id = ""
    if (authorsSection.childElementCount > 0) {
        const lastAuthorId = authorsSection.lastChild.firstChild.id
        id = parseInt(lastAuthorId.replace("author-", "")) + 1
    } else {
        id = 1
    }
    dropdownSection.id = "author-section-" + id
	const dropdown = document.createElement('select')
    dropdown.classList = "authordropdown input-dropdown"
    dropdown.id = "author-" + id
    const newAuthorOption = document.createElement("option")
    newAuthorOption.innerHTML = "New Author"
    newAuthorOption.value = "new"
    dropdown.append(newAuthorOption)
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