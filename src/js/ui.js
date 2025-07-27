// src/js/ui.js
import { format } from 'date-fns';

export default class UI {
  static renderProjects(projects, activeProjectId) {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';

    projects.forEach(project => {
      const li = document.createElement('li');
      li.dataset.projectId = project.id;
      
      if (project.id === activeProjectId) {
        li.classList.add('active');
      }
      
      li.innerHTML = `
        <span class="project-name">${project.name}</span>
        <div class="project-actions">
          <button class="btn btn-edit-project" title="Rename project">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      `;
      
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
          <i class="fas fa-tasks"></i>
          <h3>No todos yet</h3>
          <p>Click the "Add Todo" button to get started</p>
        </div>
      `;
      return;
    }

    // Sort todos by due date (ascending) and priority (high to low)
    const sortedTodos = [...todos].sort((a, b) => {
      if (a.dueDate < b.dueDate) return -1;
      if (a.dueDate > b.dueDate) return 1;
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    sortedTodos.forEach(todo => {
      const todoElement = document.createElement('div');
      todoElement.className = `todo ${todo.priority}-priority ${todo.completed ? 'completed' : ''}`;
      todoElement.dataset.todoId = todo.id;

      const dueDate = new Date(todo.dueDate);
      const formattedDate = format(dueDate, 'MMM d, yyyy');
      
      todoElement.innerHTML = `
        <div class="todo-content">
          <div class="todo-header">
            <h3>${todo.title}</h3>
            <span class="priority-badge">${todo.priority}</span>
          </div>
          ${todo.description ? `<p class="todo-description">${todo.description}</p>` : ''}
          <div class="todo-meta">
            <span class="due-date">
              <i class="far fa-calendar-alt"></i>
              ${formattedDate}
            </span>
            <div class="todo-actions">
              <button class="btn btn-edit" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-delete" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <label class="todo-status">
          <input type="checkbox" class="todo-complete" ${todo.completed ? 'checked' : ''}>
          ${todo.completed ? 'Completed' : 'Mark as complete'}
        </label>
      `;

      todosContainer.appendChild(todoElement);
    });
  }

  static toggleTodoForm(show = true, todo = null) {
    const formContainer = document.getElementById('todo-form-container');
    const form = document.getElementById('todo-form');
    const addButton = document.getElementById('add-todo-btn');
    const formTitle = formContainer.querySelector('h3');
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (show) {
      if (todo) {
        // Edit mode
        form.dataset.editId = todo.id;
        formTitle.textContent = 'Edit Todo';
        submitButton.textContent = 'Update Todo';
        this.populateTodoForm(todo);
      } else {
        // Add mode
        form.dataset.editId = '';
        formTitle.textContent = 'Add New Todo';
        submitButton.textContent = 'Add Todo';
        this.resetTodoForm();
      }
      
      formContainer.classList.remove('hidden');
      addButton.classList.add('hidden');
      document.getElementById('todo-title').focus();
    } else {
      formContainer.classList.add('hidden');
      addButton.classList.remove('hidden');
      form.reset();
      form.removeAttribute('data-edit-id');
    }
  }
  
  static populateTodoForm(todo) {
    document.getElementById('todo-title').value = todo.title;
    document.getElementById('todo-description').value = todo.description || '';
    
    // Format date for the date input (YYYY-MM-DD)
    const dueDate = new Date(todo.dueDate);
    const formattedDate = dueDate.toISOString().split('T')[0];
    document.getElementById('todo-due-date').value = formattedDate;
    
    document.getElementById('todo-priority').value = todo.priority || 'medium';
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
    const form = document.getElementById('todo-form');
    const isEdit = form.dataset.editId !== '';
    
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();
    const dueDate = document.getElementById('todo-due-date').value;
    const priority = document.getElementById('todo-priority').value;
    
    return { 
      id: isEdit ? form.dataset.editId : null,
      title, 
      description, 
      dueDate, 
      priority 
    };
  }
}