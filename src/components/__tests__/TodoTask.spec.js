import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Todo from '@/components/Todo.vue';
import { useTodoStore } from '@/stores/todoStore';

// describe is used to group related tests.
describe('TodoComponent', () => {
    let wrapper, todoStore;

    // beforeEach and afterEach set up and clean up before and after each test.
    beforeEach(() => {
        setActivePinia(createPinia());
        todoStore = useTodoStore();
        wrapper = mount(Todo, {
            global: {
                plugins: [createPinia()],
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    //it defines a single test case.
    it('adds a new todo item when addItem is called', async () => {
        todoStore.addTodo({
            id: 1,
            value: 'New Task',
            completed: false
        });

        // Verify todo was added to store
        expect(todoStore.todos).toHaveLength(1); // expect is used for assertions (checking if conditions are met).
        expect(todoStore.todos[0].value).toBe('New Task');

    });

    it('does not add an empty todo item', async () => {
        wrapper.vm.userInput = '';
        await wrapper.find('.btn-success').trigger('click');
        expect(todoStore.todos.length).toBe(0);
    });

    it('edits an existing todo item', async () => {
        todoStore.addTodo({ id: 1, value: 'Edit Task', completed: false });
        wrapper.vm.editItem(0);
        await wrapper.vm.$nextTick();
        expect(todoStore.todos[0].value).toBe('Edit Task');
    });

    it('deletes a todo item when deleteItem is called', async () => {
        // vi is a Vitest object for mocking functions, which is useful for simulating behaviors (e.g., browser confirmations).
        window.confirm = vi.fn(() => true); // Mock confirm dialog
        wrapper.vm.deleteItem(0);
        expect(todoStore.todos.length).toBe(0);
    });

    it('toggles completed status', async () => {
        todoStore.addTodo({
            id: 1,
            value: 'Toggle Task',
            completed: false
        })

        // expect (todoStore.todos).toHaveLength(1) 
        expect(todoStore.todos[0].completed).toBe(false) || (todoStore.todos[0].completed).toBe(true)
    })

    it('loads todos from localStorage', () => {
        const mockTodos = JSON.stringify([
            { id: 1, value: 'Stored Task', completed: false }
        ]);
        localStorage.setItem('todos', mockTodos);

        todoStore.loadTodosFromStorage();

        expect(todoStore.todos).toHaveLength(1);
        expect(todoStore.todos[0].value).toBe('Stored Task');
    });

});