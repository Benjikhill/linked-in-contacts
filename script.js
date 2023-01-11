let personState = [];
const pendingCounter = document.querySelector("#pending-counter");
let counter = 0;

// Daten aus dem LocalStorage holen
counter = JSON.parse(localStorage.getItem("pendingCounter"));
//Daten aus LocalStorage anzeigen im HTML
pendingCounter.innerText = counter;

// fetch api url
async function loadContacts(num) {
  try {
    const response = await fetch(
      `https://dummy-apis.netlify.app/api/contact-suggestions?count=${num}`
    );
    const jsonData = await response.json();
    personState = jsonData;
  } catch (error) {}
}

// json Daten rendern + HTML nodes erstellen

function createContactHtmlNode(userData) {
  const listElement = document.createElement("li");

  const svgIcon = document.createElement("img");
  svgIcon.src = "icons8-macos-close-30.png";
  svgIcon.classList.add("remove-icon");

  svgIcon.addEventListener("click", function () {
    // remove contact with click on svg
    this.closest("li").remove();
    init(1);
  });

  const backgroundElement = document.createElement("img");
  backgroundElement.src = userData.backgroundImage;
  backgroundElement.classList.add("background-image");

  const userImgElement = document.createElement("img");
  userImgElement.src = userData.picture;
  userImgElement.classList.add("profile-picture");

  const fullnameElement = document.createElement("h2");
  fullnameElement.innerText = userData.name.first + " " + userData.name.last;

  const jobTitleElement = document.createElement("p");
  jobTitleElement.innerText = userData.title;

  const mutualConnectionsElement = document.createElement("p");
  mutualConnectionsElement.innerText =
    userData.mutualConnections + " " + "mutual connections";

  const connectBtnElement = document.createElement("button");
  connectBtnElement.innerText = "Connect";

  // auf Connect Button drücken und Text soll sich auf Pending ändern und zurück
  connectBtnElement.addEventListener("click", function () {
    if (connectBtnElement.innerText === "Connect") {
      connectBtnElement.innerText = "Pending";
      //wenn connect gedrückt wird soll pending 1 hoch zählen
      counter++;
    } else {
      connectBtnElement.innerText = "Connect";
      //wenn pending zurückgenommen wird soll Zähler zurückzählen
      counter--;
    }
    //mit click wird Anzahl der pending invitations geändert
    pendingCounter.innerText = counter;
    save();
  });

  listElement.append(
    svgIcon,
    backgroundElement,
    userImgElement,
    fullnameElement,
    jobTitleElement,
    mutualConnectionsElement,
    connectBtnElement
  );

  return listElement;
}

function render() {
  for (userData of personState) {
    const li = createContactHtmlNode(userData);
    document.querySelector(".contact-list").appendChild(li);
  }
}

// im LocalStorage speichern
function save() {
  localStorage.setItem("pendingCounter", JSON.stringify(counter));
}

async function init(num) {
  await loadContacts(num);
  render();
}

init(8);

// Szenario - Nachladen einer Person wenn bestehende gelöscht wurde
// onclick event auf remove button contact wird gelöscht und neuer Kontakt aus API rückt nach am Ende
//remove button muss eingefügt werden (svg)
