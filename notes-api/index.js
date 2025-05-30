// File: simple-note-api/index.js
const fs = require("fs");
const http = require("http");
const path = require("path");

const filePath = path.join(__dirname, "notes.json");

function readNotes() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeNotes(notes) {
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

const server = http.createServer((req, res) => {
  const urlParts = req.url.split("/").filter(Boolean);

  if (req.method === "GET" && req.url === "/notes") {
    const notes = readNotes();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
  }

  else if (req.method === "POST" && req.url === "/notes") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { title, content } = JSON.parse(body);
      const notes = readNotes();
      const newNote = { id: Date.now().toString(), title, content };
      notes.push(newNote);
      writeNotes(notes);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newNote));
    });
  }

  else if (req.method === "DELETE" && urlParts[0] === "notes") {
    const id = urlParts[1];
    const notes = readNotes();
    const updated = notes.filter(note => note.id !== id);
    writeNotes(updated);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Note deleted." }));
  }

  else if (req.method === "PUT" && urlParts[0] === "notes") {
    const id = urlParts[1];
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { title, content } = JSON.parse(body);
      const notes = readNotes();
      const index = notes.findIndex(note => note.id === id);
      if (index === -1) {
        res.writeHead(404);
        return res.end("Note not found.");
      }
      notes[index] = { id, title, content };
      writeNotes(notes);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(notes[index]));
    });
  }

  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => console.log("Notes API running on http://localhost:3000"));
