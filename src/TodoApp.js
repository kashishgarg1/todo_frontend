import React, { useState, useEffect } from 'react';
import './TodoApp.css'; // Import your CSS file
import axios from 'axios';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingTodoId, setEditingTodoId] = useState(null);

    // Fetch all todos from the backend
    const fetchTodos = () => {
        axios.get('http://localhost:8080/api/todos')
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });
    };

    useEffect(() => {
        fetchTodos(); 
    }, []);

    // Add a new todo to the backend
    const addTodo = () => {
        if (!newTodo.trim()) return;
    
        const todoData = { title: newTodo, completed: false };
    
        axios.post('http://localhost:8080/api/todos', todoData)
            .then(response => {
                setTodos([...todos, response.data]); // Use response.data directly
                resetForm();
            })
            .catch(error => {
                console.error('Error adding todo:', error);
            });
    };
    
    // Update an existing todo
    const updateTodo = () => {
        if (!newTodo.trim()) return;

        const todoData = { title: newTodo, completed: false };

        axios.put(`http://localhost:8080/api/todos/update/${editingTodoId}`, todoData)
            .then(() => {
                setTodos(todos.map(todo => 
                    todo.id === editingTodoId ? { ...todo, title: newTodo } : todo
                )); // Update the specific todo in state
                resetForm();
            })
            .catch(error => {
                console.error('Error updating todo:', error);
            });
    };

    // Delete a todo by id
    const deleteTodo = (id) => {
        axios.delete(`http://localhost:8080/api/todos/delete/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo.id !== id)); // Remove todo from state
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    };

    // Start editing a todo
    const startEditing = (todo) => {
        setNewTodo(todo.title);
        setIsEditing(true);
        setEditingTodoId(todo.id);
    };

    // Reset form state
    const resetForm = () => {
        setNewTodo('');
        setIsEditing(false);
        setEditingTodoId(null);
    };

    // Handle form submission (either adding or updating)
    const handleSubmit = (e) => {
        e.preventDefault(); 
        isEditing ? updateTodo() : addTodo();
    };

    return (
        <div className="todo-container">
            <h1>To-Do List</h1>
            <form onSubmit={handleSubmit} className="input-container">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new todo"
                />
                <button type="submit">
                    {isEditing ? 'Update Todo' : 'Add Todo'}
                </button>
            </form>
            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                        <span>{todo.title}</span>
                        <div>
                            <button onClick={() => startEditing(todo)}>Edit</button>
                            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

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
