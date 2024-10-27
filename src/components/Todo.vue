<template>
  <div>
    <header>
      <nav class="navbar">
        <h1>Simple Todo App</h1>
        <div class="logo">
          <img src="" alt="" />
        </div>
      </nav>
    </header>
    <div class="container">
      <h1 class="title">Todo List</h1>
      <hr />

      <div class="input-group">
        <input
          type="text"
          class="form-control"
          placeholder="Add item..."
          v-model="userInput"
          @keyup.enter="addItem"
          required
        />
        <button @click="addItem" class="btn btn-success">Add</button>
      </div>
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          placeholder="Search todos..."
          v-model="searchInput"
        />
      </div>

      <div class="todo-table">
        <div class="table-header">
          <div class="table-cell">Task</div>
          <div class="table-cell">Actions</div>
        </div>

        <div class="table-body">
          <div
            class="table-row"
            v-for="(item, index) in filteredList"
            :key="index"
            :class="{ 'even-row': index % 2 === 0, completed: item.completed }"
          >
            <div
              class="table-cell"
              :class="{ 'completed-cell': item.completed }"
            >
              {{ item.value }}
            </div>

            <div class="table-cell">
              <button @click="toggleCompleted(index)" class="btn btn-primary">
                {{ item.completed ? "Undo" : "Complete" }}
              </button>
              <button @click="editItem(index)" class="btn btn-info">
                Edit
              </button>
              <button @click="deleteItem(index)" class="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTodoStore } from "@/stores/todoStore";

const todoStore = useTodoStore();
const userInput = ref("");
const searchInput = ref("");

// Load saved todos when the component is mounted
onMounted(() => {
  todoStore.loadTodosFromStorage();
});

const addItem = () => {
  if (userInput.value.trim() !== "") {
    const newItem = {
      id: Math.random(),
      value: userInput.value.trim(),
      completed: false,
    };
    todoStore.addTodo(newItem);
    userInput.value = "";
  }
};

const editItem = (index) => {
  userInput.value = todoStore.todos[index].value; // Set input field with selected todo text
  todoStore.deleteTodo(index); // Temporarily remove item for re-adding on `addItem()`
};

const deleteItem = (index) => {
  const deleteTodo = confirm("Are you sure you want to delete the todo?");
  if (deleteTodo) {
    todoStore.deleteTodo(index);
  }
};

const toggleCompleted = (index) => {
  todoStore.toggleCompleted(index);
};

const filteredList = computed(() => {
  return todoStore.todos.filter((item) =>
    item.value.toLowerCase().includes(searchInput.value.toLowerCase())
  );
});
</script>

<style src="../assets/todo.css"></style>
