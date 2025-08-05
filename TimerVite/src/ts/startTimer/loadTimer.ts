import { workoutS } from "../globalVars";
import type { addWorkout } from "../types";
import { queryCheck } from "../querySelectorHelper";
import {setGlobalBool } from "../globalVars";

export function takeDataFromWorkout():addWorkout{
let workoutFromList = queryCheck<HTMLParagraphElement>("#programsTimer p.programSelected i")

let dataId = workoutFromList.getAttribute("data-id");
let index = parseInt(dataId!);
let loadWorkout = workoutS[index-1];
let mainTimer = queryCheck<HTMLParagraphElement>(".mainTimer");
let secondTimer  = queryCheck<HTMLParagraphElement>(".secondTimer");
let totalRound = queryCheck<HTMLParagraphElement>(".totalRound");
totalRound.textContent=`of ${loadWorkout.round}`;
if(loadWorkout.subTimer && loadWorkout.subTimer[0].value[0]){
    mainTimer.textContent = `00 : ${loadWorkout.subTimer[0].value[0].time.toString().padStart(2, '0')}`;
    secondTimer.textContent = `${loadWorkout.timer[0].workMinutes.toString().padStart(2, '0')} : ${loadWorkout.timer[0].workSeconds.toString().padStart(2, '0')}`;

    setGlobalBool("startTimerSubTimerCheck",true);
}
else{
    mainTimer.textContent = `${loadWorkout.timer[0].workMinutes.toString().padStart(2, '0')} : ${loadWorkout.timer[0].workSeconds.toString().padStart(2, '0')}`;
    setGlobalBool("startTimerSubTimerCheck",false);
}

return loadWorkout;
}
