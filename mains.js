var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var checkStatus = function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  throw new Error(response.status + ' - ' + response.statusText);
};

var json = function json(response) {
  return response.json();
};

var ToDoList = function (_React$Component) {
  _inherits(ToDoList, _React$Component);

  function ToDoList(props) {
    _classCallCheck(this, ToDoList);

    var _this = _possibleConstructorReturn(this, (ToDoList.__proto__ || Object.getPrototypeOf(ToDoList)).call(this, props));

    _this.state = {
      todos: [],
      newTodo: '',
      error: null,
      filter: 'all'
    };
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.fetchTasks = _this.fetchTasks.bind(_this);
    _this.deletTask = _this.deletTask.bind(_this);
    _this.toggleComplete = _this.toggleComplete.bind(_this);
    _this.toggleFilter = _this.toggleFilter.bind(_this);
    return _this;
  }

  _createClass(ToDoList, [{
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ newTodo: event.target.value });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      var _this2 = this;

      event.preventDefault();
      var newTodo = this.state.newTodo;

      newTodo = newTodo.trim();
      if (newTodo.length === 0) {
        return;
      }
      fetch("https://fewd-todolist-api.onrender.com/tasks?api_key=130", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: newTodo })
      }).then(checkStatus).then(json).then(function (response) {
        console.log(response);
        _this2.setState({ newTodo: "" });
        _this2.fetchTasks();
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'fetchTasks',
    value: function fetchTasks() {
      var _this3 = this;

      fetch("https://fewd-todolist-api.onrender.com/tasks?api_key=130").then(checkStatus).then(json).then(function (response) {
        console.log(response);
        _this3.setState({ todos: response.tasks });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'deletTask',
    value: function deletTask(id) {
      var _this4 = this;

      if (!id) {
        return;
      }
      fetch('https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=130', {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(checkStatus).then(json).then(function (response) {
        _this4.fetchTasks();
      }).catch(function (error) {
        _this4.setState({ error: error.message });
      });
    }
  }, {
    key: 'toggleComplete',
    value: function toggleComplete(id, completed) {
      var _this5 = this;

      if (!id) {
        return;
      }
      var newState = completed ? "active" : "complete";

      fetch('https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_' + newState + '?api_key=130', {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(checkStatus).then(json).then(function (response) {
        _this5.fetchTasks();
      }).catch(function (error) {
        console.log(error);
        _this5.setState({ error: error.message });
      });
    }
  }, {
    key: 'toggleFilter',
    value: function toggleFilter(e) {
      console.log(e.target.name);
      this.setState({ filter: e.target.name });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetchTasks();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var _state = this.state,
          newTodo = _state.newTodo,
          todos = _state.todos,
          filter = _state.filter;


      return React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-md-12' },
            React.createElement(
              'h2',
              { className: 'mb-3' },
              'ToDo List'
            ),
            React.createElement(
              'p',
              null,
              'By: Emmah Lou Who'
            ),
            todos.length > 0 ? todos.filter(function (todo) {
              if (filter === "all") {
                return true;
              } else if (filter === "active") {
                return !todo.completed;
              } else if (filter === "completed") {
                return todo.completed;
              }
            }).map(function (todo) {
              return React.createElement(Task, {
                key: todo.id,
                task: todo,
                onDelete: _this6.deletTask,
                onComplete: _this6.toggleComplete
              });
            }) : React.createElement(
              'p',
              null,
              'No todos yet!'
            ),
            React.createElement(
              'div',
              { className: 'mt-3' },
              React.createElement(
                'label',
                null,
                React.createElement('input', { type: 'checkbox', name: 'all', checked: filter === "all", onChange: this.toggleFilter }),
                ' All'
              ),
              React.createElement(
                'label',
                null,
                React.createElement('input', { type: 'checkbox', name: 'active', checked: filter === "active", onChange: this.toggleFilter }),
                ' Active'
              ),
              React.createElement(
                'label',
                null,
                React.createElement('input', { type: 'checkbox', name: 'completed', checked: filter === "completed", onChange: this.toggleFilter }),
                ' Completed'
              )
            ),
            React.createElement(
              'form',
              { onSubmit: this.handleSubmit, className: 'form-inline my-4' },
              React.createElement('input', {
                type: 'text',
                className: 'form-control mr-sm-2 mb-2',
                placeholder: 'new task',
                value: newTodo,
                onChange: this.handleChange
              }),
              React.createElement(
                'button',
                { type: 'submit', className: 'btn btn-primary mb-2' },
                'Add'
              )
            )
          )
        )
      );
    }
  }]);

  return ToDoList;
}(React.Component);

var Task = function (_React$Component2) {
  _inherits(Task, _React$Component2);

  function Task() {
    _classCallCheck(this, Task);

    return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
  }

  _createClass(Task, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          task = _props.task,
          onDelete = _props.onDelete,
          onComplete = _props.onComplete;
      var id = task.id,
          content = task.content,
          completed = task.completed;

      return React.createElement(
        'div',
        { className: 'row mb-1' },
        React.createElement(
          'p',
          { className: 'col' },
          content
        ),
        React.createElement(
          'button',
          {
            className: 'd-inline-block mt-2',
            onClick: function onClick() {
              return onDelete(id);
            }
          },
          'Delete'
        ),
        task.completed ? React.createElement('p', null) : React.createElement(
          'button',
          {
            className: 'd-inline-block mt-2',
            type: 'text',
            onClick: function onClick() {
              return onComplete(id, completed);
            },
            checked: completed
          },
          'Complete'
        )
      );
    }
  }]);

  return Task;
}(React.Component);

ReactDOM.render(React.createElement(ToDoList, null), document.getElementById('root'));