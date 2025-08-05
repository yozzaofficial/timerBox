import type {workRestTime,addWorkout } from './ts/types';
import { globalBoolVar,setGlobalBool,workoutS} from './ts/globalVars';
import{ calcTotalTime} from "./ts/calcTotalTime";
import { timeSelectionPositionHandler, slider } from './ts/timeSelectionHandler';
import { openTimeSelection,addOptionButtonHandler,createRoundsForEditOrSub,openSubTimerOptions,createRowSubTimerOptions } from './ts/addWorkoutDOMHandler';
import { queryCheck,queryAllCheck} from './ts/querySelectorHelper';
import { closeWorkoutHandler, saveWorkoutHandler,addSubTimerHandler,resetValueWorkout } from './ts/buttonsHandler';
import { setWorkoutForModify } from './ts/modifyWorkout';
import { takeDataFromWorkout } from './ts/startTimer/loadTimer';
import { startWorkout,pauseWorkout } from './ts/startTimer/startWorkout';
const root = document.documentElement;
//#region mainPage
const openMenuButton = queryCheck<HTMLElement>("#menuButtons .openMenu");
const menuButton = queryCheck<HTMLElement>("#menuButtons");
let isMenuOpen = false;
openMenuButton.addEventListener("click", ()=>{menuHandler()});

function menuHandler(){
     root.style.setProperty("--height100",`0`);
    let heightValue="";
    let degValue ="";
    if(!isMenuOpen){
        heightValue="200%";
        degValue="-180deg"
        isMenuOpen = true;
        menuButton!.classList.remove("borderRadius10px");
    }else if(isMenuOpen){
        heightValue="0";
        degValue="-90deg"
        isMenuOpen = false;
        setTimeout(()=>{menuButton.classList.add("borderRadius10px");},200);
    }

    root.style.setProperty("--height100",`${heightValue}`);
    root.style.setProperty("--rotateValueArrowForMenuStart",`${degValue}`)
};
//#endregion mainPage

//#region lateralMenu
    const lateralMenuButton = queryCheck<HTMLElement>("#mainHeader .icon-menucircle");
    const lateralMenuCloseButton = queryCheck<HTMLElement>("#lateralMenu header .icon-cancel");

    lateralMenuButton.addEventListener("click",openLateralMenu);
    lateralMenuCloseButton.addEventListener("click",closeLateralMenu);

    function openLateralMenu(){
        root.style.setProperty("--positionLateralMenu",`0`)
        root.style.setProperty("--height100","0");
    }
    function closeLateralMenu(){
        root.style.setProperty("--positionLateralMenu",`100%`)
    }

    const totalTime = queryCheck<HTMLElement>("#totalTime"); //message prapare time
    const messagePrepareTime = queryCheck<HTMLElement>("#the15sMessage");
    totalTime.addEventListener("click",()=>{
    messagePrepareTime!.classList.toggle("hidden");
    });

    //setting
    const settingsButton = queryCheck<HTMLElement>("#lateralMenu header .icon-cog-alt");
    const cancelLateralMenu = queryCheck<HTMLElement>("#lateralMenu header .icon-cancel");
    const timeLateralMenu = queryCheck<HTMLElement>("#totalTime")
    const settingMenu = queryCheck<HTMLElement>("#setting");

    settingsButton.addEventListener("click",()=>{
            cancelLateralMenu.classList.toggle("filterBlur3px");
           timeLateralMenu.classList.toggle("filterBlur3px");
           settingMenu.classList.toggle("hidden");

    });
//#endregion lateralMenu

//#region addWorkout

let workout:addWorkout[]=[];

