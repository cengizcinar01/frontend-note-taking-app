import { useEffect, useState } from "react";
import "./App.css";

const url = "https://t0k4ccc.49.13.140.43.sslip.io";

function App() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState("Max");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getNotes();
    async function getNotes() {
      const res = await fetch(`${url}/${user}`);
      const data = await res.json();
      if ("message" in data) {
        setMessage(data.message);
        setNotes([]);
      } else {
        setNotes(data);
        setMessage("");
      }
    }
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    const contentValue = event.target.content.value;

    const res = await fetch(`${url}/${user}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: contentValue }),
    });
    event.target.reset();
    const data = await res.json();
    setMessage("message" in data ? data.message : "");
  }

  async function handleSubmitEdit(event, id) {
    event.preventDefault();
    const editContentValue = event.target.editContent.value;

    const res = await fetch(`${url}/${user}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: editContentValue }),
    });
    event.target.reset();
    const data = await res.json();
    setMessage("message" in data ? data.message : "");
  }

  async function handleDelete(id) {
    const res = await fetch(`${url}/${user}/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    setMessage("message" in data ? data.message : "");

    setNotes(notes.filter((note) => note.id !== id));
  }

  return (
    <>
      <h1>Note-taking app</h1>
      <div className="card">
        <button onClick={() => setUser("Cengiz")}>Cengiz</button>
        <button onClick={() => setUser("Erkan")}>Erkan</button>
        <button onClick={() => setUser("Stefan")}>Stefan</button>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              {note.content}
              <button
                onClick={() => {
                  handleDelete(note.id);
                }}
              >
                X
              </button>
              <form onSubmit={(event) => handleSubmitEdit(event, note.id)}>
                <input id="editContent" type="text" />
                <button>Edit note</button>
              </form>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input id="content" type="text" />
          <button>Add note</button>
        </form>
      </div>
      <p className="read-the-docs">Response from the server</p>
      <div>{message}</div>
    </>
  );
}

export default App;
