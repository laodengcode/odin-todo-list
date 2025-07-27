// src/js/ui.js
import { format } from 'date-fns';

export default class UI {
  static renderProjects(projects, activeProjectId) {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';

    projects.forEach(project => {
      const li = document.createElement('li');
      li.textContent = project.name;
      li.dataset.projectId = project.id;
      
      if (project.id === activeProjectId) {
        li.classList.add('active');
      }
      
      projectsList.appendChild(li);
    });
  }

  static renderActiveProject(project) {
    const title = document.getElementById('active-project-title');
    if (title) {
      title.textContent = project.name;
    }
  }

  static renderTodos(todos) {
    const todosContainer = document.getElementById('todos-container');
    todosContainer.innerHTML = '';

    if (todos.length === 0) {
      todosContainer.innerHTML = `
        <div class="empty-state">
          <i class="far fa-clipboard"></i>
          <p>No todos yet. Click "Add Todo" to get started!</p>
        </div>`;
      return;
    }

    // Sort todos by due date (earliest first) and then by priority
    const sortedTodos = [...todos].sort((a, b) => {
      const dateDiff = new Date(a.dueDate) - new Date(b.dueDate);
      if (dateDiff !== 0) return dateDiff;
      
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    sortedTodos.forEach(todo => {
      const todoElement = document.createElement('div');
      todoElement.className = `todo ${todo.completed ? 'completed' : ''} priority-${todo.priority}`;
      todoElement.dataset.todoId = todo.id;
      
      const dueDate = new Date(todo.dueDate);
      const formattedDate = format(dueDate, 'MMM d, yyyy');
      
      todoElement.innerHTML = `
        <div class="todo-content">
          <div class="todo-header">
            <h3>${todo.title}</h3>
            <span class="priority-badge ${todo.priority}">${todo.priority}</span>
          </div>
          ${todo.description ? `<p class="todo-description">${todo.description}</p>` : ''}
          <div class="todo-meta">
            <span class="due-date">
              <i class="far fa-calendar-alt"></i> ${formattedDate}
            </span>
            <span class="todo-status">
              <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''} class="todo-complete">
              <label for="todo-${todo.id}">${todo.completed ? 'Completed' : 'Mark Complete'}</label>
            </span>
          </div>
        </div>
        <div class="todo-actions">
          <button class="btn btn-edit" data-todo-id="${todo.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-delete" data-todo-id="${todo.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      todosContainer.appendChild(todoElement);
    });
  }

  static toggleTodoForm(show = true) {
    const formContainer = document.getElementById('todo-form-container');
    const addButton = document.getElementById('add-todo-btn');
    
    if (show) {
      formContainer.classList.remove('hidden');
      addButton.classList.add('hidden');
      document.getElementById('todo-title').focus();
    } else {
      formContainer.classList.add('hidden');
      addButton.classList.remove('hidden');
      this.resetTodoForm();
    }
  }

  static resetTodoForm() {
    const form = document.getElementById('todo-form');
    if (form) {
      form.reset();
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('todo-due-date').value = tomorrow.toISOString().split('T')[0];
    }
  }

  static getTodoFormData() {
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();
    const dueDate = document.getElementById('todo-due-date').value;
    const priority = document.getElementById('todo-priority').value;
    
    return { title, description, dueDate, priority };
  }
}