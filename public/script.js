// Window Functions -----------------------------------------------

window.onload = () => {
    loadBooks();
    loadCategories();
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            search()
        }
    });
}


// Bookcard & Wishlist creation ---------------------------------------------

function createBookcard(book, idx) {
    const title = book["title"]
    const author = book["authors"].join(', ')
    const imageUrl = book["image"]
    const rating = book["rating"]
    const nRatings = book["numberrating"]
    const bookdID = "book" + (idx + 1)

    const bookcard = document.createElement("li")
    bookcard.className = "bookcard"
    bookcard.id = bookdID + "-bookcard"

    // create image
    const imageDiv = document.createElement("div")
    imageDiv.className = "imagecontainer"
    const image = document.createElement("img")
    image.className = "bookcover"
    image.src = imageUrl
    imageDiv.append(image)
    bookcard.append(imageDiv)

    // create title and author
    const titleAuthorDiv = document.createElement("div")
    titleAuthorDiv.className = "title-author"
    const title_p = document.createElement("p")
    title_p.className = "booktitle"
    title_p.append(title)
    titleAuthorDiv.append(title_p)
    const authorP = document.createElement("p")
    authorP.className = "author"
    authorP.append(author)
    titleAuthorDiv.append(authorP)
    bookcard.append(titleAuthorDiv)

    // create rating
    const ratingP = document.createElement("p")
    ratingP.className = "rating"
    const filledStarSpan = document.createElement("span")
    filledStarSpan.className = "filled-star"
    const filledStarsStr = "★".repeat(rating)
    filledStarSpan.append(filledStarsStr)
    const emptyStarSpan = document.createElement("span")
    emptyStarSpan.className = "empty-star"
    const emptyStarsStr = "★".repeat(5 - rating)
    emptyStarSpan.append(emptyStarsStr)
    ratingP.append(filledStarSpan)
    ratingP.append(emptyStarSpan)
    ratingP.append("(" + nRatings + ")")
    bookcard.append(ratingP)

    // create button(s)
    const addButton = document.createElement("button")
    addButton.innerHTML = "Add to Wishlist"
    addButton.className = "wishlist-add"
    addButton.onclick = function() {toggleWishlist(bookdID)}
    const removeButton = document.createElement("button")
    removeButton.innerHTML = "Remove from Wishlist"
    removeButton.className = "wishlist-remove hidden"
    removeButton.onclick = function() {toggleWishlist(bookdID)}
    bookcard.append(addButton)
    bookcard.append(removeButton)

    return bookcard
}

function createWishlistItem(book, i) {
    const title = book["title"]
    const bookdID = "book" + (i + 1)
    const wishlistItem = document.createElement("li")
    wishlistItem.innerHTML = title
    wishlistItem.id = bookdID + "-wishlist"
    wishlistItem.className = "hidden"
    return wishlistItem
}

function fillBooks(books) {
    const booklist = document.getElementById("listofbooks")
    booklist.innerHTML = ''
    const wishlist = document.getElementById("wishlist")
    wishlist.innerHTML = ''
    for(let i=0; i<books.length; i++){
        const book = books[i]
        const bookcard = createBookcard(book, i)
        booklist.append(bookcard)

        const wishlistItem = createWishlistItem(book, i)
        wishlist.append(wishlistItem)
    }
}

function loadBooks(name) {
    let query = ""
    if( name != undefined ) {
        query = `?name=${name}`
    }
    const category = getParameterByName("category")
    if( category != undefined ) {
        query = `?category=${category}`
    }
    console.log(fetch('/api/books'+query))
    fetch('/api/books'+query)
        .then(data => data.json())
        .then(books => fillBooks(books))
}


// Wishlist Handling ------------------------------------------------------

function toggleWishlistButton(bookID) {
    const bookcard = document.getElementById(bookID + "-bookcard");
    const addButton = bookcard.getElementsByClassName("wishlist-add")[0]
    const removeButton = bookcard.getElementsByClassName("wishlist-remove")[0]
    addButton.classList.toggle("hidden")
    removeButton.classList.toggle("hidden")
  }

function toggleWishlistItem(bookID){
    const book = document.getElementById(bookID + "-wishlist")
    book.classList.toggle("hidden")
}

function toggleWishlist(bookID){
    toggleWishlistItem(bookID)
    toggleWishlistButton(bookID)
}


// Book Search -----------------------------------------------------------

function search(){
    const searchInput = document.getElementById('search-input').value
    loadBooks(searchInput)
}


// URL Query Handling -----------------------------------------------------------

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

