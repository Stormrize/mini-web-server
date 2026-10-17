const inputSelect = [
    document.getElementById("klasse"),
    document.getElementById("Betreff"),
    document.getElementById("Vorname"),
    document.getElementById("Nachname"),
    document.getElementById("Date"),
    document.getElementById("email"),
    document.getElementById("tel"),
    document.getElementById("message")
];

const submitButton = document.getElementById("submit");

submitButton.addEventListener("click", (event) => {
    const date = document.getElementById("Date");
    const yearSelect = new Date(date.value).getFullYear();
    const monthSelect = new Date(date.value).getMonth() + 1;
    const daySelect = new Date(date.value).getDate();
    
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

    event.preventDefault();

    if (year - yearSelect < 14) {
        inputSelect[4].style.borderColor = "red";
        document.getElementById("ageError").style.display = "block";
    } else if (year - yearSelect === 14 && month - monthSelect < 0) {
        inputSelect[4].style.borderColor = "red";
        document.getElementById("ageError").style.display = "block";
    } else if (year - yearSelect === 14 && month - monthSelect === 0 && day - daySelect < 0) {
        inputSelect[4].style.borderColor = "red";
        document.getElementById("ageError").style.display = "block";
    } else {
        let hasEmpty = false;

        for (let i = 0; i < inputSelect.length; i++) {
            if (inputSelect[i].value === "") {
                inputSelect[i].style.borderColor = "red";
                hasEmpty = true;
            } else {
                inputSelect[i].style.borderColor = "";
            }
        }

        if (hasEmpty) return;

        document.getElementById("ageError").style.display = "none";
        const info = document.getElementById("info-container");
        info.style.display = "block";
        document.getElementById("form").style.display = "none";
        const p = document.querySelectorAll("#info p");
        for (let i = 0; i < p.length; i++) {
            p[i].textContent = p[i].textContent + " " + inputSelect[i].value;
        }
    }
})