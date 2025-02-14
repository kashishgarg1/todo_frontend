import React, { useEffect, useState } from "react";
import './TodoApp.css'; // Import the CSS file

function TodoApp() {
    const [name, setName] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskName, setEditingTaskName] = useState('');

    useEffect(() => {
        const fetchAllTask = async () => {
            const response = await fetch('http://localhost:8080/tasks');
            const content = await response.json();
            setTasks(content);
            console.log(content);
        }

        fetchAllTask();
    }, []);

    const create = async e => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/tasks', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const task = await response.json();
        setTasks([...tasks, task]);
        setName('');
    };

    const update = async (id, checked) => {
        if (checked) {
            // Ask for confirmation before deleting the task
            const confirmDelete = window.confirm('Are you sure you want to delete this task?');
            if (confirmDelete) {
                // Proceed to delete the task
                await del(id);
                return; // Exit the function early to avoid further processing
            } else {
                // If user cancels, revert checkbox to unchecked
                // Find the task and set completed to false
                setTasks(tasks.map(task => (task.id === id ? { ...task, completed: false } : task)));
                return;
            }
        }
    
        // Update the task completion status if not deleting
        const updatedTask = { 
            name: editingTaskName || tasks.find(task => task.id === id).name, 
            completed: checked 
        };
    
        await fetch(`http://localhost:8080/tasks/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        });
    
        // Update state immediately after the update
        setTasks(tasks.map(task => (task.id === id ? { ...task, completed: checked, name: updatedTask.name } : task)));
        setEditingTaskId(null); // Reset editing state
        setEditingTaskName(''); // Clear editing name
    };
    
    

    const del = async id => {
        // if (window.confirm('Are you sure you want to delete this task?')) {
            await fetch(`http://localhost:8080/tasks/${id}`, { method: 'DELETE' });
            setTasks(tasks.filter(t => t.id !== id));
    };

    const startEditing = (task) => {
        setEditingTaskId(task.id);
        setEditingTaskName(task.name);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await update(editingTaskId, false); // Update to current checked state (false since we are not changing it)
    };

    return (
        <div className="todo-container">
            <h1>Tasks List</h1>
            <form className="input-container" onSubmit={create}>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Add a new task"
                />
                <button type="submit">Add</button>
            </form>
            <ul className="todo-list">
                {tasks.map(task => (
                    <li key={task.id} className="todo-item">
                        <div>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={e => update(task.id, e.target.checked)}
                            />
                            {editingTaskId === task.id ? (
                                <form onSubmit={handleEditSubmit}>
                                    <input
                                        type="text"
                                        value={editingTaskName}
                                        onChange={e => setEditingTaskName(e.target.value)}
                                    />
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => setEditingTaskId(null)}>Cancel</button>
                                </form>
                            ) : (
                                <span>{task.name}</span>
                            )}
                        </div>
                        <button onClick={() => startEditing(task)}>Edit</button>
                        <button onClick={() => del(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoApp;

// import React, { useState } from 'react';
// import './TodoApp.css'; // Import your CSS file

// const TodoApp = () => {
//     const [todos, setTodos] = useState([]);
//     const [newTodo, setNewTodo] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingTodoId, setEditingTodoId] = useState(null);

//     // Add a new todo
//     const addTodo = () => {
//         if (!newTodo.trim()) return; 

//         const todoData = { 
//             id: Date.now(),  // Create a unique id for each todo
//             title: newTodo, 
//             completed: false 
//         };

//         setTodos([...todos, todoData]); // Add new todo to the list
//         resetForm();  // Reset the form
//     };

    
//     const updateTodo = () => {
       
//         if (!newTodo.trim()) {
//             return;  
//         }
   
//         const updatedTodos = todos.map((todo) => {  
//             if (todo.id === editingTodoId) {
               
//                 return { ...todo, title: newTodo };
//             }
          
//             return todo;
//         });
    
      
//         setTodos(updatedTodos);
    
       
//         resetForm();
//     };
    
//     // Delete a todo by id
//     const deleteTodo = (id) => {
//         // Filter through the 'todos' array and remove the todo with the matching 'id'
//         const updatedTodos = todos.filter((todo) => {
//             // If the todo's id doesn't match the provided id, it will be kept in the array
//             return todo.id !== id;
//         });
    
//         // Update the state with the new list of todos, excluding the deleted one
//         setTodos(updatedTodos);
//     };
    

//     // Start editing a todo
//     const startEditing = (todo) => {
//         setNewTodo(todo.title);
//         setIsEditing(true);
//         setEditingTodoId(todo.id);
//     };

//     // Reset form state
//     const resetForm = () => {
//         setNewTodo('');
//         setIsEditing(false);
//         setEditingTodoId(null);
//     };

//     // Handle form submission (either adding or updating)
//     const handleSubmit = (e) => {
//         e.preventDefault(); 
//         isEditing ? updateTodo() : addTodo();
//     };

//     return (
//         <div className="todo-container">
//             <h1>To-Do List</h1>
//             <form onSubmit={handleSubmit} className="input-container">
//                 <input
//                     type="text"
//                     value={newTodo}
//                     onChange={(e) => setNewTodo(e.target.value)}
//                     placeholder="Add new todo"
//                 />
//                 <button type="submit">
//                     {isEditing ? 'Update Todo' : 'Add Todo'}
//                 </button>
//             </form>
//             <ul className="todo-list">
//                 {todos.map((todo) => (
//                     <li key={todo.id} className="todo-item">
//                         <span>{todo.title}</span>
//                         <div>
//                             <button onClick={() => startEditing(todo)}>Edit</button>
//                             <button onClick={() => deleteTodo(todo.id)}>Delete</button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default TodoApp;
