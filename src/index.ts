import express from 'express'
import './data'
import { addOneBook, getAllBooks, getOneBook, addAuthors, getAllAuthorRelations,
    getAllAuthors, getAllCategories, createAuthors, createBookAuthorRelation } from './data'

const app = express()
const port = 8080

app.use(express.static('public'))

// Getting all books, with search
app.get('/api/books', (req: any, res: any) => {
    const name: string = ( req.query.name || "" ) as string
    const category: string = (req.query.category || "") as string
    // get all books (without authors), filtered for passed name and category
    getAllBooks(name, category, (books) => {
        // ... then get all authors
        getAllAuthorRelations((authorRelations) => {
            // ... then add the authors the books
            addAuthors(books, authorRelations, (booksAuthors) => {
                // if the resulting Object contains values, send those as response
                if ( booksAuthors.length > 0 ) {
                    res.send(JSON.stringify(booksAuthors))
                } else { // else send an empty aray and an error status code
                    res.status(404)
                    res.send([])
                }
            })
        })
    })
})

// Getting one book
app.get('/api/books/:id', (req: any, res: any) => {
    const bookId = parseInt(req.params.id, 10)
    getOneBook(bookId, (book) => {
        if (book != null) res.send(JSON.stringify(book))
        else {
            res.status(404)
            res.send()
        }
    })
})

// Adding one book
app.post('/api/books', (req: any, res: any) => {
    console.log('New Books Being added')
    let body = ""
    req
    .on('data', (data: any) => body += data)
    .on('end', () => {
        // add the book data (no author data added yet)
        addOneBook(JSON.parse(body), (bookId) => {
            // get all existing authors to understand which of the book's authors are not yet in the DB
            getAllAuthors((allAuthors: []) => {
                // create the new authors (in author table)
                createAuthors(JSON.parse(body), allAuthors, (authorIds: number[]) => {
                    // create the relation between books and authors
                    new Promise( () => {
                        createBookAuthorRelation(bookId, authorIds)
                    })
                    // after creating the relation, if the creation was succesfull...
                    .then((value) => {
                        // ... get the data for the newly added book (based on book ID assigned in first step)
                        getOneBook(bookId, (book) => {
                            // if there is data, send the data as response alongside response code 201
                            if (book != null) {
                                res.status(201)
                                res.send(JSON.stringify(book))
                            }
                            else { // else, send an error response code and an empty response
                                res.status(404)
                                res.send()
                            }
                        })
                    })
                    // if the creation was not successful, send an error response code and an empty response
                    .then((error) => {
                        res.status(404)
                        res.send()
                    })
                })
            })
        })
    })
})

// Getting all categories
app.get('/api/categories', (req: any, res: any) => {
    getAllCategories((data: any) => {
        res.send(JSON.stringify(data))
    })
})


// Getting all authors
app.get('/api/authors', (req: any, res: any) => {
    getAllAuthors((data: any) => {
        res.send(JSON.stringify(data))
    })
})


app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