let idWorkout=0;
const addNewWorkout = queryCheck<HTMLElement>("#addNewTimerButton");
const addWorkoutSection = queryCheck<HTMLElement>("#addWorkoutSection");
addNewWorkout.addEventListener("click",openForm);
let workRestTImeEmpy: workRestTime[] = [{workMinutes:0,
    workSeconds:0,
    restMinutes:0,
    restSeconds:0,
}];
function openForm(){
    idWorkout++;
    addWorkoutSection.classList.remove("hidden");
    
    root.style.setProperty("positionMinutesChoice","0px");
    root.style.setProperty("positionSecondssChoice","0px");
    workout.push({id:idWorkout,name:"",timer:workRestTImeEmpy,round:1,totalTime:""});
    console.log(workout)
    setValuesZeroAddWorkout();
};
//#region slider
//min
const listNumber = queryCheck<HTMLElement>("#minutesWorkout") as HTMLElement;

let startY = 0;
let sumMin = 0;
let isDraggingMin = false;
let activePointerIdMin: number | null = null;

listNumber.addEventListener("pointerdown", (e: PointerEvent) => {
  if (isDraggingMin) return;
  isDraggingMin = true;
  activePointerIdMin = e.pointerId;
  startY = e.screenY;
  e.preventDefault();
  listNumber.setPointerCapture(e.pointerId);
});

listNumber.addEventListener("pointermove", (e: PointerEvent) => {
  if (!isDraggingMin || e.pointerId !== activePointerIdMin) return;

  const deltaY = startY - e.screenY;
  sumMin += deltaY;
  let result = slider(0, sumMin);
  sumMin = result.newSum;
  root.style.setProperty("--positionMinutesChoice", `-${result.position}px`);

  startY = e.screenY;
  e.preventDefault();
});

listNumber.addEventListener("pointerup", (e: PointerEvent) => {
  if (e.pointerId !== activePointerIdMin) return;
  isDraggingMin = false;
  activePointerIdMin = null;
  listNumber.releasePointerCapture(e.pointerId);
  e.preventDefault();
});

listNumber.addEventListener("pointercancel", (e: PointerEvent) => {
  if (e.pointerId !== activePointerIdMin) return;
  isDraggingMin = false;
  activePointerIdMin = null;
  listNumber.releasePointerCapture(e.pointerId);
  e.preventDefault();
});

// ---- SECONDI ----

const listSeconds = queryCheck<HTMLElement>("#secondsWorkout") as HTMLElement;

let startYs = 0;
let sumSec = 0;
let isDraggingSec = false;
let activePointerIdSec: number | null = null;

listSeconds.addEventListener("pointerdown", (e: PointerEvent) => {
  if (isDraggingSec) return;
  isDraggingSec = true;
  activePointerIdSec = e.pointerId;
  startYs = e.screenY;
  e.preventDefault();
  listSeconds.setPointerCapture(e.pointerId);
});

listSeconds.addEventListener("pointermove", (e: PointerEvent) => {
  if (!isDraggingSec || e.pointerId !== activePointerIdSec) return;

  const deltaY = startYs - e.screenY;
  sumSec += deltaY;
  let result = slider(1, sumSec);
  sumSec = result.newSum;
  root.style.setProperty("--positionSecondsChoice", `-${result.position}px`);

  startYs = e.screenY;
  e.preventDefault();
});

listSeconds.addEventListener("pointerup", (e: PointerEvent) => {
  if (e.pointerId !== activePointerIdSec) return;
  isDraggingSec = false;
  activePointerIdSec = null;
  listSeconds.releasePointerCapture(e.pointerId);
  e.preventDefault();
});

listSeconds.addEventListener("pointercancel", (e: PointerEvent) => {
  if (e.pointerId !== activePointerIdSec) return;
  isDraggingSec = false;
  activePointerIdSec = null;
  listSeconds.releasePointerCapture(e.pointerId);
  e.preventDefault();
});

//#endregion slider

//#region addWorkout

const addWorkoutWorkTime = queryCheck<HTMLElement>("#work");
const addWorkoutRestTime = queryCheck<HTMLElement>("#rest");
const addRound = queryCheck<HTMLElement>("#round");

const timeSelection = queryCheck<HTMLElement>("#chooseNumberContainer");

