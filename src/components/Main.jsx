import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Main.css";

export default function Main() {
  const spans = ["All", "Pending", "Completed"];
  const [selectedSpan, setSelectedSpan] = useState(null);
  const [inputText, setInputText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Connection error", error);
      notifyError("Connection error. Please try again");
    }
  };
  const handleSpanClick = (index) => {
    setSelectedSpan(index);
    if (index === 0) {
      setFilter("all");
    } else if (index === 1) {
      setFilter("pending");
    } else if (index === 2) {
      setFilter("completed");
    }
  };

  const handlFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedSpan(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  //input text change
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  //"ADD" button click
  const handleAddClick = async () => {
    const addButton = document.querySelector(".add-task");

    if (inputText.trim() !== "") {
      try {
        await axios.post("http://localhost:5000/add", {
          task: inputText,
          status: "pending",
          createdAt: { type: Date, default: Date.now },
        });
        fetchTasks();
        setInputText("");
        notifySuccess("Added successfully");
        // text and background color
        addButton.innerHTML = "Added!";
        addButton.classList.add("added");
        setTimeout(() => {
          addButton.innerHTML = "add";
          addButton.classList.remove("added");
        }, 2000);
      } catch (error) {
        console.error("Error adding task:", error);
        notifyError("Error adding task. Please try again");
      }
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete("http://localhost:5000/clearall");
      console.log("Collection cleared successfully.");
      setTasks([]);
      notifySuccess("Successfully deleted");
    } catch (error) {
      console.error("Error clearing collection:", error);
      notifyError("Error clearing collection. Please try again");
    }
  };

  const timeFormatter = (timestamp) => {
    // Parsing the timestamp
    const createdAt = new Date(timestamp);

    // Formating Time (hours and minutes)
    const hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}.${formattedMinutes} ${ampm}`;

    // Formating Date (day, month, and year)
    const day = createdAt.getDate();
    const month = createdAt.toLocaleString("default", { month: "long" });
    const year = createdAt.getFullYear();
    const formattedDate = `${day}th, ${month} ${year}`;

    // Final formatted string
    const finalFormattedString = `${formattedTime} - ${formattedDate}`;

    return finalFormattedString;
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${taskId}`);
      console.log("Task deleted successfully.");
      fetchTasks();
      notifySuccess("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      notifyError("Error deleting task. Please try again");
    }
  };

  const handleToggleDropdown = (index) => {
    setShowDropdown((prevShowDropdown) => ({
      ...prevShowDropdown,
      [index]: !prevShowDropdown[index],
    }));
  };

  const handleStatusChange = async (event, taskId) => {
    const newStatus = event.target.value;

    try {
      await axios.put(`http://localhost:5000/update/${taskId}`, {
        status: newStatus,
      });
      fetchTasks(); // Refresh the task list
      notifySuccess("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      notifyError("Error updating status. Please try again");
    }
  };

  const notifyError = (error) => {
    toast.error(error, { position: toast.POSITION.BOTTOM_RIGHT });
  };

  const notifySuccess = (msg) => {
    toast.success(msg, { position: toast.POSITION.TOP_RIGHT });
  };

  return (
    <React.Fragment>
      <div className="wrapper">
        <div>
          <ToastContainer className="notifier" />
        </div>
        <div className="logo">Tudu</div>
        <div className="header">
          <div className="task-input">
            <input
              type="text"
              placeholder="Add a new task"
              className="input-text"
              value={inputText}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="add-task"
            onClick={handleAddClick}
            disabled={!inputText.trim()}
          >
            Add
          </button>
        </div>

        <div className="controls">
          <div className="filters">
            {spans.map((span, index) => (
              <span
                key={index}
                onClick={() => handleSpanClick(index)}
                className={
                  selectedSpan === index ? "selected-span" : "filters span"
                }
              >
                {span}
              </span>
            ))}
          </div>
          <button className="clear-btn" onClick={handleDeleteAll}>
            Clear all
          </button>
        </div>
        <ul className="task-box">
          {filteredTasks.map((task, index) => (
            <li className="task" key={index}>
              <div className="label">
                <label for={index}>
                  <div
                    className={
                      task.status === "completed"
                        ? "progress-completed"
                        : "progress-pending"
                    }
                    id={index}
                  ></div>
                  <p>{task.task}</p>
                </label>
                <div class="settings">
                  <spa>
                    <i
                      class="uil uil-pen"
                      onClick={() => handleToggleDropdown(index)}
                    ></i>
                  </spa>
                  <span>
                    <i
                      class="uil uil-trash"
                      onClick={() => handleTaskDelete(task._id)}
                    ></i>
                  </span>
                </div>
              </div>
              <div className="desc">{timeFormatter(task.createdAt)}</div>
              {showDropdown[index] && (
                <div className="dropdown">
                  <select
                    value={task.status}
                    onChange={(event) => handleStatusChange(event, task._id)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
}
