import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { WeatherService } from '../services/weather-service/weather.service';
import { Task } from '../classes/task.model';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import { DatabaseService } from '../services/database-service/database.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  taskList: Array<Task> = [
    {text: "go shopping", color: "#FCF29C", time: 30},
    {text: "clean house", color: "#9DE883", time: 30}
  ]
  archive: Array<Task> = [];
  colors: Array<string> = ["#FCF29C", "#9DE883", "#FFA0A0"];
  times:Array<any> = [
    {time:30, text: '30m'}, {time:60, text: '1h'}, 
    {time:90, text: '1h 30m'}, {time:120, text: '2h'}
  ]
  location: string = "Los Angeles";
  defaultCoords = "40.7831,-73.9712";
  temp: string = "80";
  task: string = "";
  time: number = 30;
  color: string = "#FCF29C";
  isAdvancedOpen: boolean = true;
  toDelete: boolean = false;
  

  constructor(private weatherService: WeatherService, private dbService: DatabaseService){}

  ngOnInit(){
    //Get weather location or display default location weather
    this.setWeather();
    // Set taskList to tasks in storage if they exists
    if(window.localStorage.getItem("tasks")){
      let tasks = JSON.parse(window.localStorage.getItem("tasks")|| '""');
      if(tasks){this.taskList = tasks};
    }
    // Set colors/times to lists in storage if they exists
    if(window.localStorage.getItem("settings")){
      let settings = JSON.parse(window.localStorage.getItem("settings")|| '""');
      if(settings.times){this.times = settings.times};
      if(settings.colors){this.colors = settings.colors};
    }
  }

  setWeather(): void {
    //Get location from user or use default weather info
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) =>{
          console.log(position);
          let lat = position.coords.latitude;
          let long = position.coords.longitude;
          this.defaultCoords = `${lat},${long}`;
        },
        (error) =>{
          console.error('Error getting user location:', error);
        }
      );
    }
    //If not working, ran out of API calls
    this.weatherService.getWeather(this.defaultCoords)
      .subscribe(result => {
        console.log(result);
        this.location = result.location.name;
        this.temp = result.current.temperature;
      });
  }

  /* AddTask: creates a new Task using the default/selected options
    and adds Task to taskList
  */
  addTask(task: string){
    if(task != ""){
      let newTask = new Task(task,this.color,this.time);
      this.taskList.push(newTask);
      this.task = "";
    }
  }

  getColSize(t:number): string{
    if(t == 60){
      return 'col-4'
    }
    else if(t == 90){
      return 'col-6'
    }
    else if(t == 120){
      return 'col-8'
    }
    return 'col-2';
  }

  setColor(c:string){this.color = c;}

  setTime(t:number){this.time = t;}

  setAdvanced(){this.isAdvancedOpen = !this.isAdvancedOpen}

  drop(event: CdkDragDrop<string[]>) {
    if(this.toDelete){
      this.taskList.splice(event.currentIndex, 1);
      this.toDelete = false;
    }
    else{
      moveItemInArray(this.taskList, event.previousIndex, event.currentIndex);
    }
  }

  trash() {
    this.toDelete = true;
  }

  save(){
    let tasks = JSON.stringify(this.taskList);
    window.localStorage.setItem("tasks", tasks);
    let settings = JSON.stringify({times: this.times, colors: this.colors});
    window.localStorage.setItem("settings", settings);

  }
}
