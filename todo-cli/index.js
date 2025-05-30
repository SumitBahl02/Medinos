#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "todos.json");
const [,, command, ...args] = process.argv;

// Initialize file if not exists
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");

function readTodos() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

function addTodo(task) {
  const todos = readTodos();
  const newTodo = { id: Date.now().toString(), task };
  todos.push(newTodo);
  writeTodos(todos);
  console.log("Todo added.");
}

function listTodos() {
  const todos = readTodos();
  if (todos.length === 0) return console.log("No todos found.");
  todos.forEach((todo, i) => {
    console.log(`${i + 1}. [${todo.id}] ${todo.task}`);
  });
}

function deleteTodo(id) {
  const todos = readTodos();
  const updated = todos.filter(todo => todo.id !== id);
  if (todos.length === updated.length) {
    console.log("Todo not found.");
  } else {
    writeTodos(updated);
    console.log("Todo deleted.");
  }
}

function updateTodo(id, newTask) {
  const todos = readTodos();
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos[index].task = newTask;
    writeTodos(todos);
    console.log("Todo updated.");
  } else {
    console.log("Todo not found.");
  }
}

switch (command) {
  case "add":
    addTodo(args.join(" "));
    break;
  case "list":
    listTodos();
    break;
  case "delete":
    deleteTodo(args[0]);
    break;
  case "update":
    updateTodo(args[0], args.slice(1).join(" "));
    break;
   default:
    console.log("Available Commands:");
    console.log("node index.js add \"Title\" \"Content\"");
    console.log("node index.js list");
    console.log("node index.js delete <id>");
}