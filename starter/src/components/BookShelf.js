import React from "react";
import Shelf from "./Shelf";



const BookShelf = ({ books, updateBookShelf }) => {

    const currentlyReading = books.filter((books) => books.shelf === 'currentlyReading');
    const wantToRead = books.filter((books) => books.shelf === 'wantToRead');
    const read = books.filter((books) => books.shelf === 'read');



    return (
        <div>
            <Shelf title='Currently Reading' books={currentlyReading} updateBookShelf={updateBookShelf} />
            <Shelf title='wantToRead' books={wantToRead} updateBookShelf={updateBookShelf} />
            <Shelf title='read' books={read} updateBookShelf={updateBookShelf} />
        </div>

    )

}

export default BookShelf;