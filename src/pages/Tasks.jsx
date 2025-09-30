import axios from "axios";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { RiCloseLine } from "react-icons/ri";

const apiUrl = import.meta.env.VITE_API_URL;

const addSchema = Yup.object({
  title: Yup.string()
    .max(50, "Minmum of 50 characters")
    .required("A task must have a title"),
  description: Yup.string().required("A task must have a description"),
});
const Tasks = () => {
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalLoad, setEditModalLoad] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // useEffect(() => {
  //   console.log(selectedTasks);
  // }, [selectedTasks]);
  // useEffect(() => {
  //   console.log(openDeleteModal);
  // }, [openDeleteModal]);

  // useEffect(() => {
  //   console.log(taskToEdit);
  // }, [taskToEdit]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      setTasksLoading(true);
      const response = await axios.get(`${apiUrl}/tasks/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data.data);
    } catch (err) {
      console.log(err.message, err.stack);
    } finally {
      setTasksLoading(false);
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
      setOpenDeleteModal(true);
    } else {
      setOpenDeleteModal(false);
    }
  };

  const handleDeletion = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("token", token);
      setDeleteLoading(true);
      const response = await axios.delete(`${apiUrl}/tasks/`, {
        data: { taskIds: selectedTasks },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
      setOpenDeleteModal(false);
      setSelectedTasks([]);
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const initialValues = {
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    status: "",
    priority: "",
  };

  const InitialEditValues = {
    title: taskToEdit?.title,
    description: taskToEdit?.description,
    date: taskToEdit?.dueDate.slice(0, 10),
    status: taskToEdit?.status === true ? "completed" : "in-progress",
    priority: taskToEdit?.priority,
  };

  const handleAddSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        status: values.status === "completed",
      };
      await axios.post(`${apiUrl}/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      setOpenAddModal(false);
      fetchTasks();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  const handleEditSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        status: values.status === "completed",
      };
      await axios.patch(`${apiUrl}/tasks/${taskToEdit._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchTasks();
    } catch (error) {
      console.log(error);
    } finally {
      setOpenEditModal(false);
      setSubmitting(false);
    }
  };

  const editTaskFetch = async (taskId) => {
    try {
      setOpenEditModal(true);
      setEditModalLoad(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTaskToEdit(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setEditModalLoad(false);
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
            className={tailwind.iconButtons}
            size={40}
            onClick={handleDeleteIcon}
          />
        )}
      </div>

      {tasksLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className={tailwind.tasksArea}>
        {tasks?.map((task, i) => (
          <div
            className={tailwind.taskCont}
            key={i}
            onClick={() => {
              editTaskFetch(task._id);
            }}
          >
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
                onClick={(e) => e.stopPropagation()}
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
          <IoIosAddCircle
            className={tailwind.iconButtons}
            size={45}
            onClick={() => setOpenAddModal(true)}
          />
        </div>
        {/* Modal Window */}
        {/* Delete Modal */}
        {openDeleteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-purple-500 rounded-2xl shadow-xl p-6 w-[40%] text-center">
              <h2 className="text-2xl font-semibold mb-4 text-white">Delete</h2>
              <p className="text-white mb-6">
                Are you sure you want to delete the selected items?
              </p>
              <div className="flex justify-between w-[40%] mx-auto">
                <button
                  onClick={handleDeletion}
                  className="bg-green-500 text-white font-semibold px-6 py-1 rounded-lg hover:scale-105 hover:cursor-pointer flex items-center"
                >
                  {deleteLoading ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    "Yes"
                  )}
                </button>
                <button
                  className="bg-red-500 text-white font-semibold px-6 py-1 rounded-lg hover:scale-105 hover:cursor-pointer"
                  onClick={() => {
                    setOpenDeleteModal(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add Modal */}
        {openAddModal && (
          <div className={tailwind.modalBackground}>
            <div className={tailwind.modalContainer}>
              <RiCloseLine
                size={30}
                onClick={() => setOpenAddModal(false)}
                className={tailwind.modalClose}
              />
              <h1 className={tailwind.modalHeader}>Add Task</h1>
              <Formik
                initialValues={initialValues}
                validationSchema={addSchema}
                validateOnBlur
                validateOnChange
                onSubmit={handleAddSubmit}
              >
                {({ isSubmitting, isValid, touched, errors, status }) => (
                  <Form noValidate className={tailwind.modalFormContainer}>
                    <div>
                      <label className={tailwind.modalFormLabel}>Title</label>
                      <Field
                        name="title"
                        placeholder="type title here..."
                        type="text"
                        className="w-full bg-white p-2 rounded"
                      />
                      <ErrorMessage
                        className="text-red-600"
                        name="title"
                        component="div"
                      />
                    </div>
                    <div>
                      <label className={tailwind.modalFormLabel}>
                        Description
                      </label>
                      <Field
                        name="description"
                        placeholder="type description here..."
                        as="textarea"
                        className="w-full bg-white p-2 rounded h-32"
                      />
                      <ErrorMessage
                        className="text-red-600"
                        name="description"
                        component="div"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className={tailwind.modalFormLabel}>
                        Due Date
                      </label>
                      <Field
                        name="date"
                        type="date"
                        className="bg-white p-2 rounded hover:cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className={tailwind.modalFormLabel}>Status</label>
                      <Field
                        name="status"
                        as="select"
                        className="bg-white p-2 rounded hover:cursor-pointer"
                      >
                        <option value="">Select Status</option>
                        <option value="completed">Completed</option>
                        <option value="in-progress">In-progress</option>
                      </Field>
                    </div>
                    <div className="flex flex-col">
                      <label className={tailwind.modalFormLabel}>
                        Priority
                      </label>
                      <Field
                        name="priority"
                        as="select"
                        className="bg-white p-2 rounded hover:cursor-pointer"
                      >
                        <option value="">Select Priority</option>
                        <option value="low">low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </Field>
                    </div>
                    <button
                      type="submit"
                      className={tailwind.modalSubmitContainer}
                    >
                      {isSubmitting ? (
                        <div class="w-6 h-6 border-2  border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        {openEditModal && (
          <div className={tailwind.modalBackground}>
            <div className={tailwind.modalContainer}>
              <RiCloseLine
                size={30}
                onClick={() => setOpenEditModal(false)}
                className={tailwind.modalClose}
              />
              <h1 className={tailwind.modalHeader}>Edit Task</h1>
              {editModalLoad ? (
                <div className="my-6 text-white w-6 h-6 border-3 mx-auto border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Formik
                  initialValues={InitialEditValues}
                  validationSchema={addSchema}
                  validateOnBlur
                  validateOnChange
                  onSubmit={handleEditSubmit}
                >
                  {({ isSubmitting, isValid, touched, errors, status }) => (
                    <Form noValidate className={tailwind.modalFormContainer}>
                      <div>
                        <label className={tailwind.modalFormLabel}>Title</label>
                        <Field
                          name="title"
                          placeholder="type title here..."
                          type="text"
                          className="w-full bg-white p-2 rounded"
                        />
                        <ErrorMessage
                          className="text-red-600"
                          name="title"
                          component="div"
                        />
                      </div>
                      <div>
                        <label className={tailwind.modalFormLabel}>
                          Description
                        </label>
                        <Field
                          name="description"
                          placeholder="type description here..."
                          as="textarea"
                          className="w-full bg-white p-2 rounded h-32"
                        />
                        <ErrorMessage
                          className="text-red-600"
                          name="description"
                          component="div"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className={tailwind.modalFormLabel}>
                          Due Date
                        </label>
                        <Field
                          name="date"
                          type="date"
                          className="bg-white p-2 rounded hover:cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className={tailwind.modalFormLabel}>
                          Status
                        </label>
                        <Field
                          name="status"
                          as="select"
                          className="bg-white p-2 rounded hover:cursor-pointer"
                        >
                          <option value="">Select Status</option>
                          <option value="completed">Completed</option>
                          <option value="in-progress">In-progress</option>
                        </Field>
                      </div>
                      <div className="flex flex-col">
                        <label className={tailwind.modalFormLabel}>
                          Priority
                        </label>
                        <Field
                          name="priority"
                          as="select"
                          className="bg-white p-2 rounded hover:cursor-pointer"
                        >
                          <option value="">Select Priority</option>
                          <option value="low">low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </Field>
                      </div>
                      <button
                        type="submit"
                        className={tailwind.modalSubmitContainer}
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-2  border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
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
  iconButtons:
    "text-white hover:scale-110 hover:cursor-pointer transform transition duration-300",
  modalFormLabel: "font-semibold text-white",
  modalBackground:
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 w-full",
  modalContainer: "p-5 bg-purple-500 rounded w-[50%] relative",
  modalClose:
    "absolute top-4 right-4 text-white hover:cursor-pointer hover:scale-110",
  modalHeader: "text-white text-xl font-semibold text-center",
  modalFormContainer: "mt-2 flex flex-col gap-y-4",
  modalSubmitContainer:
    "mt-6 flex flex-col items-center rounded bg-white text-purple-600 w-[30%] py-1 mx-auto font-semibold hover:cursor-pointer hover:scale-105 hover:text-white hover:bg-purple-600",
};
