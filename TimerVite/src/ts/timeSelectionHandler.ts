export function timeSelectionPositionHandler(section: Element,minOrSecHandler: number): number{
     
    let currentNumber: number = 0;
    let currentNumberToConvert = section.textContent;
    if(minOrSecHandler==0){
        currentNumberToConvert = currentNumberToConvert!.slice(0,2);
        currentNumber = parseInt(currentNumberToConvert);
    }
    else if(minOrSecHandler==1)
    {
        currentNumberToConvert = currentNumberToConvert!.slice(4,6);
        currentNumber = parseInt(currentNumberToConvert);
    }

    currentNumber*=100;

    return currentNumber;
}

 
export function slider(minuteOrSecond:number,sum:number): { position: number, newSum: number }{
    const step = 100;//height of lists element
    const min = 0;
    const max = 900 // 5900 for second
    let approximated=0;

    if(minuteOrSecond==0) 
         sum = Math.max(min, Math.min(max, sum));  
    if(minuteOrSecond==1)
        sum = Math.max(min, Math.min(max+5000, sum));

    approximated = Math.round(sum / step) * step;

    return {position:approximated,newSum:sum};

}