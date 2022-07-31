const addForm = document.getElementById("add-book-form");
const searchInput = document.getElementById("search-input");
const btnSearch = document.querySelector(".btn-search");
let books = [];
let historys = [];
const DONE_ACTION = "done-action";
const READD_ACTION = "readd-action";
const DELETE_ACTION = "delete-action";
const EDIT_ACTION = "edit-action"
const ADD_ACTION = "add-action";
const ERROR_MSG = "error-msg";
const RENDER_EVENT = "render-event";

document.addEventListener(RENDER_EVENT,() => {
    const uncompleteBooks = books.filter( book => book.isComplete == false );
    const completeBooks = books.filter( book => book.isComplete == true );
    createCompleteList(completeBooks);
    createUncompleteList(uncompleteBooks);
    renderHistory(historys);
    if(searchInput.value.length) findBook(searchInput.value);
    buttonsSetListener();
});

document.addEventListener("DOMContentLoaded",() => {
    const {storageBook,storageHistory} = loadDataFromStorage();
    if(storageBook) {
        books = storageBook;
    };

    if(storageHistory) {
        historys = storageHistory;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    return;
});

document.addEventListener(DONE_ACTION,() => {
    createToast("Book completely done","success");
})

document.addEventListener(READD_ACTION,() => {
    createToast("Book Re-add to the uncomplete book");
    })

document.addEventListener(DELETE_ACTION,() => {
    createToast("Delete book completely success","error");
});


document.addEventListener(ADD_ACTION,() => {
    createToast("Success Add book completely","success");
});

document.addEventListener(EDIT_ACTION,() => {
    createToast("Success Edit book completely","success");
});

addForm.addEventListener("submit",(e) => {
    e.preventDefault();
    const bookName = addForm.querySelector("#book-name").value;
    const bookYear = addForm.querySelector("#book-year").value;
    const bookAuthor = addForm.querySelector("#book-author").value;
    const book =  {
        id : +new Date(),
        title : bookName,
        author : bookAuthor,
        year : parseInt(bookYear),
        isComplete : false,
    }

    const isValid = bookFormValidation(book);
    if(!isValid) return  
    addBookToUncomplete(book);
});

searchInput.addEventListener("change",() => {
    const findElement = document.querySelector(".find-container");
    if(searchInput.value.length == 0 ) findElement.classList.remove("active");
    findBook(searchInput.value) 
})
btnSearch.addEventListener("change",() => { 
    const findElement = document.querySelector(".find-container");
    if(searchInput.value.length == 0 ) findElement.classList.remove("active");
    findBook(searchInput.value) 
});


function bookFormValidation({year}) {
    const yearNow = new Date().getFullYear();
    if( year < 1700 || year > yearNow ) {
        createToast("The year of book is invalid","error");
        return false;
    };

    return true;
}


function showError(msg) {
    createToast(msg,"error");
    showToast();
}

function buttonsSetListener() {
    const buttonsDelete = document.querySelectorAll(".btn-trash");
    const buttonsDone = document.querySelectorAll('.btn-done');
    const buttonsReadd = document.querySelectorAll('.btn-re-add');
    const buttonEdit = document.querySelectorAll(".btn-edit");
    [...buttonsDelete].map( btn => btn.addEventListener("click",() => {
        const targetId = btn.dataset.bookId
        deleteBook(targetId);
    }));
    [...buttonsDone].map( btn => btn.addEventListener("click",() => {
        const targetId = btn.dataset.bookId
        addBookToComplete(targetId);
    }));
    [...buttonsReadd].map( btn => btn.addEventListener("click",() => {
        const targetId = btn.dataset.bookId
        reAddBookFromComplete(targetId);
    }));
    [...buttonEdit].map( btn => btn.addEventListener("click",() => {
        const targetId = btn.dataset.bookId;
        editBook(targetId)
    }));

}

function createUncompleteList(books) {
    const parentElement = document.querySelector(".uncomplete-list");
    const listHTML = `
        ${books.map(book => {
            return `
            <li class="uncomplete-item">
                        <div class="book-info">
                            <h2 class="book-name">
                                ${book.title}
                                <span class="separator">-</span>
                                <span class="book-year">${book.year}</span>
                            </h2>
                            <p class="book-author">${book.author}</p>
                        </div>
                        <div class="book-action">
                            <div class="btn-action btn-done" data-book-id="${book.id}">
                                <i class="fa-solid fa-check "></i>
                            </div>
                            <div class="btn-action btn-edit" data-book-id="${book.id}">
                                <i class="fa-solid fa-pen"></i>
                            </div>
                            <div class="btn-action btn-trash" data-book-id="${book.id}">
                                <i class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
            </li>
            `
        }).join("\n")}
    `;
    parentElement.innerHTML = "";
    parentElement.insertAdjacentHTML("afterbegin",listHTML);
}

function createCompleteList(books) {
    const parentElement = document.querySelector(".complete-list");
    const listHTML = `
        ${books.map(book => {
            return `
            <li class="complete-item">
                        <div class="book-info">
                            <h2 class="book-name">
                                ${book.title}
                                <span class="separator">-</span>
                                <span class="book-year">${book.year}</span>
                            </h2>
                            <p class="book-author">${book.author}</p>
                        </div>
                        <div class="book-action">
                            <div class="btn-action btn-re-add" data-book-id="${book.id}">
                                <i class="fa-solid fa-rotate-left"></i>
                            </div>
                            <div class="btn-action btn-edit" data-book-id="${book.id}">
                                <i class="fa-solid fa-pen"></i>
                            </div>
                            <div class="btn-action btn-trash" data-book-id="${book.id}">
                                <i class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
            </li>
            `
        }).join("\n")}
    `;
    parentElement.innerHTML = "";
    parentElement.insertAdjacentHTML("afterbegin",listHTML);
}


function addBookToUncomplete(book) {
    if(!isLocalStorageExist) {
        alert("your browser doesn't support");
        return;
    }
    books.push(book);
    savedBook();

    addHistory(book.title,"add");
    savedHistory();

    document.dispatchEvent(new Event(ADD_ACTION));
    document.dispatchEvent(new Event(RENDER_EVENT));
    return;
}

function addBookToComplete(id) {
    const targetBook = books.findIndex( book => book.id == id);
    if(targetBook < 0 ) return showError("Book not found please refresh your browser again"); 
    books[targetBook].isComplete = true;
    savedBook();

    addHistory(books[targetBook].title,"done");
    savedHistory();

    document.dispatchEvent(new Event(DONE_ACTION));
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(id) {
    const targetBook = books.findIndex(book => book.id == id);
    if(targetBook < 0 ) {
        return ;
    }
    addHistory(books[targetBook].title,"delete");
    savedHistory();

    books.splice(targetBook,1);
    savedBook();

    document.dispatchEvent(new Event(DELETE_ACTION));
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function reAddBookFromComplete(id) {
    const targetBook = books.findIndex(book => book.id == id);
    books[targetBook].isComplete = false;
    savedBook();

    addHistory(books[targetBook].title,"re-add");    
    savedHistory()

    document.dispatchEvent(new Event(READD_ACTION));
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function editBook(id) {
    const indexBook = books.findIndex( book => book.id == id);
    if(indexBook == -1 ) return createToast("Book not found please try again","error");
    const targetBook = books[indexBook];
    createEditModal(targetBook);
}

function createEditModal(book) {
    const headerHTML  = `<h1 class="modal-title">Edit Book</h1>`;
    const contentHTML = `
    <form action="" data-book-id="${book.id}" id="edit-book-form">
                    <div class="field-group">
                        <label for="edit-name">Name</label>
                        <input type="text" value="${book.title}" name="edit-name" id="edit-name">
                    </div>
                    <div class="field-group">
                        <label for="edit-author">Author</label>
                        <input type="text" value="${book.author}" name="edit-author" id="edit-author">
                    </div>
                    <div class="field-group">
                        <label for="edit-year">year</label>
                        <input type="number" value="${book.year}" name="edit-year" id="edit-year">
                    </div>
                    <button role="submit" id="edit-submit">Edit now</button>
                </form>
    `;
    const footerHTML = "";

    const modal = createModal();
    modal.appendHeader(headerHTML);
    modal.appendContent(contentHTML);
    modal.appendFooter(footerHTML);
    modal.show();

    const editForm = document.getElementById("edit-book-form");
    editForm.addEventListener("submit",(e) => {
        e.preventDefault();
        saveEditedBook(editForm)
        setTimeout(() => modal.hide(),500);
    });
}

function saveEditedBook(editForm) {
    const titleForm = editForm.querySelector("#edit-name").value;
    const authorForm = editForm.querySelector("#edit-author").value;
    const yearForm = editForm.querySelector("#edit-year").value;
    const targetId = editForm.dataset.bookId;
    const indexBook = books.findIndex(book => book.id == targetId);
    if(!books[indexBook]) createToast("Book not found please refresh your browser","error");
    books[indexBook].title = titleForm;
    books[indexBook].author = authorForm;
    books[indexBook].year = yearForm;
    if(!bookFormValidation(books[indexBook])) return createToast("invalid year",'error');
    savedBook(); 

    addHistory(titleForm,"edit");
    savedHistory();

    document.dispatchEvent(new Event(EDIT_ACTION));
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(txtSearch) {
    const regex = new RegExp(`(?:^|\W)${txtSearch}(?:$|\W)`,"is");
    const filterBooks = books.filter(book => regex.test(book.title));
    if(!filterBooks.length)  {
        setTimeout(() => createToast("Book not found","error"),1000); 
        return console.log("gak ketemu")
    };
    const findElement = document.querySelector(".find-container");
    findElement.classList.add("active");
    renderFindBook(filterBooks);
}

function renderFindBook(books) {
    const containerListEl = document.querySelector(".find-book-list");
    const itemHTML =  `
        ${books.map(book => {
            return `
            <li class="book-item ${book.isComplete ? "complete" : "uncomplete"}">
                <div class="book-header">
                    <h2 class="book-name">${book.title}
                        <span class="separator">-</span>
                        <span class="book-year">${book.year}</span></h2>
                    <h2 class="book-status">${book.isComplete ? "Complete" : "Uncomplete"}</h2>
                </div>
                <div class="book-info">
                    <p class="book-author">${book.author}</p>
                    ${book.isComplete 
                        ? `<div class="book-action">
                                    <i class="fa-solid fa-rotate-left btn-re-add" data-book-id="${book.id}" ></i>
                                    <i class="fa-solid fa-pen btn-edit" data-book-id="${book.id}" ></i>
                                    <i class="fa-solid fa-trash-can btn-trash" data-book-id="${book.id}"></i>
                            </div>
                        `
                        : 
                        `<div class="book-action">
                            <i class="fa-solid fa-check btn-done" data-book-id="${book.id}"></i>
                            <i class="fa-solid fa-pen btn-edit" data-book-id="${book.id}" ></i>
                            <i class="fa-solid fa-trash-can btn-trash" data-book-id="${book.id}"></i>
                        </div>

                        `
                    }
                </div>
                
            </li>
            `
        }).join("\n")}
    `
    containerListEl.innerHTML = "";
    containerListEl.insertAdjacentHTML("afterbegin",itemHTML);
    buttonsSetListener()
}


function savedBook() {
    if(isLocalStorageExist) {
        localStorage.setItem(STORAGE_BOOK_KEY,JSON.stringify(books));
    }
}

function addHistory(title,status) {
    const history = {
        title,
        status,
        date : new Date(),
    };
    historys.unshift(history);
    if(historys.length > 5 ) historys.pop();
}


function savedHistory() {
    if(isLocalStorageExist) {
        localStorage.setItem(HISTORY_KEY,JSON.stringify(historys));
    }
}

function createDay(date) {
    const historyDate = new Date(date);
    const time = `${historyDate.getHours()} : ${historyDate.getMinutes()}`;
    const dateNow = new Date();
    if(historyDate.getDate() == dateNow.getDate()) return `Today ${time}`;
    if(dateNow.getDate() - historyDate.getDate() == 1) return  `Yesterday ${time}`;
    if(dateNow.getFullYear() == historyDate.getFullYear()) return `${historyDate.getDate()},${historyDate.getMonth()}`;
    return `${historyDate.getDate()}/${historyDate.getMonth()}/${historyDate.getFullYear()}`;
}

function renderHistory(history) {
    const historyHTML = `
    ${history.map(his => {
        const { date : dates } = his;
        const day = createDay(dates);
        return ` <li class="history-item">
        <div class="list-type"></div>
        <div class="status-label ${his.status}">${his.status}</div>
        <p class="book-name">${his.title}</p>
        <p class="date">${day}</p>
    </li>`
    }).join("")}
    `;
    const parentEl = document.querySelector(".history-list");
    parentEl.innerHTML = ""
    parentEl.insertAdjacentHTML("afterbegin",historyHTML);
}


const arrowBtn = document.querySelectorAll(".arrow-down");
[...arrowBtn].map(btn => btn.addEventListener("click",function() {
    const queryElement = btn.dataset.query;
    const targetEl = document.querySelector(queryElement);
    targetEl.scroll({
        top : targetEl.scrollTop + 50,
        behavior : "smooth"
    })
}))



