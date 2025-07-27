// src/js/todo.js
import { format, isBefore, isToday, isTomorrow, isThisWeek } from 'date-fns';

export default class Todo {
  constructor(title, description, dueDate, priority, projectId, completed = false) {
    this.id = Date.now().toString();
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority; // 'low', 'medium', 'high'
    this.projectId = projectId;
    this.completed = completed;
    this.createdAt = new Date();
  }

  toggleComplete() {
    this.completed = !this.completed;
    return this.completed;
  }

  update(updates) {
    Object.assign(this, updates);
    if (updates.dueDate) {
      this.dueDate = new Date(updates.dueDate);
    }
  }

  getFormattedDate() {
    return format(this.dueDate, 'yyyy-MM-dd');
  }

  getDueDateStatus() {
    if (isToday(this.dueDate)) return 'today';
    if (isTomorrow(this.dueDate)) return 'tomorrow';
    if (isThisWeek(this.dueDate)) return 'this-week';
    if (isBefore(this.dueDate, new Date())) return 'overdue';
    return 'future';
  }
}