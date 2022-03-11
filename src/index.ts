import express from 'express'
import {books} from './books'

const app = express()
const port = 8080

app.use(express.static('public'))

app.get('/api/books', (req,res) => {
    const search:string = ( req.query.search || "" ) as string
    res.send(JSON.stringify(books.filter( b => b.title.includes(search))))
})

app.post('/api/books', (req,res) => {
    console.log('New Books Being added')
    let body = ""
    req
    .on('data', (data) => body += data)
    .on('end', () => { console.log(body) })
})

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
