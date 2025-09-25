import React, { useEffect, useState } from "react";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${apiUrl}/tasks/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data.data);
    } catch (err) {
      console.log(err.message, err.stack);
    }
  };

  const handleCheckboxChange = (taskId, isChecked) => {
    if (isChecked) {
      setSelectedTasks((prev) => [...prev, taskId]);
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    }
  };

  return (
    <div className={tailwind.tasksArea}>
      {tasks?.map((task, i) => (
        <div className={tailwind.taskCont} key={i}>
          <div className="flex flex-row justify-between">
            <div priority={task.priority} className={tailwind.taskPriority}>
              <div className="flex items-center gap-x-2">
                <FaRegCircleDot />
                {task.priority.toUpperCase()}
              </div>
            </div>
            <input
              type="checkbox"
              className="hover:cursor-pointer"
              checked={selectedTasks.includes(task._id)}
              onChange={(e) => handleCheckboxChange(task._id, e.target.checked)}
            />
          </div>

          <h1 className={tailwind.taskHeader}>{task.title}</h1>

          <p>{task.description}</p>
        </div>
      ))}
      <IoIosAddCircle
        className="text-white fixed bottom-10 right-10 hover:scale-110 hover:cursor-pointer"
        size={50}
      />
    </div>
  );
};

export default Tasks;

const tailwind = {
  tasksArea: "mt-6 px-4 grid grid-cols-3 gap-8",
  taskCont:
    "bg-purple-500 text-white rounded-xl px-4 py-4 hover:cursor-pointer hover:scale-102 transform transition duration-300 ",
  taskHeader: "text-xl text-center mt-4 mb-4 font-semibold",
  taskPriority: "priority font-semibold text-sm",
};