let wichOneClicked = 0;

const titleAddWorkout = queryCheck<HTMLElement>("#descRoundTime");

addWorkoutWorkTime!.addEventListener("click",()=>{

    const workTimeAddWorkout = queryCheck<HTMLElement>("#workTimeAddWorkout");
    titleAddWorkout!.textContent="Work";

    openTimeSelection(0);
   
    let position= timeSelectionPositionHandler(workTimeAddWorkout!,0);
    root.style.setProperty("--positionMinutesChoice",`-${position}px`);
    sumMin=position;//without this the number selection will start from the value of the element(work or rest or round)
                    //but it will change instantly to the last value choosed. ES: rest 10seconds, work will start from 0
                    //but when the slider starts it will change in 10

    position = timeSelectionPositionHandler(workTimeAddWorkout!,1);
    root.style.setProperty("--positionSecondsChoice",`-${position}px`);
    sumSec=position;
 
    wichOneClicked = 0;
});

addWorkoutRestTime!.addEventListener("click",()=>{
 
    const restTimeAddWorkout = queryCheck<HTMLElement>("#restTimeAddWorkout");
    titleAddWorkout!.textContent="Rest";

    openTimeSelection(0);

    let position= timeSelectionPositionHandler(restTimeAddWorkout!,0);
    root.style.setProperty("--positionMinutesChoice",`-${position}px`);
    sumMin=position;
    
    position = timeSelectionPositionHandler(restTimeAddWorkout!,1);
    root.style.setProperty("--positionSecondsChoice",`-${position}px`);
    sumSec=position;

    wichOneClicked= 1;
});

addRound!.addEventListener("click",()=>{

    openTimeSelection(1);

    const roundAddWorkout = queryCheck<HTMLElement>("#roundAddWorkout");
    let position = timeSelectionPositionHandler(roundAddWorkout!,0);
    root.style.setProperty("--positionMinutesChoice",`-${position}px`);
    sumMin=position;

    titleAddWorkout!.textContent="Rounds";
  
    wichOneClicked=2;
});

let doneButtonAddWorkout = queryCheck<HTMLElement>("#doneButton");

doneButtonAddWorkout!.addEventListener("click",()=>{
    if(!globalBoolVar.editTimerBool && !globalBoolVar.subTimerBool){
        setTimeAddWorkout();//addWorkoutSection change the value of the boxes and add timer value to workout
        calcTotalTime(workout, idWorkout); //calculation for the total time of a workout and create n timer * n round
        timeSelection!.classList.add("hidden");
    }
    if(globalBoolVar.subTimerBool){//subTimer
        wichOneClicked=3;
        setTimeAddWorkout();
        timeSelection!.classList.add("hidden");
    }
     
});

let minutesTimer = queryAllCheck<HTMLElement>("#minutesWorkout li");
let secondsTimer = queryAllCheck<HTMLElement>("#secondsWorkout li");

const workTimeAddWorkout = queryCheck<HTMLElement>("#workTimeAddWorkout");
const restTimeAddWorkout = queryCheck<HTMLElement>("#restTimeAddWorkout");
const roundAddWorkout = queryCheck<HTMLElement>("#roundAddWorkout");

let temporarySubTimerOptionTimeValue:number [] =[];
let temporaryEditTimerOptionTimeValue:workRestTime;
 temporaryEditTimerOptionTimeValue={workMinutes:0,workSeconds:0,restMinutes:0,restSeconds:0}

