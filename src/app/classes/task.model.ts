export class Task{
    text: string = "";
    color: string = "yellow";
    time: number = 30;
    x:number = 0;
    constructor(text:string, color:string, time:number, x:number){
        this.text = text;
        this.color = color;
        this.time = time;
        this.x = x;
    };
}