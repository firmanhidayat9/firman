const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const filePath = path.join(__dirname, "book.json");

// Fungsi bantu baca & tulis file JSON
function readBooks() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeBooks(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ============================
// ========   CRUD   ==========
// ============================

// GET semua buku
app.get("/books", (req, res) => {
  const books = readBooks();
  res.json(books);
});

// GET buku berdasarkan ID
app.get("/books/:id", (req, res) => {
  const books = readBooks();
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// POST tambah buku baru
app.post("/books", (req, res) => {
  const books = readBooks();
  const { title, author, publisher } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    publisher: publisher || null // boleh dikosongkan atau diisi nama PT
  };

  books.push(newBook);
  writeBooks(books);
  res.status(201).json(newBook);
});

// PUT update buku
app.put("/books/:id", (req, res) => {
  const books = readBooks();
  const { title, author, publisher } = req.body;
  const index = books.findIndex(b => b.id === parseInt(req.params.id));

  if (index === -1)
    return res.status(404).json({ message: "Book not found" });

  if (title) books[index].title = title;
  if (author) books[index].author = author;
  if (publisher !== undefined) books[index].publisher = publisher;

  writeBooks(books);
  res.json(books[index]);
});

// DELETE hapus buku
app.delete("/books/:id", (req, res) => {
  const books = readBooks();
  const newBooks = books.filter(b => b.id !== parseInt(req.params.id));

  if (books.length === newBooks.length)
    return res.status(404).json({ message: "Book not found" });

  writeBooks(newBooks);
  res.json({ message: "Book deleted successfully" });
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
