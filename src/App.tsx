import React, { useEffect, useState } from "react";

type TaskType = {
  id: string;
  todo: string;
  date: string;
  isDone: boolean;
};

type TasksList = TaskType[];

type TaskProps = {
  task: TaskType;
  onchange: () => void;
  onremove: () => void;
};

function App() {
  const [isCompleted, setIsCompletede] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<TasksList>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();

    if (newTask !== "") {
      const newId = crypto.randomUUID();
      const newDate = getCurrentDate();
      const newTaskObj = {
        id: newId,
        todo: newTask,
        date: newDate,
        isDone: false,
      };

      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    }
  };

  const handleCheck = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, isDone: !task.isDone };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const handleRemove = (id: string) => {
    const remainingTasks = tasks.filter((task) => task.id !== id);
    setTasks(remainingTasks);
  };

  const getCurrentDate = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = today.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  return (
    <div className="container mx-auto px-1 py-3 lg:max-w-5xl sm:px-5">
      <header className="sticky top-0 bg-white">
        <h1 className="text-2xl">To-Do List</h1>
        <span className="">Describe your list...</span>
        <form className="flex gap-1 flex-col sm:flex-row">
          <input
            className="grow px-4 py-1 border-gray-300 border outline-none focus:border-blue-500"
            type="text"
            placeholder="Add a task..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTask(e.target.value)
            }
            value={newTask}
          />
          <button
            className="bg-blue-500 text-white px-5 py-1 transition-all duration-150 ease-in-out hover:bg-blue-600"
            onClick={handleAddTask}
          >
            Add
          </button>
        </form>

        <ul className="flex gap-9 mt-7 justify-center sm:justify-start">
          <button
            className={`${
              !isCompleted
                ? "text-black border-b-blue-500 border-b-4"
                : "text-gray-400 border-b-0"
            } cursor-pointer border border-t-0 border-r-0  border-l-0  transition-all duration-150 ease-in`}
            onClick={() => setIsCompletede(false)}
          >
            All Tasks ({tasks.filter((task) => task.isDone === false).length})
          </button>
          <button
            className={`${
              isCompleted
                ? "text-black  border-b-blue-500 border-b-4"
                : "text-gray-400 border-b-0"
            } cursor-pointer border border-t-0 border-r-0  border-l-0 transition-all duration-150 ease-in`}
            onClick={() => setIsCompletede(true)}
          >
            Completed ({tasks.filter((task) => task.isDone === true).length})
          </button>
        </ul>
      </header>

      <div className=" mt-3">
        {!isCompleted ? (
          <div>
            {tasks
              .filter((task) => task.isDone === false)
              .map((todo) => (
                <Task
                  task={todo}
                  key={todo.id}
                  onchange={() => handleCheck(todo.id)}
                  onremove={() => handleRemove(todo.id)}
                />
              ))}
          </div>
        ) : (
          <div>
            {tasks
              .filter((task) => task.isDone === true)
              .map((todo) => (
                <Task
                  task={todo}
                  key={todo.id}
                  onchange={() => handleCheck(todo.id)}
                  onremove={() => handleRemove(todo.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Task = ({ task, onchange, onremove }: TaskProps) => {
  return (
    <div className="flex gap-4 items-start p-3 border border-b-gray-200">
      <span>
        <input
          className="w-4 h-4"
          type="checkbox"
          name="done"
          id="done"
          checked={task.isDone}
          onChange={onchange}
        />
      </span>

      <div className="leading-3">
        <p className="leading-none text-lg">{task.todo}</p>
        <span className="text-gray-400 text-sm inline-block mt-2">
          Created {task.date}
        </span>
      </div>

      <button
        className="ml-auto bg-red-400 px-2 py-1  text-white transition-all duration-150 ease-in-out hover:bg-red-500 "
        onClick={onremove}
      >
        Delete
      </button>
    </div>
  );
};

export default App;
