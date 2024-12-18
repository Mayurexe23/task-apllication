// console.log("hello world")

// const state = {
//     taskList: [
//         {
//             url: "",
//             title: "",
//             type: "",
//             description: ""
//         },
//         {
//             url: "",
//             title: "",
//             type: "",
//             description: ""
//         },
//         {
//             url: "",
//             title: "",
//             type: "",
//             description: ""
//         }
//     ]
// }

const state = {
    taskList: []
}


const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal_body");
// console.log(taskModal)


const htmlTaskContent = ({id, url, title, description, type}) => `
    <div class="col-md-6 col-lg-4 mt-3" id="${id}" key="${id}">
      <div class="card">
        <div class="card-header d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-primary" name="${id}" onclick="editTask.apply(this,arguments)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button type="button" class="btn btn-outline-danger" name="${id}" onclick="deleteTask.apply(this,arguments)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div class="card-body">
          ${ url ? `<img
            src="${url}"
            alt="card-img-top"
            class="card-img-top"
          />`
        : `<img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScujirQqIFjN5GuM1565_-DIX6OyU_96HzNBl_BAX8GL0JzMs8&s"
            alt="card-img-top"
            class="card-img-top"
          />`
        }
          <h4 class="card-title">${title}</h4>
          <p class="card-text">${description}</p>
          <div class="tags d-flex flex-wrap">
            <span class="badge bg-primary m-1">${type}</span>
          </div>
        </div>
        <div class="card-footer">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#showTask"
            onclick= "openTask.apply(this, arguments)"
            id=${id}
            >
            Open Task
          </button>
        </div>
      </div>
    </div>
`


const htmlModalContent = ({id, url, title, description}) => {
    const date = new Date();
    return `
        <div id=${id}>
            ${ url ? `<img
            src="${url}"
            alt="card-img-top"
            class="img-fluid"
          />`
            : 
            `<img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScujirQqIFjN5GuM1565_-DIX6OyU_96HzNBl_BAX8GL0JzMs8&s"
            alt="card-img-top"
            class="img-fluid"
          />`
        }
          <strong>Created on ${date.toDateString()}</strong>
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
    `
}


const updateLocalStorage = () => {
    localStorage.setItem('task', JSON.stringify({
        tasks: state.taskList
    }))
}

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);

    if(localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardData)=> {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
    })
}


const handleSbmitBtn = (event) => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById('imageUrl').value,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        type: document.getElementById('tags').value,
    }

    if(input.title == "" || input.description == "" || input.type ==""){
        return alert("Pls fill out all the neceesary fields")
    }

    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent({...input, id})
)

state.taskList.push({...input, id})
updateLocalStorage()

}



const openTask = (e) => {
    if(!e) e = window.event;

    const getTask = state.taskList.find(({id})=> id === e.target.id)
    taskModal.innerHTML = htmlModalContent(getTask)
}

const deleteTask = (e) => {
    if(!e) e = window.event;
    const targetId = e.target.getAttribute("name");
    const type = e.target.tagName;
    // console.log(type)

    const removeTask = state.taskList.filter(({id})=> id!== targetId)
    state.taskList = removeTask

    updateLocalStorage();
    if(type == "BUTTON"){
        console.log(e.target.parentNode.parentNode.parentNode)
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        )
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode.parentNode
    )
}   


const editTask = (e) => {
    if(!e) e = window.event;

    const target = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if(type=="BUTTON"){
        parentNode = e.target.parentNode.parentNode
    }else {
        parentNode = e.target.parentNode.parentNode.parentNode
    }

        taskTitle = parentNode.childNodes[3].childNodes[3];
        // taskTitle = parentNode.childNodes[3].childNodes;
        taskDescription = parentNode.childNodes[3].childNodes[5];
        taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
        // taskDescription = parentNode.childNodes[3].childNodes[5];
        submitButton = parentNode.childNodes[5].childNodes[1]
        // console.log(submitButton)

        taskTitle.setAttribute("contenteditable", "true");
        taskDescription.setAttribute("contenteditable", "true");
        taskType.setAttribute("contenteditable", "true");

        submitButton.setAttribute('onclick', "saveEdit.apply(this, arguments)");
        submitButton.removeAttribute("data-bs-toggle");
        submitButton.removeAttribute("data-bs-target");
        submitButton.innerHTML = "Save Changes"
}    



const saveEdit = (e) => {
    if(!e) e = window.event;

    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode)

        const taskTitle = parentNode.childNodes[3].childNodes[3];
       // taskTitle = parentNode.childNodes[3].childNodes;
        const taskDescription = parentNode.childNodes[3].childNodes[5];
        const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
        // const taskDescription = parentNode.childNodes[3].childNodes[5];
        const submitButton = parentNode.childNodes[5].childNodes[1]
        // console.log(submitButton)


        const updateData = {
            taskTitle: taskTitle.innerHTML,
            taskDescription: taskDescription.innerHTML,
            taskType: taskType.innerHTML
        }

        let stateCopy = state.taskList;

        stateCopy = stateCopy.map((task)=>task.id==targetId? {url: task.url, 
            id: task.id, 
            title: updateData.taskTitle, 
            description: updateData.taskDescription, 
            type: updateData.taskDescription} : task)

            state.taskList = stateCopy;
            updateLocalStorage()

        taskTitle.setAttribute("contenteditable", "false");
        taskDescription.setAttribute("contenteditable", "false");
        taskType.setAttribute("contenteditable", "false");

        submitButton.setAttribute('onclick', "openTask.apply(this, arguments)");
        submitButton.setAttribute("data-bs-toggle", "modal");
        submitButton.setAttribute("data-bs-target", "#showTask");
        submitButton.innerHTML = "Open Task"
}    


const searchTask = (e) => {
    if(!e) e = window.event;
    while(taskContents.firstChild){
        taskContents.removeChild(taskContents.firstChild)
    }

    const resultData = state.taskList.filter(({title})=> title.toLowerCase().includes(e.target.value))

    resultData.map((cardData) => {taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))})
}    