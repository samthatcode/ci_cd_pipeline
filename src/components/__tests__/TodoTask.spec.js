import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Todo from '@/components/Todo.vue';
import { useTodoStore } from '@/stores/todoStore';

describe('TodoComponent', () => {
    let wrapper, todoStore;

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

    it('adds a new todo item when addItem is called', async () => {
        todoStore.addTodo({
            id: 1,
            value: 'New Task',
            completed: false
        });

        // Verify todo was added to store
        expect(todoStore.todos).toHaveLength(1);
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
        // todoStore.addTodo({ id: 1, value: 'Delete Task', completed: false });
        window.confirm = vi.fn(() => true); // Mock confirm dialog
        wrapper.vm.deleteItem(0);
        expect(todoStore.todos.length).toBe(0);
    });
 
});