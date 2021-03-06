let answer = prompt("Qual o seu lindo nome?");
let personName = {
    name: answer
}
let arrayMsg = [];
let input = "";

function statusOnOff() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", personName);
    promise.catch(failed);
}

const inicialPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", personName);
inicialPromise.catch(error);

function error(nameError) {
    console.log(nameError.response.status)
    if (nameError.response.status === 400){
        answer = prompt("Nome indisponível, pense em outro");
        personName = {
            name: answer
        }
    }
    const inicialPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", personName);
    inicialPromise.catch(error);
}

function failed(nameError) {
    console.log(nameError.response.status);
}
setInterval(statusOnOff, 5000);

const message = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
message.then(takeMessages);

function takeMessages(object) {
    const insert = document.querySelector("section main");
    insert.innerHTML = "";
    arrayMsg = object.data;
    arrayMsg.forEach(showMessages);
}

function showMessages(msg){
    const insert = document.querySelector("section main");
    
    if(msg.type === "status") {
        insert.innerHTML = insert.innerHTML + `
        <p data-identifier="message" class="status"><time>(${msg.time})</time> <b>${msg.from}</b>: ${msg.text}</p>
        `
    } else if ((msg.type === "private_message") && ((msg.from === answer) || (msg.to === answer))){
        insert.innerHTML = insert.innerHTML + `
        <p data-identifier="message" class="private"><time>(${msg.time})</time> <b>${msg.from}</b> reservadamente para <b>${msg.to}</b>: ${msg.text}</p>
        `
    } else if (msg.type === "message") {
        insert.innerHTML = insert.innerHTML + `
        <p data-identifier="message" class="normal"><time>(${msg.time})</time> <b>${msg.from}</b> para <b>${msg.to}</b>: ${msg.text}</p>
        `
    }

    let lastMessages = document.querySelector("section main p:last-child");
    lastMessages.scrollIntoView();
}

function reloadMessages(){
    const reload = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    reload.then(takeMessages);
}

setInterval(reloadMessages,3000);
setInterval(reloadPeople,10000);

function showSidebar() {
    const sidebar = document.querySelector("aside");
    sidebar.classList.remove("hidden");
    const section = document.querySelector(".background");
    section.classList.add("dark");
}

function hideSidebar() {
    const sidebar = document.querySelector("aside");
    sidebar.classList.add("hidden");
    const section = document.querySelector(".background");
    section.classList.remove("dark");
}

const people = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
people.then(takeParticipants);

function takeParticipants(participants){
    const insert = document.querySelector("aside menu");
    insert.innerHTML = "";
    arrayPeople = participants.data;
    arrayPeople.forEach(showParticipants)
}

function showParticipants(participants){
    const insert = document.querySelector("aside menu");
    insert.innerHTML = insert.innerHTML + `
        <div>
            <ion-icon name="person-circle-sharp"></ion-icon>
            <p data-identifier="participant">${participants.name}</p>
            <ion-icon class="checkmark hidden" name="checkmark-sharp"></ion-icon>
        </div>
    `
}

function reloadPeople(){
    const reload = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    reload.then(takeParticipants);
}

function sendMessage(){
    input = document.querySelector("footer input").value;
    let inputMsg = {
        from: answer,
        to: "Todos",
        text: input,
        type: "message"
    }

    const send = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", inputMsg);
    send.then(reloadMessages);
    send.catch(reloadPage);
    eraseInputValue();
}

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        let button = document.querySelector("footer button");
        button.click();
    }
  });

function eraseInputValue(){
    document.querySelector("footer input").value = "";
}

function reloadPage(error){
    window.location.reload(true);
}