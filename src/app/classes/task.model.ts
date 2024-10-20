export class Task{
    text: string = "";
    color: string = "yellow";
    time: number = 30;
    constructor(text:string, color:string, time:number){
        this.text = text;
        this.color = color;
        this.time = time;
    };
}