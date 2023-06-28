const input = document.getElementById("title");
const button = document.getElementById("create");
const list = document.getElementById("list");

let stringStorage = localStorage.getItem("notes");
let parseStorage = JSON.parse(stringStorage);

let notes = [];

if (parseStorage) notes = parseStorage;

button.addEventListener("click", addNoteToHTML);

function addNoteToHTML() {
  if (!input.value) return;
  const newNote = {
    title: input.value,
    completed: false,
  };
  notes.push(newNote);
  render();
  input.value = "";
}

function render() {
  list.innerHTML = "";
  if (notes.length === 0) {
    list.innerHTML =
      '<p class="text-white fs-5 text-center mt-3">Нет элементов</p>';
  } else {
    for (let [index, note] of notes.entries()) {
      list.insertAdjacentHTML("beforeend", getNoteTemplate(note, index));
    }
    saveToLocalStorage(notes);
  }
}

function getNoteTemplate(note, index) {
  return `
	<li class="list-group-item fs-5 p-3 d-flex justify-content-between align-items-center" data-index="${index}">
		<span class="w-75 ${note.completed ? "text-decoration-line-through" : ""}">${note.title}</span>
		<span>
			<span class="btn btn-small btn-${note.completed ? "warning" : "success"}" data-index="${index}" data-type="toggle">&check;</span>
			<span class="btn btn-small btn-danger" data-index="${index}" data-type="remove">&times;</span>
		</span>
	</li>
	`;
}

function saveToLocalStorage(notes) {
  const stringNotes = JSON.stringify(notes);
  localStorage.setItem("notes", stringNotes);
}

render();

list.addEventListener("click", toggleState);

function toggleState(event) {
  if (event.target.dataset.index) {
    const index = +event.target.dataset.index;
    const type = event.target.dataset.type;

    if (type === "toggle") {
      notes[index].completed = !notes[index].completed;
    } else if (type === "remove") {
      notes.splice(index, 1);
    }

    saveToLocalStorage(notes);
  }
  render();
}

input.addEventListener("keydown", useEnter);

function useEnter(event) {
  if (event.key === "Enter") {
    addNoteToHTML();
  }
}