import type { addWorkout } from "../types";
import { queryCheck } from "../querySelectorHelper";
import { globalBoolVar } from "../globalVars";
const root = document.documentElement;

let mainH2 = queryCheck<HTMLHRElement>("main h2");
let mainTimer = queryCheck<HTMLParagraphElement>(".mainTimer");
let secondTimer = queryCheck<HTMLParagraphElement>(".secondTimer");
let checkTime=[2];
let currentRound= queryCheck<HTMLParagraphElement>(".currentRound");
let workoutChoosed;
let intervalMain: ReturnType<typeof setInterval> | null = null;
let intervalSub: ReturnType<typeof setInterval> | null = null;
let intervalPre: ReturnType<typeof setInterval> | null = null;
let currentSecond=0;
let currentMinute=0;
let currentSecondSubTimer=0;
let currentSubTimer=0;
let pauseIsActive=false;

let startCoundownSound = new Audio("../../assets/sounds/countdownstart.mp3");
let subTimerEndSound = new Audio("../../assets/sounds/subtimerend.mp3");
let roundEndSound = new Audio("../../assets/sounds/endround.mp3");


const startButtonParagr=queryCheck<HTMLParagraphElement>("#startButton p");

export async function startWorkout(workout: addWorkout,i:number) {
    workoutChoosed=workout;
     mainTimer=queryCheck<HTMLParagraphElement>(".mainTimer"); 
    secondTimer=queryCheck<HTMLParagraphElement>(".secondTimer"); 
    if(pauseIsActive)
        i=parseInt(currentRound.textContent!)-1;
    await prepareTimer();
  for (i; i < workoutChoosed.round; i++) {
    let timer= workoutChoosed.timer[i];
    currentRound.textContent=`${i+1}`;
        checkTime[0]=timer.restMinutes;
        checkTime[1]=timer.restSeconds;
    if(workout.subTimer !== undefined){
        if(workout.subTimer![i].value.length>0)
            globalBoolVar.startTimerSubTimerCheck=true
        else
            globalBoolVar.startTimerSubTimerCheck=false
    }
    // WORK phase
    if(pauseIsActive)
        mainTimer.textContent=`${currentMinute.toString().padStart(2, '0')} : ${currentSecond.toString().padStart(2, '0')}`;
    else
        mainTimer.textContent=`${timer.workMinutes.toString().padStart(2, '0')} : ${timer.workSeconds.toString().padStart(2, '0')}`;
    await startPhase(timer.workMinutes, timer.workSeconds, "Work",i+1);

    // REST phase
    if(i+1<workoutChoosed.round){
        mainTimer.textContent=`${timer.restMinutes.toString().padStart(2, '0')} : ${timer.restSeconds.toString().padStart(2, '0')}`;
        if(timer.restMinutes>0 || timer.restSeconds>0)
            await startPhase(timer.restMinutes, timer.restSeconds, "Rest",i+1);
        }
    }

    roundEndSound.play().catch(err => console.error("Errore nella riproduzione:", err));
    mainH2.textContent="Work"
    root.style.setProperty("--backgroundTimer","#45b6fe")
    mainTimer.textContent="00:00";
    globalBoolVar.startTimerSubTimerCheck=true;
    startButtonParagr.textContent="Start";
}

function prepareTimer():Promise<void>{
    const myPromise = new Promise<void>((resolve)=>{
        let timer=15;
        mainTimer.textContent=`00: ${timer.toString().padStart(2, '0')}`;
        root.style.setProperty("--backgroundTimer","#D4AF37");
        intervalPre = setInterval(()=>{
            mainTimer.textContent=`00: ${timer.toString().padStart(2, '0')}`;
            if(timer==3)
                startCoundownSound.play().catch(err => console.error("Errore nella riproduzione:", err));
            if(timer==0){
                clearInterval(intervalPre!);
                resolve();
            }
            else
                timer--;
        },1000);
    });
    return myPromise;
}