function setTimeAddWorkout(){
    const styler = getComputedStyle(root);
    let positionTopSeconds = styler.getPropertyValue("--positionSecondsChoice");  //get last position of number selection  seconds
    let positionTopMinutes = styler.getPropertyValue("--positionMinutesChoice");//minutes

    let chooseMinuteConv=calcValueNumberSelection(positionTopMinutes,0);
    let chooseSecondConv=calcValueNumberSelection(positionTopSeconds,1);
    
    switch(wichOneClicked){
        case 0: 
            workout[idWorkout-1].timer[0].workMinutes=chooseMinuteConv;
            workout[idWorkout-1].timer[0].workSeconds=chooseSecondConv;
            if(chooseSecondConv>9)
            workTimeAddWorkout!.textContent=workout[idWorkout-1].timer[0].workMinutes +" : "+workout[idWorkout-1].timer[0].workSeconds;
            else
             workTimeAddWorkout!.textContent=workout[idWorkout-1].timer[0].workMinutes +" : 0"+workout[idWorkout-1].timer[0].workSeconds;
            break;
        case 1:
            workout[idWorkout-1].timer[0].restMinutes=chooseMinuteConv;
            workout[idWorkout-1].timer[0].restSeconds=chooseSecondConv;
            if(chooseSecondConv>9)
            restTimeAddWorkout!.textContent=workout[idWorkout-1].timer[0].restMinutes +" : "+workout[idWorkout-1].timer[0].restSeconds;
            else
            restTimeAddWorkout!.textContent=workout[idWorkout-1].timer[0].restMinutes +" : 0"+workout[idWorkout-1].timer[0].restSeconds;
            break;
        case 2:
            // round has the same selector 
             if(chooseMinuteConv == 0)
                workout[idWorkout-1].round = 1;
            else
                workout[idWorkout-1].round =chooseMinuteConv;
            roundAddWorkout!.textContent=`${workout[idWorkout-1].round}`;
           
            let currentTimer: workRestTime = workout[idWorkout-1].timer[0];
            for(let j=0;j<workout[idWorkout-1].round;j++){
                workout[idWorkout-1].timer.pop();
                }
            for(let j=0;j<workout[idWorkout-1].round;j++){
                workout[idWorkout-1].timer.push({...currentTimer})  
            }
            break;
        case 3:
                
            let checkSubTimerTotalTime =  addingSubTimerIsValid(chooseSecondConv);
            if(checkSubTimerTotalTime){
                if (!workout[idWorkout-1].subTimer![indexSubTImer].value) {
                     workout[idWorkout-1].subTimer![indexSubTImer].value = [];
                }
                workout[idWorkout-1].subTimer![indexSubTImer].value.push({
                                                                            time:0,
                                                                            title:""
                                                                        });
                temporarySubTimerOptionTimeValue.push(chooseSecondConv);
                createAddingRowSubTimer(0,0);
            }
            else   
                alert("NOPE")
            break;
        default:
            break;
    }
}

function calcValueNumberSelection(stringToConvert: string, wichOneIs:number): number{

    let index = parseInt(stringToConvert,10);//get position of number selection converted in number
    index = index/100;
    index = Math.abs(index); // dividing for 100 i get the index of the number list

    let value;
    let conversion;

    if(wichOneIs==0)
     value = minutesTimer[index].textContent;//get the value of the list
    else if(wichOneIs==1)
     value=secondsTimer[index].textContent;//get the value of the list
    if(value)
     conversion= parseInt(value);//converting the value of the list in number
    if(conversion)
        return conversion;
    else
        return 0;
}

export function setValuesZeroAddWorkout(){
    workTimeAddWorkout!.textContent="0 : 00";
    restTimeAddWorkout!.textContent="0 : 00";
    roundAddWorkout!.textContent="1";
}

let tempTotalTime = queryCheck<HTMLElement>("#tempTotalTime");
 let changeColor = queryCheck<HTMLElement>("#addOptionButtonsOpen p:nth-of-type(1)") as HTMLElement;

//#region saveAndCloseAndResetButton
const closeAddWorkoutSection = queryCheck<HTMLElement>("#closeAddWorkout");
closeAddWorkoutSection.addEventListener("click",()=>{
    changeColor.style.color="white";
    closeWorkoutHandler(workout,idWorkout);
    if(!globalBoolVar.modifyIsActive)
            idWorkout--;
    addOptionButtonHandler();
});

