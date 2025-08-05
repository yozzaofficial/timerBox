export interface workoutStructure{
    id: number,
    name: string,
    timer: workRestTime[],
    round: number,
    totalTime: string;
    subTimer?: subTimer[]
}
export interface workRestTime{
    workMinutes: number,
    workSeconds:number,
    restMinutes: number,
    restSeconds: number,
}
export interface subTimer{
    id:number,
    quantity: number,
    value: valueSubTimer[]
}
export interface valueSubTimer{
    time: number,
    title: string,
}

export class addWorkout implements workoutStructure{
    id: number;
  name: string;
    timer: workRestTime[]
  round: number;
  totalTime: string;
  subTimer?: subTimer[];

  constructor(
    id: number,
    name: string,
    timer: workRestTime[],
    round: number,
    totalTime: string,
    subTimer?: subTimer[],
  ) {
    this.id = id;
    this.name = name;
    this.timer= timer;
    this.round = round;
    this.totalTime = totalTime;
    this.subTimer = subTimer;
  }
}
