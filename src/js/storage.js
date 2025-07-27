// src/js/storage.js
export default class Storage {
    static saveProjects(projects) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  
    static getProjects() {
      const projects = localStorage.getItem('projects');
      return projects ? JSON.parse(projects) : [];
    }
  
    static saveActiveProject(projectId) {
      localStorage.setItem('activeProject', projectId);
    }
  
    static getActiveProject() {
      return localStorage.getItem('activeProject');
    }
  }