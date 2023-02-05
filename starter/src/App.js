import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { useState, useEffect } from "react";
import Main from "./components/Main";
import BookShelf from "./components/BookShelf";
import * as BooksApi from './BooksAPI'
import Book from "./components/Book";
import { useDebounce } from 'use-debounce'


function App() {

  const [mapOfIdToBooks, setMapOfIdToBooks] = useState(new Map());
  const [books, setBooks] = useState([]);
  const [searchBooks, setSearchBooks] = useState([]);
  const [mergedBooks, setMergedBooks] = useState([])


  const [query, setQuery] = useState('');
  const [value] = useDebounce(query, 500);

  useEffect(() => {
    BooksApi.getAll()
      .then(data => {
        setBooks(data)
        setMapOfIdToBooks(createMapOfBooks(data))
      });
  }, [])

  useEffect(() => {

    let isActive = true;
    if (value) {
      BooksApi.search(value).then(data => {
        if (data.error) {
          setSearchBooks([])
        } else {
          if (isActive) {
            setSearchBooks(data);
          }
        }
      })
    }
    return () => {
      isActive = false;
      setSearchBooks([])
    }

  }, [value])


  useEffect(() => {

    const combined = searchBooks.map(book => {
      if (mapOfIdToBooks.has(book.id)) {
        return mapOfIdToBooks.get(book.id);
      } else {
        return book;
      }
    })
    setMergedBooks(combined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBooks]);

  const createMapOfBooks = (books) => {
    const map = new Map()
    books.map(book => map.set(book.id, book));
    return map;
  }

  const updateBookShelf = (book, whereTo) => {
    const updatedBooks = books.map(b => {
      if (b.id === book.id) {
        book.shelf = whereTo;
        return book;
      }
      return b;
    })
    if (!mapOfIdToBooks.has(book.id)) {
      book.shelf = whereTo;
      updatedBooks.push(book)
    }
    setBooks(updatedBooks);
    BooksApi.update(book, whereTo)
  }

  return (
    <div className="app">
      <Router>

        <Switch>

          <Route path="/search">
            <div className="search-books">
              <div className="search-books-bar">
                <Link to='/'>
                  <div
                    className="close-search"

                  >
                    Close
                  </div>
                </Link>

                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by title, author, or ISBN"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {mergedBooks.map(b => (
                    <li key={b.id}>
                      <Book book={b} changeBookShelf={updateBookShelf} />
                    </li>
                  ))}

                </ol>
              </div>
            </div>
          </Route>

          <Route path='/'>
            <div className="list-books">
              <Main />
              <div className="list-books-content">
                <BookShelf books={books} updateBookShelf={updateBookShelf} />
              </div>
              <div className="open-search">

                <Link to='/search'>
                  <div>Add a book</div>
                </Link>
              </div>
            </div>

          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
