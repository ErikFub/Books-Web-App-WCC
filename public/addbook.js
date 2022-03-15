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

// Add another author -----------------------------------------------------------
function createNewElement() {
	var txtNewInputBox = document.createElement('div');
	txtNewInputBox.innerHTML = "<select> <option value='test'>Test</option>";
	document.getElementById("newElementId").appendChild(txtNewInputBox);
}

// Loading the Data ------------------------------------------------------------
function fillAuthors(books) {
    const listofauthors = document.getElementById("getauthors")
    listofauthors.innerHTML = ''
    for(let i=0; i<books.length; i++){
        const author = books[i]
        listofauthors.append(author)
    }
}

function loadAuthors(){
    console.log(fetch('/api/authors'))
    fetch('/api/authors')
        .then(data => data.json())
        .then(books => fillAuthors(books))
        }

