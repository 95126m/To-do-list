document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        openModalBtn: document.getElementById("openModalBtn"),
        resetBtn: document.getElementById("resetBtn"),
        modal: document.getElementById("myModal"),
        closeBtn: document.getElementsByClassName("close")[0],
        saveBtn: document.getElementById("saveBtn"),
        todoList: document.getElementById("todoList"),
        completedList: document.getElementById("completedList"),
        todoTitle: document.getElementById("todoTitle"),
        todoDescription: document.getElementById("todoDescription"),
        modalTitle: document.getElementById("modalTitle"),
        dateInput: document.getElementById("dateInput")
    };

    let isEditMode = false;
    let editItem = null;

    // 저장된 데이터 불러오기
    const loadTodoListFromStorage = () => {
        elements.todoList.innerHTML = localStorage.getItem('todoList') || '';
        elements.completedList.innerHTML = localStorage.getItem('completedList') || '';
        elements.dateInput.value = localStorage.getItem('selectedDate') || '';
        addEventListenersToButtons();
    };

    // 모달 제어
    const closeModal = () => {
        elements.modal.style.display = "none";
        const editInViewBtn = document.getElementById("editInViewBtn");
        if (editInViewBtn) editInViewBtn.remove();
    };

    // 데이터 저장
    const saveTodoListToStorage = () => {
        localStorage.setItem('todoList', elements.todoList.innerHTML);
        localStorage.setItem('completedList', elements.completedList.innerHTML);
    };

    // 할 일 저장
    const saveTodoItem = () => {
        const title = elements.todoTitle.value.trim();
        const description = elements.todoDescription.value.trim();
        const date = elements.dateInput.value;

        if (!title || !description || !date) {
            alert('제목, 내용, 날짜를 모두 입력해주세요.');
            return;
        }

        let listItem;
        if (isEditMode && editItem) {
            // 기존 항목 수정
            listItem = editItem;
            listItem.querySelector(".todo-title").textContent = title;
            listItem.dataset.description = description;
            listItem.dataset.date = date;
            listItem.classList.remove("completed");
        } else {
            // 새 항목 추가
            listItem = document.createElement("li");
            listItem.classList.add("todo-item");
            listItem.dataset.id = new Date().getTime();
            listItem.dataset.description = description;
            listItem.dataset.date = date;

            const titleSpan = document.createElement("span");
            titleSpan.textContent = title;
            titleSpan.classList.add("todo-title");
            listItem.appendChild(titleSpan);

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            const completeBtn = document.createElement("button");
            completeBtn.classList.add("complete-btn");
            completeBtn.innerHTML = '<span class="material-icons">done</span>';
            completeBtn.onclick = (event) => {
                event.stopPropagation();
                completeTodoItem(listItem);
            };
            buttonContainer.appendChild(completeBtn);
            listItem.appendChild(buttonContainer);
            elements.todoList.appendChild(listItem);

            listItem.addEventListener("click", () => viewTodoItem(listItem));
        }

        closeModal();
        elements.todoTitle.value = '';
        elements.todoDescription.value = '';
        elements.dateInput.value = '';
        saveTodoListToStorage();
    };

    // 할 일 완료
    const completeTodoItem = (listItem) => {
        listItem.classList.add('completed-item');
        listItem.removeChild(listItem.querySelector('.button-container'));
        elements.completedList.appendChild(listItem);
        listItem.removeEventListener("click", () => viewTodoItem(listItem)); // 모달창이 뜨지 않도록 클릭 이벤트 제거
        saveTodoListToStorage();
    };

    // 할 일 보기
    const viewTodoItem = (listItem) => {
        if (listItem.classList.contains('completed-item')) return; // 완료된 항목이면 모달창이 뜨지 않도록
        
        elements.modalTitle.textContent = "View todos";
        elements.todoTitle.value = listItem.querySelector(".todo-title").textContent;
        elements.todoDescription.value = listItem.dataset.description;
        elements.dateInput.value = listItem.dataset.date;
        elements.todoTitle.disabled = elements.todoDescription.disabled = elements.dateInput.disabled = true;
        elements.saveBtn.style.display = "none";

        const modalContent = document.querySelector(".modal-content");
        modalContent.classList.remove("edit-todos");
        modalContent.classList.add("view-todos");

        let editInViewBtn = document.getElementById("editInViewBtn");
        if (editInViewBtn) editInViewBtn.remove();

        editInViewBtn = document.createElement("button");
        editInViewBtn.textContent = "edit";
        editInViewBtn.id = "editInViewBtn";
        editInViewBtn.classList.add("edit-btn");
        editInViewBtn.onclick = () => editTodoItem(listItem);
        modalContent.appendChild(editInViewBtn);

        elements.modal.style.display = "block";
    };

    // 할 일 수정
    const editTodoItem = (listItem) => {
        isEditMode = true;
        editItem = listItem;
        elements.modalTitle.textContent = "Edit todos";
        elements.todoTitle.value = listItem.querySelector(".todo-title").textContent;
        elements.todoDescription.value = listItem.dataset.description;
        elements.dateInput.value = listItem.dataset.date;
        elements.todoTitle.disabled = elements.todoDescription.disabled = elements.dateInput.disabled = false;
        elements.saveBtn.style.display = "block";

        const modalContent = document.querySelector(".modal-content");
        modalContent.classList.remove("view-todos");
        modalContent.classList.add("edit-todos");

        const editInViewBtn = document.getElementById("editInViewBtn");
        if (editInViewBtn) editInViewBtn.remove();
        elements.modal.style.display = "block";
    };

    // 각 버튼에 클릭 이벤트 리스너 추가
    const addEventListenersToButtons = () => {
        document.querySelectorAll('.todo-item').forEach(item => {
            item.querySelector('.complete-btn').onclick = (event) => {
                event.stopPropagation();
                completeTodoItem(item);
            };
            item.addEventListener("click", () => viewTodoItem(item));
        });
    };

    // 할 일 목록 초기화
    const resetTodoList = () => {
        if (confirm("전체 삭제 하시겠습니까?")) {
            elements.todoList.innerHTML = elements.completedList.innerHTML = '';
            localStorage.removeItem('todoList');
            localStorage.removeItem('completedList');
            localStorage.removeItem('selectedDate');
            elements.dateInput.value = '';
        }
    };

    // 모달 제어를 위한 이벤트 리스너
    elements.openModalBtn.addEventListener("click", () => {
        isEditMode = false;
        elements.modalTitle.textContent = "Add todos";
        elements.todoTitle.value = elements.todoDescription.value = elements.dateInput.value = '';
        elements.saveBtn.style.display = "block";
        elements.todoTitle.disabled = elements.todoDescription.disabled = elements.dateInput.disabled = false;
        elements.modal.style.display = "block";
    });

    elements.closeBtn.addEventListener("click", closeModal);
    elements.saveBtn.addEventListener("click", saveTodoItem);
    elements.resetBtn.addEventListener("click", resetTodoList);

    // 페이지 로드 시 로컬 스토리지에서 데이터 불러오기
    loadTodoListFromStorage();
});