function startPhase(minutes:number,seconds:number,title:string,currentRound:number):Promise<void>{
 const myPromise = new Promise<void>((resolve)=>{
    if(pauseIsActive){
            seconds=currentSecond;
            minutes=currentMinute;
        }
    mainH2.textContent =`${title}`;
    if(title=="Rest")
        root.style.setProperty("--backgroundTimer","#ff3300")
    else
        root.style.setProperty("--backgroundTimer","#2dd881")

    if(seconds==0 && minutes>0){
        seconds=59;
        minutes--;
    }

    if(globalBoolVar.startTimerSubTimerCheck && title=="Work"){
        mainTimer=queryCheck<HTMLParagraphElement>(".secondTimer");
        secondTimer=queryCheck<HTMLParagraphElement>(".mainTimer");
         mainTimer.textContent=`${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        startPhaseSubTimer(workoutChoosed!,currentRound)
    }
    else{
       mainTimer=queryCheck<HTMLParagraphElement>(".mainTimer"); 
       secondTimer=queryCheck<HTMLParagraphElement>(".secondTimer"); 
        secondTimer.textContent="00:00";
    }
    seconds--;
     
    intervalMain = setInterval(()=>{
       
        mainTimer.textContent=`${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        if(seconds== 0){
            if(minutes==0){
                let biggerTimer=queryCheck<HTMLParagraphElement>(".mainTimer"); 
                biggerTimer.textContent=`${checkTime[0].toString().padStart(2, '0')} : ${checkTime[1].toString().padStart(2, '0')}`;
                clearInterval(intervalMain!);
                resolve();
        }
        else{
            minutes--;
            seconds=59;
        }
    }else
        seconds--;
    currentSecond=seconds;
    currentMinute=minutes;
    pauseIsActive=false;
    },1000);
});
return myPromise;
}
let valueNext=0;
async function startPhaseSubTimer(timer:addWorkout,currentRound:number):Promise<void>{
    let valueSubTimer=0;
    let index= currentRound-1;
    let lenghtValue = timer.subTimer![index].value.length;
    let i=0
    if(pauseIsActive)
        i=currentSubTimer;
     if(timer.subTimer![index].value[0].time>0){
        for(i;i<timer.subTimer![index].value.length;i++){
            if(timer.subTimer![index].value[i].time>0){
                valueSubTimer = timer.subTimer![index].value[i].time;
                if(i<lenghtValue)
                    valueNext=valueSubTimer;
                if(i+1>=lenghtValue)
                    valueNext=0;
                secondTimer.textContent=`00 : ${valueSubTimer.toString().padStart(2, '0')}`;
                mainH2.textContent=timer.subTimer![index].value[i].title;
                await subTimerGo(valueSubTimer);
                subTimerEndSound.play().catch(err => console.error("Errore nella riproduzione:", err));
                currentSubTimer=i;
            }
        }            
    }
    else
        return;
}

function subTimerGo(value:number):Promise<void>{
const myPromise = new Promise<void>((resolve)=>{
    if(pauseIsActive){
        value=currentSecondSubTimer;
         secondTimer.textContent=`00 : ${value!.toString().padStart(2, '0')}`;
    }
     intervalSub = setInterval(()=>{
        value--;
        secondTimer.textContent=`00 : ${value!.toString().padStart(2, '0')}`;
        if(value==0){
            clearInterval(intervalSub!);
            secondTimer.textContent=`00 : ${valueNext!.toString().padStart(2, '0')}`;
            resolve();
        }
        currentSecondSubTimer=value;
    },1000);
});

return myPromise;
}

export function pauseWorkout(){
    clearInterval(intervalMain!);
    clearInterval(intervalSub!);
    clearInterval(intervalPre!);
    intervalSub=null;
    intervalSub=null;
     intervalMain = null;
    pauseIsActive=true;
}