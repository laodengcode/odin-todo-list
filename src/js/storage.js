// src/js/storage.js
export default class Storage {
  static saveProjects(projects) {
    // Convert projects to plain objects for storage
    const projectsData = projects.map(project => ({
      id: project.id,
      name: project.name,
      createdAt: project.createdAt.toISOString(),
      todos: project.todos.map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate.toISOString(),
        priority: todo.priority,
        projectId: todo.projectId,
        completed: todo.completed,
        createdAt: todo.createdAt.toISOString()
      }))
    }));
    
    localStorage.setItem('projects', JSON.stringify(projectsData));
  }

  static getProjects() {
    const projectsData = localStorage.getItem('projects');
    if (!projectsData) return [];
    
    try {
      return JSON.parse(projectsData);
    } catch (error) {
      console.error('Error parsing projects from localStorage:', error);
      return [];
    }
  }

  static saveActiveProject(projectId) {
    localStorage.setItem('activeProject', projectId);
  }

  static getActiveProject() {
    return localStorage.getItem('activeProject');
  }
}