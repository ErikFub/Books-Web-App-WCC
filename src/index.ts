import express from 'express'
import './data'
import { addOneBook, getAllBooks, getOneBook, addAuthors, getAllAuthorRelations } from './data'

const app = express()
const port = 8080

app.use(express.static('public'))

// Getting all books, with search
app.get('/api/books', (req: any, res: any) => {
    const search:string = ( req.query.search || "" ) as string
    getAllBooks(search, (books: any) => {
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
    .on('end', () => { addOneBook(JSON.parse(body)) })
})

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
