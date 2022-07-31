function createToast(msg,color ="secondary") {
    const toastHTML = `
    <div class="toast ${color}">
        <h2 class="toast-msg">${msg}</h2>
        <div class="btn-close">
            <i class="fa-solid fa-xmark"></i>
        </div>
    </div>
    `
    removeToast();
    document.body.insertAdjacentHTML("afterbegin",toastHTML); 
    showToast();
}

function showToast() {
    const toastElement = document.querySelector(".toast");
    toastElement.classList.add("active");

    const toastBtn = document.querySelector(".toast .btn-close");
    toastBtn.addEventListener("click",() => toastElement.classList.remove("active"));

    setTimeout(() => { toastElement.classList.remove("active")},2000);
}

function removeToast() {
    const toastElement = document.querySelector(".toast");
    if(toastElement) toastElement.remove();
}





