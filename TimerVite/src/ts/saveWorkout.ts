export function addWorkoutInList(idWorkout: number, addOrNo: boolean){
    if(!addOrNo){
    let containerWorkouts = document.querySelector("#programsTimer");
    let p = document.createElement("p");
    let i = document.createElement("i");
    i.classList.add("icon-modify");
    p.textContent="workout";
    i.setAttribute("data-id",`${idWorkout}`)
    p.setAttribute("data-workout",`workout`)
    p.appendChild(i)
    containerWorkouts?.appendChild(p);
    let fisrtWorkout = document.querySelector("#programsTimer p:first-child");
    fisrtWorkout!.classList.add("programSelected")
}
}