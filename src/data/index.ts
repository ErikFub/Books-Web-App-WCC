import {db} from './init'
import {books, Book} from '../books'


export function addAuthors(allBooks: Book[], authorRelations: {book_id: number, name: string} [], fn:(booksAuthor: Book[]) => void) {
  // matches all books with all existing author relations to fill the authors attribute of each book
  const bookAuthors: {[id: number]: string[]} = {}
  for (const relation of authorRelations) {
    const author: string = relation.name
    const bookId: number = relation.book_id
    if ( !(bookId in bookAuthors) ) {
      bookAuthors[bookId] = []
    }
    bookAuthors[bookId].push(author)
  }
  allBooks.forEach((book) => {
    book.authors = bookAuthors[book.id]
  })
  fn(allBooks)
}


export function getAllAuthorRelations(fn:(authorRelations: {book_id: number, name: string} [] | []) => void) {
  // gets all the connections of author names to book ids
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
  // gets all books filtered by passed name and catrgory
  const sql = `
              SELECT *
              FROM book b
              WHERE b.title LIKE '%' || ? || '%'
                AND b.category LIKE '%' || ? || '%'
              ORDER BY b.title
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


function compressBookData(rows: any[]) {
  /*if entry for book exists more than one time (due there being more than one authors for it),
    compress that data into one book entry which contains all the authors in an array*/
  const bookData: Book = {
    id: rows[0].id,
    title: rows[0].title,
    image: rows[0].image,
    rating: rows[0].rating,
    numberrating: rows[0].numberrating,
    authors: [],
    category: rows[0].category
  }
  rows.forEach((r: any) => {
    const author = r.name
    bookData.authors.push(author)
  })
  return bookData
}

export function getOneBook(id:number, fn:(book: Book | null) => void) {
  const sql = `SELECT *
               FROM book b
               JOIN author_book ab ON ab.book_id = b.id
               JOIN author a ON a.id = ab.author_id
               WHERE b.id = ?`
  const params:string[] = [""+id]
  return db.all(sql, params, (err:any, rows:any) =>{
    if( err ) {
      console.log("error in database: " + err)
      fn(null)
    } else {
      const book = compressBookData(rows)
      fn(book)
    }
  })
}


export function addOneBook(book: Book, fn: (bookId: number) => void) {
  const sql = `
              INSERT INTO book (title, image, rating, numberrating, category) VALUES (?,?,?,?,?)
              `
  const params = [book.title, book.image, book.rating, book.numberrating, book.category]
  db.run(sql, params, function(err: any, result: any){
    if( err ) {
      console.log("Error in database: " + err)
    } else {
      fn(this.lastID)
    }
  });
}

export function createAuthors(book: Book, allAuthors: {id: number, name: string}[], fn: (authorIds: number[]) => void) {
  const authors: string[] = book.authors
  const authorIds: number[] = []

  // identify existing vs. newly added authors
  const newAuthors = []
  for (const author of authors) {
    let match = false
    for (const existingAuthor of allAuthors) {
      if (existingAuthor.name === author){
        authorIds.push(existingAuthor.id)
        match = true
        break
      }
    }
    if (match === false) { // if author doesn't exist
      newAuthors.push(author) // push name on array of authors to add
    }
  }
  const placeholders = newAuthors.map((author) => '(?)').join(',');
  const sql = `INSERT OR REPLACE INTO author (name) VALUES ${placeholders}`
  db.run(sql, newAuthors, function(err: any, result: any) {
    if( err ) {
      if (newAuthors.length > 0){
        console.log("Error in database: " + err)
      } else {
        // if there are no authors that need to be added, the (partially empty) SQL statement throws an error
        // but if we are sure there are no new authors, this is no problem
        console.log("No new authors were added")
        fn(authorIds)
      }
    } else {
      // infer the author IDs of added authors by using auto increment logic and add them to the IDs of exisiting authors
      const lastId = this.lastID
      for(let i = 0; i < newAuthors.length; i++) {
        authorIds.push(lastId - i)
      }
      fn(authorIds)
    }
  });
}

export function createBookAuthorRelation(bookId: number, authorIds: number[]) {
  // for each book / author combination, add a row to author_book table
  for( const authorId of authorIds ) {
    const sql = `
                INSERT INTO author_book (author_id, book_id)
                VALUES (?,?)
                `
    const params = [authorId, bookId]
    db.run(sql, params)
  }
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