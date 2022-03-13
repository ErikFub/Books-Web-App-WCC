import {db} from './init'
import {books, Book} from '../books'
/*
function getAuthors(bookID: number, authors:([]) => void) {
  const sql = `
              SELECT a.name
              FROM author a
              JOIN author_book ab
              ON a.id = ab.author_id
              AND ab.book_id == ?
  `
  return db.all(sql, [bookID], (err: any, rows: any) => {
    if( err ) {
      console.log("Error in database: "+err)
      authors([])
    } else {
      authors(rows)
    }
  })
}
*/

export function getAllBooks(search:string, fn:(books:Book[]) => void) {
  const sql = `
              SELECT *
              FROM book b
              WHERE b.title LIKE '%' || ? || '%'
              `
  const params: string [] = [search]
  db.all(sql, params, (err: any, rows: any) =>{
    if( err ) {
      console.log("Error in database: "+err)
      fn([])
    } else {
      rows.forEach((row: any) => {
        const authors: any = []
        authors.push("Sample Author")
        row.authors = authors
        /*
        // const authors: string [] = []
        const authorsSql = `
                            SELECT a.name
                            FROM author a
                            JOIN author_book ab
                                 ON a.id = ab.author_id
                                 AND ab.book_id == ?
                            `
        db.each(authorsSql, [row.id], (errA, rowsA) => {
          if( errA ) {
            console.log("Error in database: "+errA)
          } else {
            // rowsA.forEach((rowA) => {
              // console.log(rowA.name)
            //  row.authors.push(rowA.name)
            // })
            authors.push(rowsA.name)
          }
        });
        row.authors = authors
        */
      });
      // Now get the authors for each book and add it to the result
      // console.log(typeof(rows[0]))
      console.log("rows------")
      console.log(rows)
      console.log("----------")

      fn(rows)
    }
  })
}

export function getOneBook(id:number, fn:(book:Book|null) => void) {
  const sql = "SELECT * FROM Book WHERE id = ?"
  const params:string[] = [""+id]
  return db.get(sql, params, (err:any, row:any) =>{
    if( err ) {
      console.log("error in database: "+err)
      fn(null)
    } else {
      console.log(row)
      // get the authors of the book and add it to the book
      fn(row)
    }
  })}


// works as intended
function getBookIds(callback: any) {
    const data: any = []; // for storing the rows.
    db.each("SELECT id FROM book", (err, row) => {
      data.push(row); // pushing rows into array
    }, () => { // calling function when all rows have been pulled
      callback(data);
    });
}

function getHighestBookId() {
  const bookIds = getBookIds((data: []) => {
    console.log("Book ID data ---")
    console.log(data)
    console.log("----------------")

    return data
  })
  console.log("Book IDs:")
  console.log(bookIds)
  console.log("--")
  // return Math.max(bookIds)
}


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