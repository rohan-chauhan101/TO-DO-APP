let container = document.querySelector(".container")
let taskButton = document.querySelector("#add-task");
let input = document.querySelector("#task-text");
let box = document.querySelector(".small-box");
let inputBox = document.querySelector('input[type="text"]')
let filter = document.querySelector("#filter");
const inputContainer = document.querySelector(".inputContainer")

const message = () => {
    input.placholder = "please enter something first";
}

let addtask = (val) => {

    let text  = val.trim();
    if(!text){
        alert("you haven't entred anything");
        return;
    } 
       


    //functionality to prevent user from entering duplicate task
    let divList = document.querySelectorAll(".task-box");
    
    for(let div of divList){
        if(text === div.textContent){
                alert("Task already exist");
                return;
            }
    }
    

    let label = document.createElement("label");
    // let checkbox = document.createElement("checkbox");
    let div = document.createElement("div");
    div.textContent = text;
    
    
    label.innerHTML = ` <i class="fa-solid fa-pen-to-square edit-icon" style="color: #ffffff;"></i> <div class="task-box">${div.textContent}</div> <input type="checkbox"> <span>&#10060;</span>`;
    
    label.classList.add("task");
    inputContainer.before(label);

}


taskButton.addEventListener("click",()=>{
             
        addtask(input.value);
        input.value = "";
});

input.addEventListener("keydown",(e) => {
    if(e.key === "Enter"){
        addtask(input.value);
        input.value = "";
    }
})


//event and callBack fn to strike line on the task content (div in this case)



container.addEventListener("change",(e)=>{
    if(e.target.type === "checkbox"){
        e.target.previousElementSibling.classList.toggle("completed",e.target.checked);
    }
})


//event to edit the task 

//ise karte hue ek problem aayi - maine e.target.nextSibling use kiya to rompt se mila text innerhtml me display hua na ki dev ke andar
// cause - kyuki e ek event hai na ki ek dom element 
//solution - e.target.nextElementSibling use kiya 
container.addEventListener("click",(e)=> {
    
    if((e.target.tagName === "I")){
         if (e.target.classList.contains("edit-icon")) {
        e.preventDefault();
        e.stopPropagation();
        
        let editedvalue = prompt("re-write or edit your task");

        if (editedvalue != null && editedvalue.trim() != "") {
            e.target.nextElementSibling.textContent = editedvalue;
        }
    }
    }

})

//event and callBack function to delete task from list
container.addEventListener("click",(e)=>{
    if(e.target.tagName === "SPAN"){
        console.log("span clicked");
        // e.target.parentElement.style.display = "none";
         e.target.parentElement.remove();
    }
})


// filter fun - the most fun part to do. classList ke add(), remove() properties ko use karke ek filter banaya
filter.addEventListener('change', ()=>{
    
    // label list ek node list hai jise event occur hone par update kara rahe hain
    let labelList = container.querySelectorAll("label");

    labelList.forEach(label => {
        // har ek label ke andar ke div ka access
        let div = label.querySelector(".task-box");
        
        if(filter.value === "completed"){

            if(!div.classList.contains("completed")){
                label.classList.add("hide-node")
            }
            else{
                label.classList.remove("hide-node")
            }
        }
        else if(filter.value === "pending"){
           if(div.classList.contains("completed")){
            label.classList.add("hide-node")
           }
           else{
            label.classList.remove("hide-node")
           }
        }
        else{
            label.classList.remove("hide-node");
        }
    })
 
})


//functionality to add a task using voice.-  with the help of SpeechRecognition
const mic = document.querySelector(".mic");

const SpeechRecognition = window.SpeechRecognition ||  window.webkitSpeechRecognition;

if(!SpeechRecognition){
    alert("this browser does not supprt speechRecognition")
    mic.style.display = "none";
}
else{
    const r = new SpeechRecognition();
    r.lang = "en-US";
    r.interimResults = false;
    r.continuous = false;  // one phrase
    r.maxAlternatives = 1;

let clicked = false;

mic.addEventListener("click",()=>{
 r.start();
})

r.onresult = (event) =>{
    const transcipt = event.results[0][0].transcript;
    console.log(transcipt);
    // inputBox.value = transcipt;
    addtask(transcipt);
}
}
