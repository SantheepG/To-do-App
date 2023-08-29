const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://gshantheep:cinadoc@cluster0.cz7xwta.mongodb.net/Todo?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

// Todo Schema and Model
const todoSchema = new mongoose.Schema({
  task: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
});
const Todo = mongoose.model("todo", todoSchema);

// Create a new todo
app.post("/add", (req, res) => {
  const { task } = req.body;
  const newTodo = new Todo({
    task,
    status: "pending",
  });
  newTodo
    .save()
    .then(() => res.json("Todo added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/tasks", (req, res) => {
  Todo.find()
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Route to clear the collection
app.delete("/clearall", async (req, res) => {
  try {
    await Todo.deleteMany({});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Could not clear the collection." });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Route to clear a task
app.delete("/delete/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(taskId);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete the task." });
  }
});

app.put("/update/:id", async (req, res) => {
  const taskId = req.params.id;
  const newStatus = req.body.status;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      taskId,
      { status: newStatus },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not update the status." });
  }
});