const saveButton = queryCheck<HTMLElement>("#addNewTimerSave");
saveButton.addEventListener("click",()=>{
    saveWorkoutHandler(workout,idWorkout);
    addOptionButtonHandler();
});

const resetButton= queryCheck<HTMLElement>("#addNewWorkoutReset");
resetButton.addEventListener("click",()=>{
   
    resetValueWorkout(workout,idWorkout,temporaryEditTimerOptionTimeValue);

});
//#endregion saveAndCloseAndResetButton

//#endregion addWorkout

//#region addOptioAddWorkout

const addOptionButton = queryCheck<HTMLElement>("#addOption");

addOptionButton.addEventListener("click",()=>{
    setGlobalBool("checkingSave",true)
    addOptionButtonHandler();
});

const editTimerSection = queryCheck<HTMLElement>("#editTimerSection");
const editTimerButton = queryCheck<HTMLElement>("#addOptionButtonsOpen li:nth-of-type(1)");

editTimerButton.addEventListener("click", ()=>{
    editTimerSection.classList.remove("hidden");
    createTimersForEdit(editTimerSection!);
    setTemporaryVar();
    clickHandlerEditTimerForEdit();
    tempTotalTime.textContent="Edit timer";
    setGlobalBool("editTimerSection",true)
    setGlobalBool("addOptionOpenClose",false)
});

function setTemporaryVar(){
    temporaryEditTimerOptionTimeValue.workMinutes=workout[idWorkout-1].timer[0].workMinutes;
    temporaryEditTimerOptionTimeValue.workSeconds=workout[idWorkout-1].timer[0].workSeconds;
    temporaryEditTimerOptionTimeValue.restMinutes=workout[idWorkout-1].timer[0].restMinutes;
    temporaryEditTimerOptionTimeValue.restSeconds=workout[idWorkout-1].timer[0].restSeconds;
   
}

let rounds:NodeList;
export function createTimersForEdit(timerSection: Element){

    createRoundsForEditOrSub(workout,idWorkout,timerSection);

    if(timerSection.id=="editTimerSection")
        rounds = queryAllCheck<HTMLElement>("#editTimerSection .editTimerDivs");
    if(timerSection.id=="subTimerSection"){
        roundsSubTimer=queryAllCheck<HTMLElement>("#subTimerSection .editTimerDivs");
        clickSubTimerRound()
    }
    if(globalBoolVar.editTimerSection){
            clickHandlerEditTimerForEdit();//reOpen editTimer 
        }
}

function clickHandlerEditTimerForEdit(){
        openTimeSelection(2);
        for(let i=0;i<rounds.length;i++){
            rounds[i].addEventListener("click", ()=>{editTimer(i);titleAddWorkout!.textContent="work";

                root.style.setProperty("--positionMinutesChoice",`-${workout[idWorkout-1].timer[i].workMinutes*100}px`);
                sumMin=workout[idWorkout-1].timer[i].workMinutes*100;
                root.style.setProperty("--positionSecondsChoice",`-${workout[idWorkout-1].timer[i].workSeconds*100}px`);
                sumSec=workout[idWorkout-1].timer[i].workSeconds*100;
  
           });
        }
    
}

let currentClickHandler: (() => void) | null = null;

function editTimer(i: number) {
  openTimeSelection(3);
  listSeconds.classList.remove("transformTranslateNegative");
  setGlobalBool("editTimerBool",true)
  titleAddWorkout.textContent = "work";
   

  if (currentClickHandler) {
    doneButtonAddWorkout.removeEventListener("click", currentClickHandler);
  }

  currentClickHandler = () => {
    handleDoneClickEditTImer(i);
  };

  doneButtonAddWorkout.addEventListener("click", currentClickHandler);
}

