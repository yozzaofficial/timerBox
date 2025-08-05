import type{ addWorkout,workRestTime } from "./types";
import { queryCheck } from "./querySelectorHelper";
import { globalBoolVar,pushWorkoutS,setGlobalBool } from "./globalVars";
import { calcTotalTime } from "./calcTotalTime";
import { workoutS } from "./globalVars";
import { addWorkoutInList } from "./saveWorkout";
import { createTimersForEdit,setValuesZeroAddWorkout } from "../index";

//doneButton in index

//#region saveButton
let changeColor = queryCheck<HTMLElement>("#addOptionButtonsOpen p:nth-of-type(1)") as HTMLElement;

export function saveWorkoutHandler(workout:addWorkout[],idWorkout:number){
    if(!globalBoolVar.editTimerSection && !globalBoolVar.subTimerSection)
        {
            changeColor.style.color="white";
            addWorkoutSection.classList.add("hidden");
            setGlobalBool("editTimerBool",false)
            setGlobalBool("addOptionOpenClose",true)
            
            if(!globalBoolVar.modifyIsActive){
                pushWorkoutS(workout,idWorkout);
                setGlobalBool("checkingSave",false)
                addWorkoutInList(idWorkout,globalBoolVar.modifyIsActive);
                console.log(workoutS)
                console.log("workout",workout)
            }
        }
        else if(globalBoolVar.editTimerSection){
            let editAddOpt = queryCheck<HTMLElement>("#editTimerSection");
            editAddOpt.classList.add("hidden");
            setGlobalBool("editTimerBool",false)
            setGlobalBool("editTimerSection",false)
            calcTotalTime(workout, idWorkout)
            changeColor.style.color="#2dd881";
        }
        if(globalBoolVar.subTimerSection){
            subTimerSection.classList.add("hidden");
            setGlobalBool("subTimerSection",false)
        }

    setGlobalBool("modifyIsActive",false);
}
//#endregion saveButton

//#region closeWorkout
const addWorkoutSection = queryCheck<HTMLElement>("#addWorkoutSection");
const subTimerSection = queryCheck<HTMLElement>("#subTimerSection");
export function closeWorkoutHandler(workout: addWorkout[],idWorkout:number){
    changeColor.style.color="white"
    if(!globalBoolVar.editTimerSection && !globalBoolVar.subTimerSection){
        
        if(globalBoolVar.modifyIsActive)
            addWorkoutSection.classList.add("hidden");
        else{
            addWorkoutSection.classList.add("hidden");
            workout.splice(idWorkout-1,1);
        }
        setGlobalBool('editTimerBool',false)
        setGlobalBool("addOptionOpenClose",true)
    }
    else if(globalBoolVar.editTimerSection)
    {
        let editAddOpt = queryCheck<HTMLElement>("#editTimerSection");
        editAddOpt.classList.add("hidden");
        setGlobalBool("editTimerBool",false)
        setGlobalBool("editTimerSection",false); //editTimer section closed
        calcTotalTime(workout, idWorkout)
    }
    if(globalBoolVar.subTimerSection){
            subTimerSection.classList.add("hidden");
            setGlobalBool("subTimerSection",false)
    }
}
//#endregion closeWorkout

//#region addSubTiemer
export function addSubTimerHandler(workout:addWorkout[],idWorkout:number){
     if(!globalBoolVar.modifyIsActive){
            workout[idWorkout-1].subTimer=[];
    
            for(let i =0;i<workout[idWorkout-1].round;i++){
                workout[idWorkout-1].subTimer!.push({
                id:i+1,
                quantity:0,
                value:[]
                });
            }
        }
     if(globalBoolVar.modifyIsActive && workout[idWorkout-1].subTimer!.length==0){//for modify 
            workout[idWorkout-1].subTimer=[];
        console.log("JAIDAISDHAISHD")
            for(let i =0;i<workout[idWorkout-1].round;i++){
                workout[idWorkout-1].subTimer!.push({
                id:i+1,
                quantity:0,
                value:[]
                });
            }
        }
}
//#endregion addSubTimer

//#region resetSubTimer
export function resetSubTimerOption(workout: addWorkout[],idWorkout:number,indexSubTImer:number){
    let resetSubTimeOptionButton = queryCheck<HTMLElement>("#resetSubTimerSectionOptionButton");

            const newButton = resetSubTimeOptionButton.cloneNode(true) as HTMLElement;//clear old listener
            resetSubTimeOptionButton.replaceWith(newButton);
    
            newButton.addEventListener("click",()=>{
            if (workout[idWorkout - 1]?.subTimer?.[indexSubTImer]) {
                workout[idWorkout - 1].subTimer![indexSubTImer] = {
                    id:indexSubTImer++,
                    quantity: 0,
                    value: []
                };
                removeRowsAfterResetSubTimerOption();
            }
        });
}

function removeRowsAfterResetSubTimerOption(){
    let divs = document.querySelectorAll("#editTimerAddingrow .rowSubTimer");
    divs.forEach(el => el.remove());
}
//#endregion resetSubTimer

//#region resetButton
export function resetValueWorkout(workout:addWorkout[],idWorkout:number,valueToReset:workRestTime){
 if(!globalBoolVar.editTimerSection && !globalBoolVar.subTimerSection){
        workout[idWorkout-1].name="";
        workout[idWorkout-1].round=1;
        workout[idWorkout-1].totalTime="";
        workout[idWorkout-1].timer.length=0;
        workout[idWorkout-1].timer.push({workMinutes:0,workSeconds:0,restMinutes:0,restSeconds:0});
        if(workout[idWorkout-1].subTimer)
            workout[idWorkout-1].subTimer!.length=0;
        setValuesZeroAddWorkout();
    }
    else if(globalBoolVar.editTimerSection)
    {
        workout[idWorkout-1].timer.length=0;
       for(let i=0;i<workout[idWorkout-1].round;i++)
       {
            workout[idWorkout-1].timer.push({
                workMinutes: valueToReset.workMinutes,
                workSeconds: valueToReset.workSeconds,
                restMinutes: valueToReset.restMinutes,
                restSeconds: valueToReset.restSeconds
            });
       }
        console.log("ASJD")
    const editTimerSection = queryCheck<HTMLElement>("#editTimerSection");
    createTimersForEdit(editTimerSection);
    calcTotalTime(workout,idWorkout);
    }
    if(globalBoolVar.subTimerSection){
           

        if(workout[idWorkout-1].subTimer)
            workout[idWorkout-1].subTimer!.length=0;
        let subTimerSection = queryCheck<HTMLElement>("#subTimerSection");
        createTimersForEdit(subTimerSection);
    }
}

//#endregion resetButton

