import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// CREATE
app.post("/books", async (req, res) => {
  const { title, author, publishedAt } = req.body;
  try {
    const book = await prisma.book.create({
      data: { title, author, publishedAt: publishedAt ? new Date(publishedAt) : null },
    });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
});

// READ - semua buku
app.get("/books", async (req, res) => {
  const books = await prisma.book.findMany();
  res.json(books);
});

// READ - berdasarkan id
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
  });
  res.json(book);
});

// UPDATE
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, publishedAt } = req.body;
  try {
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: { title, author, publishedAt: publishedAt ? new Date(publishedAt) : null },
    });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to update book" });
  }
});

// DELETE
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
