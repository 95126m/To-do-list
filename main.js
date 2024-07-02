document.addEventListener("DOMContentLoaded", function() {
    const openModalBtn = document.getElementById("openModalBtn");
    const modal = document.getElementById("myModal");
    const closeBtn = document.getElementsByClassName("close")[0];
    const saveBtn = document.getElementById("saveBtn");
    const todoList = document.getElementById("todoList");
    const todoTitle = document.getElementById("todoTitle");
    const todoDescription = document.getElementById("todoDescription");
    const modalTitle = document.getElementById("modalTitle");

    let isEditMode = false;
    let editItem = null;

    // 모달창 열기
    openModalBtn.addEventListener("click", function() {
        isEditMode = false;
        modalTitle.textContent = "Add todos";
        todoTitle.value = "";
        todoDescription.value = "";
        modal.style.display = "block";
    });

    // 모달창 닫기
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // 할 일 저장
    saveBtn.addEventListener("click", function() {
        const title = todoTitle.value.trim();
        const description = todoDescription.value.trim();

        if (title) {
            if (isEditMode && editItem) {
                editItem.textContent = title;
                editItem.dataset.description = description;
            } else {
                const li = document.createElement("li");
                li.textContent = title;
                li.dataset.description = description; // 설명을 dataset 속성에 저장
                li.classList.add("todo-item"); // 클래스 추가
                todoList.appendChild(li);
            }

            // 입력 필드 초기화
            todoTitle.value = "";
            todoDescription.value = "";

            // 모달창 닫기
            modal.style.display = "none";
        } else {
            alert("내용을 입력하세요.");
        }
    });

    // 리스트 항목 클릭 시 모달창 열기 및 내용 표시
    todoList.addEventListener("click", function(event) {
        if (event.target.tagName === "LI") {
            isEditMode = true;
            editItem = event.target;
            modalTitle.textContent = "Edit todos";
            todoTitle.value = event.target.textContent;
            todoDescription.value = event.target.dataset.description;
            modal.style.display = "block";
        }
    });
});
