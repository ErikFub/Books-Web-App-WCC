import {db} from './init'
import {books, Book} from '../books'


export function addAuthors(allBooks: Book[], authorRelations: any, fn:(booksAuthor: Book[]) => void) {
  const bookAuthors: {[id: number]: string[]} = {}
  for (const relation of authorRelations) {
    const author: string = relation.name
    const bookId: number = relation.book_id
    if (!(bookId in bookAuthors)) {
      bookAuthors[bookId] = []
    }
    bookAuthors[bookId].push(author)
  }
  allBooks.forEach((book) => {
    book.authors = bookAuthors[book.id]
  })
  fn(allBooks)
}


export function getAllAuthorRelations(fn:(authorRelations: any) => void) {
  const sql = `
              SELECT ab.book_id, a.name
              FROM author_book ab
              LEFT JOIN author a ON a.id = ab.author_id
              `
  db.all(sql, [], (err: any, rows: any) =>{
    if( err ) {
      console.log("Error in database: " + err)
      fn([])
    } else {
      fn(rows)
    }
  })
}

export function getAllBooks(name: string, category: string, fn:(books:Book[]) => void) {
  const sql = `
              SELECT *
              FROM book b
              WHERE b.title LIKE '%' || ? || '%'
                AND b.category LIKE '%' || ? || '%'
              `
  const params: string [] = [name, category]
  db.all(sql, params, (err: any, rows: any) =>{
    if( err ) {
      console.log("Error in database: " + err)
      fn([])
    } else {
      fn(rows)
    }
  })
}

export function getOneBook(id:number, fn:(book:Book|null) => void) {
  const sql = "SELECT * FROM Book WHERE id = ?"
  const params:string[] = [""+id]
  return db.get(sql, params, (err:any, row:any) =>{
    if( err ) {
      console.log("error in database: " + err)
      fn(null)
    } else {
      console.log(row)
      fn(row)
    }
  })}


export function addOneBook(b: Book) {
  console.log("In addOneBook:------")
  console.log(b)
  console.log("--------------------")
  console.log(JSON.stringify(db.get("SELECT * FROM book")))
  const sql = `
              INSERT INTO book (title, image, rating, numberrating) VALUES (?,?,?,?)
              `
  const params = [b.title, b.image, b.rating, b.numberrating]
  db.run(sql, params, (err: any, result: any) => {
    if( err ) {
      console.log("Error in database: " + err)
    }
  });
  // insert one new book into the database
  // Don't forget to add the relation to authors
  // The relation to authors is established using the author identifiers
}

export function getAllAuthors(fn:(authors: string[]) => void) {
  const sql = `
              SELECT DISTINCT id, name
              FROM author
              ORDER BY name
              `
  db.all(sql, [], (err: any, rows: any) =>{
    if( err ) {
      console.log("Error in database: " + err)
      fn([])
    } else {
      fn(rows)
    }
  })
}

export function getAllCategories(fn:(categories: string[]) => void) {
  const sql = `
              SELECT DISTINCT (category)
              FROM book
              ORDER BY category
              `
  db.all(sql, [], (err: any, rows: any) =>{
    if( err ) {
      console.log("Error in database: " + err)
      fn([])
    } else {
      fn(rows)
    }
  })
}