function handleDoneClickEditTImer(i: number) {
  if (titleAddWorkout.textContent === "work") {
    setValueWorkout("work", i);
    titleAddWorkout.textContent = "rest";

    root.style.setProperty("--positionMinutesChoice",`-${workout[idWorkout-1].timer[i].restMinutes*100}px`);
    sumMin=workout[idWorkout-1].timer[i].restMinutes*100;
    root.style.setProperty("--positionSecondsChoice",`-${workout[idWorkout-1].timer[i].restSeconds*100}px`);
    sumSec=workout[idWorkout-1].timer[i].restSeconds*100;
  } else {
    setValueWorkout("rest", i);
    titleAddWorkout.textContent = "done";
  }

  if (titleAddWorkout.textContent === "done") {
    calcTotalTime(workout,idWorkout);
    timeSelection.classList.add("hidden");
  }
}

function setValueWorkout(wichOne: string, i: number) {
  const styler = getComputedStyle(root);
  let positionTopSeconds = styler.getPropertyValue("--positionSecondsChoice");
  let positionTopMinutes = styler.getPropertyValue("--positionMinutesChoice");

  let chooseMinuteConverted = calcValueNumberSelection(positionTopMinutes,0);
  let chooseSecondConverted = calcValueNumberSelection(positionTopSeconds,1);

  if (wichOne === "work") {
    workout[idWorkout-1].timer[i].workMinutes = chooseMinuteConverted;
    workout[idWorkout-1].timer[i].workSeconds = chooseSecondConverted;
   
  } else {
    workout[idWorkout-1].timer[i].restMinutes = chooseMinuteConverted;
    workout[idWorkout-1].timer[i].restSeconds = chooseSecondConverted;
  }
  createTimersForEdit(editTimerSection);
}

//subTIMER

const addSubTimerButton = queryCheck<HTMLElement>("#addOptionButtonsOpen li:nth-of-type(2)");
let subTimerSection = queryCheck<HTMLElement>("#subTimerSection");

let roundsSubTimer: NodeList;

addSubTimerButton.addEventListener("click",()=>{
    if(workout[idWorkout-1].timer[0].workSeconds>1 ||workout[idWorkout-1].timer[0].workMinutes>0){//have to at least 1 sec work

            addSubTimerHandler(workout,idWorkout);
            createTimersForEdit(subTimerSection!);
           
            setGlobalBool("editTimerSection",false);
            setGlobalBool("addOptionOpenClose",false);
            setGlobalBool("subTimerSection",true);
            wichOneClicked=3;
            tempTotalTime!.textContent="Sub Timer";
            subTimerSection!.classList.remove("hidden");

            temporarySubTimerOptionTimeValue=[];
        }
        else
           alert("ADD SOME WORKOUT")
});

let subTimerEditOption = queryCheck<HTMLElement>("#subTimerSectionOption");
let indexSubTImer= 0;
function clickSubTimerRound(){

    for(let i=0;i<roundsSubTimer.length;i++){

        roundsSubTimer[i].addEventListener("click",()=>{
            
            subTimerEditOption.classList.remove("hidden");
            indexSubTImer=i;
            openSubTimerOptions(workout,idWorkout,i);

            if(workout[idWorkout-1].subTimer![i].value){
                for(let j=0;j<workout[idWorkout-1].subTimer![i].value.length;j++){
                    createAddingRowSubTimer(1,j);
                }
            }
                root.style.setProperty("--posSectionSubMenu","0px")
            });
    }
}
const addSubTimerOptionButton = queryCheck<HTMLElement>("#addSubTimerButton");
const editTimerAddingrow = queryCheck<HTMLElement>("#editTimerAddingrow");
addSubTimerOptionButton!.addEventListener("click",()=>openNumberSelection());

