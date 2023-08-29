import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Main.css";

export default function Main() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/tasks"); // API endpoint
    setTasks(response.data);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <React.Fragment>
      <div className="wrapper">
        <div class="task-input">
          <input type="text" placeholder="Add a new task"></input>
        </div>

        <div className="controls">
          <div className="filters">
            <span
              onClick={() => handleFilterChange("all")}
              className={filter === "all" ? "active" : ""}
            >
              All
            </span>
            <span
              onClick={() => handleFilterChange("pending")}
              className={filter === "pending" ? "active" : ""}
            >
              Pending
            </span>
            <span
              onClick={() => handleFilterChange("completed")}
              className={filter === "completed" ? "active" : ""}
            >
              Completed
            </span>
          </div>
          <button className="clear-btn">Clear All</button>
        </div>
        <ul className="task-box">
          {filteredTasks.map((task, index) => (
            <li key={index}>{task.task}</li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
}





import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Main.css";

export default function Main() {
  const spans = ["All", "Pending", "Completed"];
  const [selectedSpan, setSelectedSpan] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    
  }, []);

  const fetchTasks = async () =>{
    const response = await axios.get("http://localhost:5000/tasks")
  }
  const handleSpanClick = (index) => {
    setSelectedSpan(index);
  };

  const handlFilterChange = (newFilter) =>{
    setFilter(newFilter);
  };
  
  const filteredTasks = tasks.filter((task) => {
    if(filter === "all") return true;
    return task.status ===filter;
  })
  
  return (
    <React.Fragment>
      <div className="wrapper">
        <div class="task-input">
          <input type="text" placeholder="Add a new task"></input>
        </div>
        <div className="controls">
          <div className="filters">
            {spans.map((span, index) => (
              <span
                key={index}
                onClick={() => handleSpanClick(index)}
                className={selectedSpan === index ? "selected-span" : ""}
              >
                {span}
              </span>
            ))}
          </div>
          <button className="clear-btn">Clear all</button>
        </div>
      </div>
    </React.Fragment>
  );
}
