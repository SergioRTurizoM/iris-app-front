import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Task } from '../interfaces';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IrisheaderComponent } from "../irisheader/irisheader.component";

@Component({
  selector: 'app-todo',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IrisheaderComponent
],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  [x: string]: any;
  filter: string = 'All';
  tasks: Task[] = [];

  newTaskForm: FormGroup = new FormGroup({
    task: new FormControl('',
      [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(250)
      ])
  });

  constructor(
    private readonly todoService: TodoService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {

  }

  ngOnInit(): void {
    this.fetchTasks();
  }

  get filteredTasks(): Task[] {
    switch (this.filter) {
      case 'Completed':
        return this.tasks.filter(task => task.completed);
      case 'Pending':
        return this.tasks.filter(task => !task.completed);
      default:
        return this.tasks;
    }
  }

  fetchTasks(): void {
    this.todoService.getTasks()
      .subscribe({
        next: tasks => {
          this.tasks = tasks
        },
        error: error => console.error('There was an error fetching the tasks', error)
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addTask(): void {
    if (this.newTaskForm.invalid) return;
    const taskText = this.newTaskForm.get('task')?.value.trim();
    if (!taskText) return;

    this.todoService.createTask({ text: taskText })
      .subscribe({
        next: task => {
          this.tasks.push(task);
          this.newTaskForm.reset();
        },
        error: error => {
          console.error('There was an error adding the task', error);
          this.newTaskForm.reset();
        },
        complete: () => this.newTaskForm.reset(),
      });
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  randomId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  deleteTask(id: string): void {
    this.todoService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: err => {
        console.error('Error deleting task:', err);
      }
    });
  }

  updateTask(id: string, newText: string): void {
    const payload = { text: newText };
    this.todoService.updateTask(id, payload).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index > -1) {
          this.tasks[index] = updatedTask;
        }
      },
      error: (err) => {
        console.error('Error updating task:', err);
      }
    });
  }

  toggleTaskEditing(id: string): void {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.editing = !task.editing;
    }
  }

  toggleTaskCompletion(id: string): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      const updatedCompletion = !task.completed;
      this.todoService.updateTask(id, { completed: updatedCompletion }).subscribe({
        next: (updatedTask) => {
          task.completed = updatedTask.completed;
        },
        error: (err) => {
          console.error('Error updating task completion:', err);
        }
      });
    }
  }

  setFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filter = target.value ? target.value : 'All';
  }
}
