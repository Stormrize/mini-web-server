function copyToClipboard(icon) {
    const field = icon.parentElement.querySelector(".card-body div h5");
    const toastCoppy = document.getElementById('copyToast');
    const copyToast = new bootstrap.Toast(toastCoppy);
    copyToast.show();
    if (!field) return;

    let value;

    if (field.tagName === "SELECT") {
        value = field.options[field.selectedIndex].text;
    } else {
        value = field.value || field.textContent;
    }

    navigator.clipboard.writeText(value).then(() => {

        icon.classList.remove("bi-clipboard");
        icon.classList.add("bi-clipboard-check");

        setTimeout(() => {
            icon.classList.remove("bi-clipboard-check");
            icon.classList.add("bi-clipboard");
        }, 2000);
    });
}
