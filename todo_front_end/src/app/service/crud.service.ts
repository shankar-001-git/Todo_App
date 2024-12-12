import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../model/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private apiUrl = 'http://localhost:3000/api/tasks';  //This is my backend endpoint

  constructor(private http: HttpClient) {}

  // Fetch all tasks
  getTask(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Add a new task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Edit a task
  editTask(task: any): Observable<Task> {
    console.log("jijidf",task.task_name)
    return this.http.put<Task>(`${this.apiUrl}/${task._id}`, task);
  }

  // Delete a task
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
