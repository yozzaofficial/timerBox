import { addWorkout } from "./types";
import { queryCheck } from "./querySelectorHelper";

const workTimeAddWorkout = queryCheck<HTMLElement>("#workTimeAddWorkout");
const restTimeAddWorkout = queryCheck<HTMLElement>("#restTimeAddWorkout");
const roundAddWorkout = queryCheck<HTMLElement>("#roundAddWorkout");

export function setWorkoutForModify(workout:addWorkout[],idWorkout:number){
    let checkingNumbers = workout[idWorkout-1].timer[0].workSeconds;
    if(checkingNumbers>9)
        workTimeAddWorkout.textContent=workout[idWorkout-1].timer[0].workMinutes +" : "+workout[idWorkout-1].timer[0].workSeconds;
    else
        workTimeAddWorkout.textContent=workout[idWorkout-1].timer[0].workMinutes +" : 0"+workout[idWorkout-1].timer[0].workSeconds;
    checkingNumbers = workout[idWorkout-1].timer[0].restSeconds;
     if(checkingNumbers>9)
        restTimeAddWorkout.textContent=workout[idWorkout-1].timer[0].restMinutes +" : "+workout[idWorkout-1].timer[0].restSeconds;
    else
        restTimeAddWorkout.textContent=workout[idWorkout-1].timer[0].restMinutes +" : 0"+workout[idWorkout-1].timer[0].restSeconds;

    roundAddWorkout.textContent=`${workout[idWorkout-1].round}`;    
}
   