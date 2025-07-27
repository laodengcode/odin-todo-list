// Update src/js/app.js
import '../css/style.css';
import { format } from 'date-fns';
import Todo from './todo.js';
import Project from './project.js';
import Storage from './storage.js';
import UI from './ui.js';

// Initialize app
function init() {
  let projects = Storage.getProjects();
  
  // If no projects exist, create a default one
  if (projects.length === 0) {
    const defaultProject = new Project('Default');
    projects = [defaultProject];
    Storage.saveProjects(projects);
    Storage.saveActiveProject(defaultProject.id);
  }

  const activeProjectId = Storage.getActiveProject() || projects[0].id;
  
  // Render UI
  UI.renderProjects(projects, activeProjectId);
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  if (activeProject) {
    UI.renderTodos(activeProject.todos);
  }

  // Add event listeners
  document.getElementById('new-project-btn').addEventListener('click', handleNewProject);
}

// Handle new project creation
function handleNewProject() {
  const projectName = prompt('Enter project name:');
  if (projectName) {
    const newProject = new Project(projectName);
    const projects = Storage.getProjects();
    projects.push(newProject);
    Storage.saveProjects(projects);
    Storage.saveActiveProject(newProject.id);
    
    // Re-render projects
    UI.renderProjects(projects, newProject.id);
    UI.renderTodos(newProject.todos);
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);