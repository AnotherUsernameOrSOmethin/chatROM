//Her skriver vi kode som kjører på klienten
let lastUpdate;

let linkSelects = document.getElementsByClassName('linkSel')
for (const linkSel of linkSelects) {
    linkSel.onchange = () => {
        window.open(linkSel.value, "_self")
    }
}

window.onload.hopperClock() 
function hopperClock() {
    setInterval(msgUpdatin(), 1000)
}
function msgUpdatin() {
    let msges = document.getElementsByClassName("content")
    
}