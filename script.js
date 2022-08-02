const contactList = document.querySelector(".contact_list");
const invitesCount = document.querySelector(".invites_count");

let contacts = [];

document.addEventListener("DOMContentLoaded", function() {
    fetchContacts(8);
});

function fetchContacts(count) {
    fetch(`https://dummy-apis.netlify.app/api/contact-suggestions?count=${count}`)
        .then((response) => response.json())
        .then((contactsData) => {
            if (count === 1) {
                contacts = []
                contacts.push(contactsData[0])
            } else {
                contacts.push(...contactsData);
            }
            render()
        });
}

function render() {
    contacts.map(contact => (
        `
  <div class="contact">
    <button class="close_contact">X</button>
    <div class="background_img" style="background-image: url(${contact.backgroundImage})">
    <img class="contact_img" src="${contact.picture}">
    <div class="personal_info">
    <h2>${contact.name.title} ${contact.name.first} ${contact.name.last}</h2>
    <p>${contact.title}</p>
    <p>${contact.mutualConnections} mutual connection/s</p>
    <button class=connect_contact>Connect</button>
    </div>
  </div>
`
    )).forEach( element => contactList.innerHTML += element)

    setListeners()
}

function setListeners() {
    document.querySelectorAll('.close_contact').forEach(btn => {
        btn.addEventListener("click", function(e){
            closeContact(e);
        });
    });

    document.querySelectorAll('.connect_contact').forEach(btn => {
        btn.addEventListener("click", function(){
            btn.innerText = btn.innerText === "Connect" ? "Pending" : "Connect" //ternary operator 
            setInvitesCount(btn.innerText)
        });
    });
}

function closeContact(e) {
    e.target.parentElement.remove()
    fetchContacts(1);
}

function setInvitesCount(text) {
    with(localStorage) {  //dont need to write  locastorage.getItem
        let current = JSON.parse(getItem("invites"));

        JSON.stringify(setItem("invites",current === null ? 1 : text === "Connect" ? current-1 : current+1));

        current = JSON.parse(getItem("invites"));
        current === 0 ? invitesCount.innerText = "No pending invitations" : invitesCount.innerText =`${current} pending invitation/s`
    }
}