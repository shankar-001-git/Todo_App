import { Component } from '@angular/core';
import { Task } from '../../model/task';
import { CrudService } from '../../service/crud.service';
import { FormsModule } from '@angular/forms';   
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule,FormsModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  taskObj: Task = new Task();
  taskArr: Task[] = [];
  addTaskValue: string = '';

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.taskObj = new Task();
    this.taskArr = [];
    this.getAllTask();  
  }

  getAllTask() {
    this.crudService.getTask().subscribe(
      (res) => {
        this.taskArr = res;
      },
      (err) => {
        alert('Unable to get list of tasks');
      }
    );
  }


  addTask() {
    this.taskObj.task_name = this.addTaskValue;
    this.crudService.addTask(this.taskObj).subscribe(
      (res) => {
        this.ngOnInit();  
        this.addTaskValue = res.task_name; 
        console.log(res)
        
      },
      (err) => {
        alert('Failed to add task');
      }
    );
  }


  editTask(id:any) {
    this.crudService.editTask(id).subscribe(
      (res) => {
        this.ngOnInit();  
      },
      (err) => {
        alert('Failed to update task');
      }
    );
  }


  deleteTask(id: any) {
    this.crudService.deleteTask(id).subscribe(
      (res) => {
        this.ngOnInit(); 
      },
      (err) => {
        alert('Failed to delete task');
      }
    );
  }
}
