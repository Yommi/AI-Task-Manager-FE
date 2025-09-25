import React, { useEffect, useState } from "react";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    console.log(selectedTasks);
  }, [selectedTasks]);
  useEffect(() => {
    console.log(openDelete);
  }, [openDelete]);

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

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = tasks.map((task) => task._id);
      setSelectedTasks(allIds);
    } else {
      setSelectedTasks([]);
    }
  };

  const handleDeleteIcon = () => {
    if (selectedTasks.length > 0) {
      setOpenDelete(true);
    } else {
      setOpenDelete(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between m-4">
        <div className="flex flex-row gap-2 justify-center items-center">
          <label className="text-white">Select/Deselect All</label>
          <input
            type="checkbox"
            checked={tasks.length > 0 && selectedTasks.length === tasks.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        </div>
        {selectedTasks.length > 0 && (
          <MdDeleteForever
            className={tailwind.buttons}
            size={40}
            onClick={handleDeleteIcon}
          />
        )}
      </div>
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
                onChange={(e) =>
                  handleCheckboxChange(task._id, e.target.checked)
                }
              />
            </div>

            <h1 className={tailwind.taskHeader}>{task.title}</h1>

            <p>{task.description}</p>
          </div>
        ))}
        <div className="fixed bottom-10 right-10">
          <IoIosAddCircle className={tailwind.buttons} size={45} />
        </div>
        {/* Modal Window */}
        {openDelete && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-purple-500 rounded-2xl shadow-xl p-6 w-[40%] text-center">
              <h2 className="text-2xl font-semibold mb-4 text-white">Delete</h2>
              <p className="text-white mb-6">
                Are you sure you want to delete the selected items?
              </p>
              <div className="flex justify-between w-[40%] mx-auto">
                <button className="bg-green-500 text-black font-semibold px-6 py-1 rounded-lg hover:scale-105 hover:cursor-pointer">
                  Yes
                </button>
                <button
                  className="bg-red-500 text-black font-semibold px-6 py-1 rounded-lg hover:scale-105 hover:cursor-pointer"
                  onClick={() => {
                    setOpenDelete(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

const tailwind = {
  tasksArea: "px-4 grid grid-cols-3 gap-8",
  taskCont:
    "bg-purple-500 text-white rounded-xl px-4 py-4 hover:cursor-pointer hover:scale-102 transform transition duration-300 ",
  taskHeader: "text-xl text-center mt-4 mb-4 font-semibold",
  taskPriority: "priority font-semibold text-sm",
  buttons:
    "text-white hover:scale-110 hover:cursor-pointer transform transition duration-300",
};
