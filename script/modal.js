const createModal = () => {
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modal-container");

    const modalBox = document.createElement("div");
    modalBox.classList.add("modal-box");
    modalDiv.appendChild(modalBox);

    document.body.insertAdjacentElement("afterbegin",modalDiv);
    const childs = [];

    const show  = () => {
        childs.map(child => modalBox.appendChild(child));
        modalDiv.classList.add("active");
        showCloseButton();
    };

    const hide = () => { modalDiv.classList.contains("active") ? modalDiv.classList.remove('active') : null };

    const createElement = (elementClass,chidlContent) => {
        const contentEl = document.createElement("div");
        contentEl.classList.add(elementClass);
        contentEl.insertAdjacentHTML("afterbegin",chidlContent);
        return contentEl;
    }

    const appendHeader = (html) => { 
        const header = createElement("modal-header",html);
        childs[0] = header;
    }
    const appendContent = (html) => { 
        const content = createElement("modal-content",html);
        childs[1] = content;
    }
    const appendFooter = (html) => { 
        const footer = createElement("modal-footer",html);
        childs[2] = footer;
    }

    const showCloseButton = () => {
        const btnClose = document.createElement("button");
        btnClose.innerHTML = `<i class="fa-solid fa-xmark"></i>`
        btnClose.classList.add("btn-close-modal");
        btnClose.addEventListener("click",() => hide());
        modalBox.insertAdjacentElement("afterbegin",btnClose);
    }
        return {
            show,
            hide,
            appendHeader,
            appendContent,
            appendFooter,
    }
}