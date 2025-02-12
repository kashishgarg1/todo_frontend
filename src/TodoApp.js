import React, { useState } from 'react';
import './TodoApp.css'; // Import your CSS file

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingTodoIndex, setEditingTodoIndex] = useState(null);

    const addTodo = () => {
        if (!newTodo.trim()) return; // Prevent empty todos
        if (isEditing) {
            const updatedTodos = todos.map((todo, index) =>
                index === editingTodoIndex ? newTodo : todo
            );
            setTodos(updatedTodos);
            setIsEditing(false);
            setEditingTodoIndex(null);
        } else {
            setTodos([...todos, newTodo]);
        }
        setNewTodo(''); // Clear input field
    };

    const deleteTodo = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
    };

    const startEditing = (index) => {
        setNewTodo(todos[index]);
        setIsEditing(true);
        setEditingTodoIndex(index);
    };

    return (
        <div className="todo-container">
            <h1>To-Do List</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new todo"
                />
                <button onClick={addTodo}>
                    {isEditing ? 'Update Todo' : 'Add Todo'}
                </button>
            </div>
            <ul className="todo-list">
                {todos.map((todo, index) => (
                    <li key={index} className="todo-item">
                        <span>{todo}</span>
                        <div>
                            <button onClick={() => startEditing(index)}>Edit</button>
                            <button onClick={() => deleteTodo(index)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;
