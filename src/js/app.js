// src/js/app.js
import '../css/style.css';
import { format, parseISO, isBefore, isToday, isTomorrow, isThisWeek } from 'date-fns';
import Todo from './todo.js';
import Project from './project.js';
import Storage from './storage.js';
import UI from './ui.js';

class TodoApp {
  constructor() {
    this.projects = [];
    this.activeProjectId = null;
    this.initializeApp();
  }

  initializeApp() {
    this.loadData();
    this.setupEventListeners();
    this.render();
  }

  loadData() {
    // Load projects from localStorage or create default project
    this.projects = Storage.getProjects().map(projectData => {
      const project = new Project(projectData.name);
      project.id = projectData.id;
      project.createdAt = new Date(projectData.createdAt);
      
      // Convert todo data to Todo objects
      project.todos = projectData.todos?.map(todoData => {
        const todo = new Todo(
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
          todoData.projectId,
          todoData.completed
        );
        todo.id = todoData.id;
        todo.createdAt = new Date(todoData.createdAt);
        return todo;
      }) || [];
      
      return project;
    });

    if (this.projects.length === 0) {
      const defaultProject = new Project('Default');
      this.projects.push(defaultProject);
      this.saveProjects();
      this.setActiveProject(defaultProject.id);
    } else {
      this.activeProjectId = Storage.getActiveProject() || this.projects[0].id;
    }
  }

  saveProjects() {
    Storage.saveProjects(this.projects);
  }

  getActiveProject() {
    return this.projects.find(p => p.id === this.activeProjectId) || this.projects[0];
  }

  setActiveProject(projectId) {
    this.activeProjectId = projectId;
    Storage.saveActiveProject(projectId);
    this.render();
  }

  addProject(name) {
    const project = new Project(name);
    this.projects.push(project);
    this.saveProjects();
    this.setActiveProject(project.id);
  }

  addTodo(todoData) {
    const activeProject = this.getActiveProject();
    if (!activeProject) return false;

    const todo = new Todo(
      todoData.title,
      todoData.description,
      todoData.dueDate,
      todoData.priority,
      activeProject.id
    );
    
    activeProject.addTodo(todo);
    this.saveProjects();
    this.render();
    return true;
  }

  toggleTodoComplete(todoId) {
    const project = this.getActiveProject();
    const todo = project.getTodo(todoId);
    if (todo) {
      todo.toggleComplete();
      this.saveProjects();
      this.render();
      return true;
    }
    return false;
  }

  deleteTodo(todoId) {
    const project = this.getActiveProject();
    project.removeTodo(todoId);
    this.saveProjects();
    this.render();
  }

  setupEventListeners() {
    // New project button
    document.getElementById('new-project-btn').addEventListener('click', () => {
      const projectName = prompt('Enter project name:');
      if (projectName) {
        this.addProject(projectName);
      }
    });

    // Project list click handler
    document.getElementById('projects-list').addEventListener('click', (e) => {
      const listItem = e.target.closest('li');
      if (listItem) {
        const projectId = listItem.dataset.projectId;
        this.setActiveProject(projectId);
      }
    });

    // Add todo button
    document.getElementById('add-todo-btn').addEventListener('click', () => {
      UI.toggleTodoForm(true);
    });

    // Cancel todo form
    document.getElementById('cancel-todo').addEventListener('click', () => {
      UI.toggleTodoForm(false);
    });

    // Submit todo form
    document.getElementById('todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const todoData = UI.getTodoFormData();
      if (todoData.title) {
        this.addTodo(todoData);
        UI.toggleTodoForm(false);
      }
    });

    // Todo actions (complete, delete)
    document.getElementById('todos-container').addEventListener('click', (e) => {
      const target = e.target;
      const todoElement = target.closest('.todo');
      
      if (!todoElement) return;
      
      const todoId = todoElement.dataset.todoId;
      
      // Complete checkbox
      if (target.matches('.todo-complete, .todo-complete + label')) {
        this.toggleTodoComplete(todoId);
      }
      
      // Delete button
      if (target.closest('.btn-delete')) {
        if (confirm('Are you sure you want to delete this todo?')) {
          this.deleteTodo(todoId);
        }
      }
      
      // Edit button
      if (target.closest('.btn-edit')) {
        // TODO: Implement edit functionality
        console.log('Edit todo:', todoId);
      }
    });
  }

  render() {
    const activeProject = this.getActiveProject();
    if (!activeProject) return;

    // Update project list
    UI.renderProjects(this.projects, this.activeProjectId);
    
    // Update active project title
    UI.renderActiveProject(activeProject);
    
    // Render todos for active project
    UI.renderTodos(activeProject.todos);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TodoApp();
});