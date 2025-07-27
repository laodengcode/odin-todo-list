// src/js/ui.js
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
  
    static renderTodos(todos) {
      const todosContainer = document.getElementById('todos-container');
      todosContainer.innerHTML = '';
  
      if (todos.length === 0) {
        todosContainer.innerHTML = '<p>No todos found. Add a new todo to get started!</p>';
        return;
      }
  
      todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = `todo ${todo.completed ? 'completed' : ''} priority-${todo.priority}`;
        todoElement.dataset.todoId = todo.id;
        
        todoElement.innerHTML = `
          <h3>${todo.title}</h3>
          <p>${todo.description}</p>
          <div class="todo-meta">
            <span class="due-date">Due: ${format(new Date(todo.dueDate), 'MMM d, yyyy')}</span>
            <span class="priority">${todo.priority}</span>
          </div>
          <div class="todo-actions">
            <button class="btn btn-edit">Edit</button>
            <button class="btn btn-delete">Delete</button>
            <input type="checkbox" ${todo.completed ? 'checked' : ''} class="todo-complete">
          </div>
        `;
        
        todosContainer.appendChild(todoElement);
      });
    }
  }