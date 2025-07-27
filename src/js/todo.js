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
    // Only update properties that are actually provided in the updates object
    if (updates.title !== undefined) this.title = updates.title;
    if (updates.description !== undefined) this.description = updates.description;
    if (updates.priority !== undefined) this.priority = updates.priority;
    if (updates.projectId !== undefined) this.projectId = updates.projectId;
    if (updates.completed !== undefined) this.completed = updates.completed;
    
    // Special handling for dueDate to ensure it's always a Date object
    if (updates.dueDate) {
      this.dueDate = new Date(updates.dueDate);
    }
    
    return this; // Return the updated todo for method chaining
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