function openNumberSelection()
{
    openTimeSelection(4);
    titleAddWorkout.textContent="Sub Timer";
    setGlobalBool("subTimerBool",true);
    wichOneClicked=3;
    console.log(indexSubTImer)
}
function createAddingRowSubTimer(newOrnot:number,ifIsNotNew: number){
    
    let div = createRowSubTimerOptions();
    let p = div.querySelector("p");
    let input = div.querySelector(".subTimerTitle") as HTMLInputElement;
    switch(newOrnot){
        case 0:
            //let valueLast = workout[idWorkout-1].subTimer![indexSubTImer].value.length -1;
            //p!.textContent = `${workout[idWorkout-1].subTimer![indexSubTImer].value[valueLast].time}`;
            p!.textContent = `${temporarySubTimerOptionTimeValue.slice(-1)[0]}`;
            input.value="Title";
            break;
        case 1:
            p!.textContent = `${workout[idWorkout-1].subTimer![indexSubTImer].value[ifIsNotNew].time}`;
            input.value=`${workout[idWorkout-1].subTimer![indexSubTImer].value[ifIsNotNew].title}`;
            break;  
        default:
            break;
    }

    editTimerAddingrow!.appendChild(div);
}
function addingSubTimerIsValid(valueToCheck: number): boolean{//check if subTimer is under total time
        let min = workout[idWorkout-1].totalTime.slice(0,2);
        let min2= parseInt(min);
        let sec = workout[idWorkout-1].totalTime.slice(4,6);
        let sec2 = parseInt(sec);
        let sum = ((min2*60)+sec2)-15;
        let sum2=0;
        if(workout[idWorkout-1].subTimer![0].value.length>1){
        for(let i=0;i<workout[idWorkout-1].subTimer![0].value.length;i++){
            sum2 += workout[idWorkout-1].subTimer![0].value[i].time;
        }}
        sum2= sum2+valueToCheck;
        if(sum>sum2)
            return true;
        return false;
    }


    let subTimerSaveButton = queryCheck<HTMLElement>("#saveSubTimerSectionOptionButton");

    subTimerSaveButton.addEventListener("click",()=>{ // sub timer adding rows section has different save and close buttons
        subTimerEditOption.classList.add("hidden");
        let inputValue = document.querySelectorAll(".subTimerTitle")as NodeListOf<HTMLInputElement>;
        if(inputValue){
        let values: string[] = [];
        inputValue.forEach(input => {
            values.push(input.value);
            });
        for(let i =0; i<workout[idWorkout-1].subTimer![indexSubTImer].value.length; i++){
            workout[idWorkout-1].subTimer![indexSubTImer].value[i].title=values[i];
            workout[idWorkout-1].subTimer![indexSubTImer].value[i].time=temporarySubTimerOptionTimeValue[i];
        }
        changeColorRoundName(0);
    }
        root.style.setProperty("--posSectionSubMenu","47px")
        
        setGlobalBool("subTimerBool",false);
    });

   

let closeSubTimeOptionButton = queryCheck<HTMLElement>("#closeSubTimerSectionOpotionButton");
    closeSubTimeOptionButton.addEventListener("click",()=>{
    subTimerEditOption.classList.add("hidden");
    root.style.setProperty("--posSectionSubMenu","47px")
    changeColorRoundName(1);
});

function changeColorRoundName(wichOnes: number){
    let rounds = queryAllCheck<HTMLElement>("#subTimerSection .editTimerDivs h2")
    let singleRound =rounds[indexSubTImer] as HTMLElement;
    if(wichOnes==0)
        singleRound.style.color= "#2dd881";
    else
        singleRound.style.color= "white";
            
}
//#endregion addOptioAddWorkout

//#region modifyWorkout
let lateralMenu = queryCheck<HTMLElement>("#lateralMenu");

lateralMenu.addEventListener("click",(event)=>{
    let target = event.target as HTMLElement;
    let dataIdString = target.getAttribute("data-id");

    let dataId = parseInt(dataIdString!);
    if(dataId){
       workout[idWorkout-1]=workoutS[dataId-1];
        setWorkoutForModify(workout,idWorkout)
        addWorkoutSection.classList.remove("hidden");
        setGlobalBool("modifyIsActive",true);
    }
})

let listWorkoutCurrent;

