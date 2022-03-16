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
    getAllBooks(name, category, (books: any) => {
        getAllAuthorRelations((authorRelations) => {
            addAuthors(books, authorRelations, (booksAuthors: any) => {
                res.send(JSON.stringify(booksAuthors))
            })
        })
    })
})

// Getting one book
app.get('/api/books/:id', (req: any, res: any) => {
    const bookId = parseInt(req.params.id,10)
    getOneBook(bookId, (book: any) => {
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
        addOneBook(JSON.parse(body), (bookId) => {
            getAllAuthors((allAuthors: []) => {
                createAuthors(JSON.parse(body), allAuthors, (authorIds: number[]) => {
                    createBookAuthorRelation(bookId, authorIds)
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
