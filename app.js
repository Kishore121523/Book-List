class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.querySelector("#book-list");
    //create tr element
    const row = document.createElement("tr");
    //inserting data inside table row
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
      `;
    // append row to li
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement("li");
    //add classes to div
    div.className = `alert ${className}`;
    //add text
    div.appendChild(document.createTextNode(message));
    //get parent
    const cardbody = document.querySelector(".card-body");
    //get form
    const form = document.querySelector("#book-form");
    //insert alert
    cardbody.insertBefore(div, form);

    //timeout after 3 sec
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

//local storage class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI();
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn, index) {
    const books = Store.getBooks();
    books.forEach(function (book) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//DOM load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

//Event listener to add book
document.getElementById("book-form").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  //instantiate book class
  const book = new Book(title, author, isbn);

  //instantiate UI class
  const ui = new UI();

  // validate
  if (title === "" || author === "" || isbn === "") {
    // error alert
    ui.showAlert("Please fill in all the fields", "error");
  } else {
    //add book to list
    ui.addBookToList(book);

    //add to local storage
    Store.addBook(book);

    //show success
    ui.showAlert("Book Added!", "success");

    //clear fields
    ui.clearFields();
  }
  e.preventDefault();
});

// event listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  // instantiate UI
  const ui = new UI();

  //delete book
  ui.deleteBook(e.target);

  //remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  //show message
  ui.showAlert("Book Removed!", "error");

  e.preventDefault();
});
