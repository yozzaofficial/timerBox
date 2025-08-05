import { addWorkout } from "./types"
interface globalBoolHandler{
    editTimerBool:boolean, //for time selection in editTImer
    editTimerSection:boolean,//for editTimer section
    subTimerBool:boolean,
    subTimerSection:boolean,//for subTimer section
    addOptionOpenClose: boolean,
    checkingSave:boolean,//save button checking
    modifyIsActive:boolean,
    startTimerSubTimerCheck:boolean,//checkick if subTimer exist when the timer starts
}

export let globalBoolVar:globalBoolHandler={//handling the right section to close/open
    editTimerBool:false,
    editTimerSection:false,
    subTimerBool:false,
    subTimerSection:false,
    addOptionOpenClose:false,
    checkingSave:false,
    modifyIsActive:false,
    startTimerSubTimerCheck:false,
}

export function setGlobalBool(key: keyof globalBoolHandler,value: boolean){
    globalBoolVar[key] = value;
}

export let workoutS:addWorkout[]=[];

export function pushWorkoutS(workout:addWorkout[],idWorkout:number){
    workoutS.push(structuredClone(workout[idWorkout - 1]));
}