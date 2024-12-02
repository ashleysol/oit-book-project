import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { WeatherService } from '../services/weather-service/weather.service';
import { Task } from '../classes/task.model';
import {CdkDragDrop, CdkDrag, CdkDropList, CdkDragMove, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
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
    {text: "go shopping", color: "#FCF29C", time: 30, x:0},
    {text: "clean house", color: "#9DE883", time: 30, x:0}
  ]
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

  @ViewChild('scheduledTasks',{read:ElementRef,static:true}) dropZone!:ElementRef;
  
  hourMarkers: number[] = [1,2,3,4, 5]; // Major markers: 1 PM and 5 PM
  halfHourTicks: number[] = Array.from({ length: 25 }, (_, i) => i); // Half-hour ticks
  droppedEvents: Array<Task>  = [{text: "go shopping", color: "#FCF29C", time: 60, x:0},];
  dragPosition = {x: 0, y: 0};
  _pointerPosition:any;
  snapIntervalMinutes = 15;
  hourWidthPercentage = 100 / 6; // Each hour takes up 1/6th of the width.
  ticksPerHour = 60 / this.snapIntervalMinutes; 


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
      let newTask = new Task(task,this.color,this.time, 0);
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
  

  trash() {
    this.toDelete = true;
  }

  save(){
    let tasks = JSON.stringify(this.taskList);
    window.localStorage.setItem("tasks", tasks);
    let settings = JSON.stringify({times: this.times, colors: this.colors});
    window.localStorage.setItem("settings", settings);

  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.item.data.x=(this._pointerPosition.x-this.dropZone.nativeElement.getBoundingClientRect().left)
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  
  onEventDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  moved(event: CdkDragMove) {
    this._pointerPosition=event.pointerPosition;
  }
  
  changePosition(event:CdkDragDrop<any>,field:any)
  {
    console.log(this.dropZone.nativeElement);
    
    const rectZone=this.dropZone.nativeElement.getBoundingClientRect()
    const rectElement=event.item.element.nativeElement.getBoundingClientRect()

    let x=+field.x+event.distance.x
    const out= x<0 || (x>(rectZone.width-rectElement.width));
    console.log(x);
    console.log(out);
    if (!out)
    {
       field.x=x
       //this.done=this.done.sort((a,b)=>a['z-index']>b['z-index']?1:a['z-index']<b['z-index']?-1:0)
    }
    else{
      //this.todo.push(field)
      //this.done=this.done.filter(x=>x!=field)
    }
  }
  
  getSnappedPosition(task: any): number {
    const containerWidth = document.querySelector('.timeline-container')?.clientWidth || 1;
  
    // Convert mouse X position to percentage
    const mouseXPercent = (task.x / containerWidth) * 100;
  
    // Total percentage for each 15-minute interval
    const intervalPercent = this.hourWidthPercentage / this.ticksPerHour;
  
    // Find the nearest snap point in percentage
    const snapIndex = Math.round(mouseXPercent / intervalPercent);
  
    // Ensure position stays within bounds (0-100%)
    return Math.min(100, Math.max(0, snapIndex * intervalPercent));
  }
  
}
