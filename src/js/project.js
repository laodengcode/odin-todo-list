// src/js/project.js
export default class Project {
    constructor(name) {
      this.id = Date.now().toString();
      this.name = name;
      this.todos = [];
      this.createdAt = new Date();
    }
  
    addTodo(todo) {
      this.todos.push(todo);
    }
  
    removeTodo(todoId) {
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
  
    getTodo(todoId) {
      return this.todos.find(todo => todo.id === todoId);
    }
  
    updateTodo(todoId, updates) {
      const todo = this.getTodo(todoId);
      if (todo) {
        todo.update(updates);
        return true;
      }
      return false;
    }
  
    getTodosByPriority(priority) {
      return this.todos.filter(todo => todo.priority === priority);
    }
  
    getCompletedTodos() {
      return this.todos.filter(todo => todo.completed);
    }
  
    getPendingTodos() {
      return this.todos.filter(todo => !todo.completed);
    }
  }