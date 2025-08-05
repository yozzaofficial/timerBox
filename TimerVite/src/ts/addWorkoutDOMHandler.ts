import { queryCheck } from "./querySelectorHelper";
import { globalBoolVar,setGlobalBool } from "./globalVars";
import type { addWorkout } from "./types";
import { resetSubTimerOption } from "./buttonsHandler";
const timeSelection = queryCheck<HTMLElement>("#chooseNumberContainer");

let descAddTime1 = queryCheck<HTMLElement>("#descAddTime1");
let descAddTime2 = queryCheck<HTMLElement>("#descAddTime2");
let secondW = queryCheck<HTMLElement>("#secondsWorkout");
let minuteW = queryCheck<HTMLElement>("#minutesWorkout");

const addOptionButtonSign = queryCheck<HTMLElement>("#addOption p:nth-of-type(2)");

const root = document.documentElement;

export function openTimeSelection(whatIsOpening: number){

    switch(whatIsOpening){
        case 0: //mintues and seconds
                minuteW.classList.remove("transformTranslate");//round
                secondW.classList.remove("transformTranslateNegative");//subTimer

                minuteW.classList.remove("hidden");
                secondW.classList.remove("hidden");

                descAddTime1.classList.remove("hidden");
                descAddTime2.classList.remove("hidden");

                timeSelection.classList.remove("hidden");
            break;
        case 1: //rounds
            descAddTime1.classList.add("hidden");
            descAddTime2.classList.add("hidden");
            secondW.classList.add("hidden");
            minuteW.classList.add("transformTranslate");
            timeSelection.classList.remove("hidden");

            break;
        case 2://editTimer
            descAddTime1!.classList.remove("hidden");
            descAddTime2!.classList.remove("hidden");
            secondW!.classList.remove("hidden");
            minuteW!.classList.remove("transformTranslate");
            break;
        case 3://editTimer
            timeSelection.classList.remove("hidden");
            minuteW.classList.remove("hidden")
            break;
        case 4://subTimer
            secondW.classList.remove("hidden");
            timeSelection.classList.remove("hidden");
            descAddTime1.classList.add("hidden");
            descAddTime2.classList.add("hidden");
            minuteW.classList.add("hidden");
            secondW.classList.add("transformTranslateNegative");
            break;
        default:
            break;
    }
}

export function addOptionButtonHandler(){
    if(globalBoolVar.addOptionOpenClose){
        addOptionButtonSign.textContent="+";
        setGlobalBool("addOptionOpenClose",false)
         root.style.setProperty("--height100","0");
                
    }else{
        addOptionButtonSign.textContent="-";
        setGlobalBool("addOptionOpenClose",true)
        root.style.setProperty("--height100","180%");

    }
}

//#region createRoundsForEdit/Sub
export function createRoundsForEditOrSub(workout:addWorkout[],idWorkout:number,timerSection: Element){

deleteOldDivs(timerSection);

for(let i=0;i<workout[idWorkout-1]!.round;i++)
    {
        let div = document.createElement("div");
        div.classList.add("editTimerDivs");
        let h2 = document.createElement("h2");
        h2.textContent=`Round ${i+1}`;
        div.appendChild(h2);
        for(let j =0;j<4;j++){
            let paragraph = document.createElement("p");
               let zero = "0";
            switch(j){
                case 0:
                    paragraph.textContent=`Work`;
                    div.appendChild(paragraph);
                    break;
                case 1:
                    if(workout[idWorkout-1]!.timer[0].workSeconds>9)
                        zero="";
                    else
                        zero="0";
                    paragraph.textContent=`${workout[idWorkout-1]!.timer[i].workMinutes} : ${zero}${workout[idWorkout-1]!.timer[i].workSeconds}`;
                    div.appendChild(paragraph);
                    break;
                case 2:
                    paragraph.textContent=`Rest`;
                    div.appendChild(paragraph);
                    break;
                case 3:
                       if(workout[idWorkout-1]!.timer[0].restSeconds>9)
                        zero="";
                    else
                        zero="0";
                    paragraph.textContent=`${workout[idWorkout-1]!.timer[i].restMinutes} : ${zero}${workout[idWorkout-1]!.timer[i].restSeconds}`;
                    div.appendChild(paragraph);
                    break;
                default:
                        break;
            }
        }
        timerSection.appendChild(div);
    }
}

function deleteOldDivs(timerSection:Element){
     let divs = timerSection.querySelectorAll(".editTimerDivs");
    if(divs){//remove olds div
        for(let i =0;i <divs.length;i++){
             timerSection.removeChild(divs[i]);
    }
    }
}
//#endregion createRoundsForEdit/Sub

//#region subTimer

export function openSubTimerOptions(workout:addWorkout[],idWorkout:number, i:number){
    let numberRound = queryCheck<HTMLElement>("#subTimerSectionOption h2");
        numberRound.textContent=`Round ${i+1}`
    let timeRound = queryCheck<HTMLElement>("#timeForRoundsubTimerAdding");
        timeRound!.textContent=`${workout[idWorkout-1].timer[i].workMinutes} + ${workout[idWorkout-1].timer[i].workSeconds}`;
    resetSubTimerOption(workout,idWorkout,i);
    clearDivsSubtimer();
}
function clearDivsSubtimer(){
    let div = document.querySelectorAll("#editTimerAddingrow .rowSubTimer");
    div.forEach(el => el.remove());


}

export function createRowSubTimerOptions():HTMLDivElement{
    let p = document.createElement("p");
    let div = document.createElement("div")
    let input = document.createElement("input");

    div.classList.add("rowSubTimer");
    p.classList.add("subtTimerValue");
    input.type="text";
    input.classList.add("subTimerTitle");
    input.maxLength=20;

    div.appendChild(p);
    div.appendChild(input);

    return div;
}
//#endregion subTimer
