let container = document.querySelector(".container");
let taskButton = document.querySelector("#add-task");
let input = document.querySelector("#task-text");
let box = document.querySelector(".small-box");
let inputBox = document.querySelector('input[type="text"]');
let filter = document.querySelector("#filter");
const inputContainer = document.querySelector(".inputContainer");
const mic = document.querySelector(".mic");
const listBox = document.querySelector(".listBox");

// ---------------- LocalStorage Helper Functions ---------------- //
function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------------- Add Task ---------------- //
let addtask = (val, save = true) => {
    let text = val.trim();
    if (!text) {
        alert("you haven't entered anything");
        return;
    }

    // prevent duplicate tasks
    let divList = document.querySelectorAll(".task-box");
    for (let div of divList) {
        if (text === div.textContent) {
            alert("Task already exists");
            return;
        }
    }

    // create label for task
    let label = document.createElement("div");
    label.innerHTML = `
        <i class="fa-solid fa-pen-to-square edit-icon" style="color: #ffffff;"></i>
        <div class="task-box">${text}</div>
        <input type="checkbox" class="checkboxes">
        <span>&#10060;</span>
    `;
    label.classList.add("task");
    listBox.append(label);

    // save to localStorage
    if (save) {
        let tasks = getTasks();
        tasks.push({ text, completed: false });
        saveTasks(tasks);
    }
};

// ---------------- Load tasks from LocalStorage ---------------- //
document.addEventListener("DOMContentLoaded", () => {
    let tasks = getTasks();
    tasks.forEach(task => {
        addtask(task.text, false); // don’t save again
        if (task.completed) {
            let allTasks = document.querySelectorAll(".task-box");
            let lastTask = allTasks[allTasks.length - 1];
            lastTask.classList.add("completed");
            lastTask.nextElementSibling.checked = true;
        }
    });
});

// ---------------- Add task by button or Enter ---------------- //
taskButton.addEventListener("click", () => {
    addtask(input.value);
    input.value = "";
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addtask(input.value);
        input.value = "";
    }
});

// ---------------- Checkbox Complete Toggle ---------------- //
listBox.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
        let taskDiv = e.target.previousElementSibling;
        taskDiv.classList.toggle("completed", e.target.checked);

        let tasks = getTasks();
        let updated = tasks.map(t =>
            t.text === taskDiv.textContent ? { ...t, completed: e.target.checked } : t
        );
        saveTasks(updated);
    }
});

// ---------------- Edit Task ---------------- //
listBox.addEventListener("click", (e) => {
    if (e.target.tagName === "I" && e.target.classList.contains("edit-icon")) {
        let oldText = e.target.nextElementSibling.textContent;
        let editedvalue = prompt("re-write or edit your task", oldText);

        if (editedvalue && editedvalue.trim() !== "") {
            e.target.nextElementSibling.textContent = editedvalue;

            let tasks = getTasks();
            let updated = tasks.map(t =>
                t.text === oldText ? { ...t, text: editedvalue } : t
            );
            saveTasks(updated);
        }
    }
});

// ---------------- Delete Task ---------------- //
listBox.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN") {
        let taskText = e.target.parentElement.querySelector(".task-box").textContent;
        e.target.parentElement.remove();

        let tasks = getTasks();
        let updated = tasks.filter(t => t.text !== taskText);
        saveTasks(updated);
    }
});

// ---------------- Filter Functionality ---------------- //
filter.addEventListener("change", () => {
    let labelList = listBox.querySelectorAll(".task");

    labelList.forEach(label => {
        let div = label.querySelector(".task-box");

        if (filter.value === "completed") {
            if (!div.classList.contains("completed")) {
                label.classList.add("hide-node");
            } else {
                label.classList.remove("hide-node");
            }
        } else if (filter.value === "pending") {
            if (div.classList.contains("completed")) {
                label.classList.add("hide-node");
            } else {
                label.classList.remove("hide-node");
            }
        } else {
            label.classList.remove("hide-node");
        }
    });
});

// ---------------- Voice Input with SpeechRecognition ---------------- //
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("this browser does not support SpeechRecognition");
    mic.style.display = "none";
} else {
    const r = new SpeechRecognition();
    r.lang = "en-US";
    r.interimResults = false;
    r.continuous = false;
    r.maxAlternatives = 1;

    let count = false;
    mic.addEventListener("click", () => {
   
        switch(count){
            case false : r.start()
            count = true;
              r.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                addtask(transcript); // auto saves to localStorage
              };
            break;

            case true : r.stop();
            count = false;
            break;
        }
    });
}
