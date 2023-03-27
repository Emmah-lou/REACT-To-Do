const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};

const json = (response) => response.json();

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      newTodo: '',
      error: null,
      filter: 'all',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
    this.deletTask = this.deletTask.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }
  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    let { newTodo } = this.state;
    newTodo = newTodo.trim();
    if (newTodo.length === 0) {
      return;
    }
    fetch("https://fewd-todolist-api.onrender.com/tasks?api_key=130", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newTodo }),
    })
    .then(checkStatus)
    .then(json)
    .then((response) => {
      console.log(response);
      this.setState({ newTodo: "" });
      this.fetchTasks();
    })
    .catch((error) => {
      console.log(error);
    }
    );

  }
  fetchTasks() {
    fetch("https://fewd-todolist-api.onrender.com/tasks?api_key=130")
      .then(checkStatus)
      .then(json)
      .then((response) => {
        console.log(response);
        this.setState({ todos: response.tasks });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  deletTask(id) {
    if (!id) {
      return;
    }
    fetch(`https://fewd-todolist-api.onrender.com/tasks/${id}?api_key=130`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(checkStatus)
    .then(json)
    .then((response) => {
      this.fetchTasks();
    })
    .catch((error) => {
      this.setState({ error: error.message });
    });

  }
  toggleComplete(id, completed) {
    if (!id) {
      return;
    }
    const newState = completed ? "active" : "complete";
    
    fetch(`https://fewd-todolist-api.onrender.com/tasks/${id}/mark_${newState}?api_key=130`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkStatus)
      .then(json)
      .then((response) => {
        this.fetchTasks();
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: error.message });
      });


  }
  toggleFilter(e) {
    console.log(e.target.name);
    this.setState({ filter: e.target.name });
  }
  componentDidMount() {
    this.fetchTasks();

  }
  render() {
    const {newTodo, todos, filter} = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="mb-3">ToDo List</h2>
            <p>By: Emmah Lou Who</p>
            {todos.length > 0 ? todos.filter(todo => {
              if (filter === "all") {
                return true;
              } else if (filter === "active") {
                return !todo.completed;
              } else if (filter === "completed") {
                return todo.completed;
              }
            }).map((todo) => {
              return <Task
                key={todo.id} 
                task={todo}
                onDelete={this.deletTask}
                onComplete={this.toggleComplete}
                />;
            }) : <p>No todos yet!</p>}
            <div className="mt-3">
              <label>
                <input type="checkbox" name="all" checked={filter === "all"} onChange={this.toggleFilter} /> All
              </label>
              <label>
                <input type="checkbox" name="active" checked={filter === "active"} onChange={this.toggleFilter} /> Active
              </label>
              <label>
                <input type="checkbox" name="completed" checked={filter === "completed"} onChange={this.toggleFilter} /> Completed
              </label>
            </div>
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
               type="text"
               className="form-control mr-sm-2 mb-2"
               placeholder="new task"
               value={newTodo}
               onChange={this.handleChange}
                />
              <button type="submit" className="btn btn-primary mb-2">Add</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

class Task extends React.Component {
  render() {
    const {task, onDelete, onComplete } = this.props;
    const {id, content, completed} = task;
    return (
      <div className="row mb-1">
        <p className="col">{content}</p>
        <button
          className="d-inline-block mt-2"
          onClick={() => onDelete(id)}
        >Delete</button>
        {task.completed ? <p></p> : <button
          className="d-inline-block mt-2"
          type="text"
          onClick={() => onComplete(id, completed)}
          checked={completed}
         >Complete</button>}

        
      </div>
    );
  }
}


ReactDOM.render(
  <ToDoList />,
  document.getElementById('root')
);