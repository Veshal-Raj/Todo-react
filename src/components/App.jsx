import { useState, useRef, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';


import "./App.css";
import "./Delete.css";
import "./Edit.css";
import "./Checkbox.css";

function App() {
  const [input, setInput] = useState("");
  const [storeInput, setStoreInput] = useState([]);
  const [editId, setEditId] = useState(0);
  const inputRef = useRef("null");

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("todoListData");
      console.log('stored Data -->',storedData)
      if (storedData) {
        setStoreInput(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Error parsing JSON from local storage:", error);
      // Handle the error as needed, for example, you can set an empty array
      setStoreInput([]);
    }

    inputRef.current.focus();
  },[]);

  useEffect(()=> {
    // localStorage.setItem('todoListData',JSON.stringify(storeInput));
  },[storeInput])

  const addToDo = () => {
    if (input.trim() === "") return;
    // Check if the input value already exists in the storeInput array
  const isDuplicate = storeInput.some((todo) => todo.list === input);

  if (!isDuplicate) {
    setStoreInput((prevStoreInput) => {
      if (editId) {
        return prevStoreInput.map((todo) => 
        todo.id === editId ? {...todo, list: input} : todo
        );
        
      } else {
        const updatedStoreInput = [...prevStoreInput, {list: input, id: Date.now(), status: false}];
        
        localStorage.setItem('todoListData',JSON.stringify(updatedStoreInput));
        return updatedStoreInput;
      }
    })

    setEditId(0);
    setInput("");
    
  } else {
    console.log('duplicate found');
  
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Duplicate cannot be added!",
     
    });
  }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onDelete = (id) => {
    // Show a confirmation SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this todo item!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove the item from the React state
      setStoreInput((prevStoreInput) =>
        prevStoreInput.filter((todo) => todo.id !== id)
      );

      // Remove the item from local storage
      const updatedStoreInput = storeInput.filter((todo) => todo.id !== id);
      localStorage.setItem('todoListData', JSON.stringify(updatedStoreInput));

      // Show success SweetAlert
      Swal.fire('Deleted!', 'Your todo item has been deleted.', 'success');
    }
  });
  };

  const onComplete = (id) => {
    setStoreInput((prevStoreInput) =>
      prevStoreInput.map((todo) =>
        todo.id === id ? { ...todo, status: !todo.status } : todo
      )
    );
  };

  const onEdit = (id) => {
    const editTodo = storeInput.find((todos) => todos.id === id);

    if (editTodo) {
      const { list, id } = editTodo;
      setInput(list);
      setEditId(id);
    }
  };

  return (
    <div className="container">
      <h2>ToDo App</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          ref={inputRef}
          placeholder="write something..."
          onChange={(event) => setInput(event.target.value)}
        />
        <button className="submitButton" onClick={addToDo}>
          {editId ? "Edit" : "Add"}
        </button>
      </form>
      <div>
        <ul>
          {storeInput.map((todo) => (
            <li key={todo.id} id={todo.status ? "list-item" : ""}>
              <p>{todo.list}</p>

              <span className="iconsAndButtons">
                <AiOutlineCheckCircle
                  className="check-button"
                  id="complete"
                  title="Complete"
                  onClick={() => onComplete(todo.id)}
                />

                <button
                  className="edit-button"
                  id="edit"
                  onClick={() => onEdit(todo.id)}
                >
                  <svg className="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>

                <button
                  className="delete-button"
                  id="delete"
                  onClick={() => onDelete(todo.id)}
                >
                  <svg className="delete-svgIcon" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
