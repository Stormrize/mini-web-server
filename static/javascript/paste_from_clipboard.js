async function paste_from_clipboard(icon) {
    const field = icon.parentElement.querySelector("input, textarea, select");
    if (!field) return;

    try {
        const text = await navigator.clipboard.readText();
        field.value = text;

        icon.classList.remove("bi-clipboard");
        icon.classList.add("bi-clipboard-check");

        setTimeout(() => {
            icon.classList.remove("bi-clipboard-check");
            icon.classList.add("bi-clipboard");
        }, 2000);

    } catch (err) {
        console.error("error", err);
    }
}