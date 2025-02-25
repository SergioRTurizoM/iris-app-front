import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockTodoService = {
  getTasks: jasmine.createSpy('getTasks').and.returnValue(of([])),
  createTask: jasmine.createSpy('createTask').and.callFake((payload: any) =>
    of({ id: '1', ...payload, completed: false })
  ),
  deleteTask: jasmine.createSpy('deleteTask').and.returnValue(
    of({ message: 'Todo deleted successfully' })
  ),
  updateTask: jasmine.createSpy('updateTask').and.callFake((id: string, payload: any) =>
    of({ id, ...payload })
  ),
};

const mockAuthService = {
  logout: jasmine.createSpy('logout'),
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
};

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TodoComponent,
        HttpClientTestingModule],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the TodoComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on initialization', () => {
    component.ngOnInit();
    expect(mockTodoService.getTasks).toHaveBeenCalled();
  });

  it('should add a task when form is valid', fakeAsync(() => {
    component.newTaskForm.setValue({ task: 'Go to the beach' });
    component.addTask();
    tick();
    expect(mockTodoService.createTask).toHaveBeenCalledWith({ text: 'Go to the beach' });
    expect(component.tasks.length).toBeGreaterThan(0);
  }));
});