const containerListWorkout = queryCheck<HTMLDivElement>("#programsTimer");
let listWOrkout;
const observer = new MutationObserver(mutations => { // observing the list of workouts
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        listWOrkout=document.querySelectorAll("#programsTimer p");
        listWOrkout.forEach(element => {
            element.addEventListener("click",()=>{
                let selected = queryCheck<HTMLParagraphElement>("#programsTimer p.programSelected");
                selected.classList.remove("programSelected");
                element.classList.add("programSelected");
            })
        });
        const h3ListWorkout = queryCheck<HTMLHRElement>("#messageListWorkout")
        if(listWOrkout)
            h3ListWorkout.classList.add("hidden");
        else
            h3ListWorkout.classList.remove("hidden");

    listWorkoutCurrent = document.querySelectorAll("#programsTimer p");
    workoutChoosed = takeDataFromWorkout();

    listWorkoutCurrent.forEach((element)=>{
        element!.addEventListener("click",()=>{
            workoutChoosed = takeDataFromWorkout();
            root.style.setProperty("--backgroundTimer","#2dd881")
            });
        });
    }
  });
});
observer.observe(containerListWorkout, {
  childList: true
});

//#endregion modifyWorkout

//#region startTimer resetTimer
let workoutChoosed:addWorkout;
let startPlus=0;
let startPlusIsActive=false; //checking if the timer need to start form 0 or not

const startButton = queryCheck<HTMLLIElement>("#startButton");
const startButtonParagr=queryCheck<HTMLParagraphElement>("#startButton p");
startButton.addEventListener("click",()=>{
    if(startButtonParagr.textContent=="Start"){
        startButtonParagr.textContent="Pause";
        if(!startPlusIsActive)
            startPlus=0;
        startWorkout(workoutChoosed!,startPlus);
    }   
    else if(startButtonParagr.textContent=="Pause"){
         pauseWorkout();
         startButtonParagr.textContent="Start";
         root.style.setProperty("--backgroundTimer","#D4AF37");
    }
         
    startPlusIsActive=false;
});

const resetTimerButton = queryCheck<HTMLLIElement>("#otherButtons li:nth-of-type(2)");

resetTimerButton.addEventListener("click",()=>{
    workoutChoosed=takeDataFromWorkout();
  root.style.setProperty("--backgroundTimer","#2dd881")
  startPlusIsActive=false;
});

const startPlusButton = queryCheck<HTMLLIElement>("#otherButtons li:nth-of-type(1)");
let sectionStartPlux =  queryCheck<HTMLElement>("#startPlusSection");

startPlusButton.addEventListener("click",()=>{
    
    sectionStartPlux.classList.remove("hidden");
    createDivsForStartPlus();
});

function createDivsForStartPlus(){
 let divs = sectionStartPlux.querySelectorAll(".roundsStartPlus");
 const container = queryCheck<HTMLElement>("#startPlusSection div");
    if(divs){//remove olds div
        for(let i =0;i <divs.length;i++){
             sectionStartPlux.removeChild(divs[i]);
    }
    }

    for(let i=0;i<workoutChoosed.round;i++){
         let p = document.createElement("p");
        p.classList.add("roundsStartPlus");
        p.setAttribute("data-id",`${i}`)
        p.textContent=`Round ${i+1}`;
        container.appendChild(p);
    }
    clickHandlerStartPlus();
}
function clickHandlerStartPlus(){
    let rounds = sectionStartPlux.querySelectorAll(".roundsStartPlus");
    startPlusIsActive=true;
    rounds.forEach((element)=>{
        element.addEventListener("click",()=>{
            sectionStartPlux.classList.add("hidden");
            let dataId = element.getAttribute("data-id")
            startPlus= parseInt(dataId!);
            let currentRound = queryCheck<HTMLParagraphElement>(".currentRound");
            currentRound.textContent=`${startPlus+1}`;
        });
    });
}
//#region startTimer