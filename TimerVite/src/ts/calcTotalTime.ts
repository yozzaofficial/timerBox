import type { addWorkout} from './types';

export function calcTotalTime(workout: addWorkout[],idWorkout: number){
    let tempTotalTime = document.querySelector("#tempTotalTime");

 let minuteSum = 0;
 let secondSum= 0;

if(workout){
    for(let i=0;i<workout[idWorkout-1].timer.length;i++){
        minuteSum+= workout[idWorkout-1].timer[i].workMinutes;
        minuteSum+= workout[idWorkout-1].timer[i].restMinutes;

        secondSum+=workout[idWorkout-1].timer[i].workSeconds;
        secondSum+=workout[idWorkout-1].timer[i].restSeconds;

    }
}
   
    secondSum+=15;

    if(secondSum>=60){
        minuteSum += Math.floor(secondSum / 60);
        secondSum = secondSum % 60;
    }
  
    if(secondSum>9)
        tempTotalTime!.textContent=`${minuteSum} : ${secondSum}`;
    else
        tempTotalTime!.textContent=`${minuteSum} : 0${secondSum}`;
     workout[idWorkout-1].totalTime=tempTotalTime!.textContent;

}