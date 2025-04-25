import React, { useState } from "react";
import { addTask } from "../services/api";
import { ListDto } from "../types/list.dto";
import { Task } from "../types/dtos";
import { TaskStatus } from "../types/task-status.enum";
import { TaskPriority } from "../types/task-priority.enum";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const AddTaskModal = ({
  show,
  onClose,
  onSave,
  lists,
}: {
  show: true;
  onClose: () => void;
  onSave: (task: Task) => void;
  lists: ListDto[];
}) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    listId: "",
    priority: "",
    status: TaskStatus.PENDING,
  });
  const [saving, setSaving] = useState(false);

  if (!show) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const createTask = async () => {
    setSaving(true);
    try {
      const res = await addTask(task);
      onSave(res);
      onClose();
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  const isFormInvalid = () => {
    return (
      task.title.trim() === "" ||
      task.dueDate.trim() === "" ||
      task.priority.trim() === ""
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50 transition-opacity duration-300 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ✨ Add New Task
        </h2>

        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Task Name
            </label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg px-4 py-2 text-gray-800 placeholder:text-sm placeholder-gray-400 outline-none"
              placeholder="e.g. Create content plan"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg px-4 py-2 text-gray-800 placeholder:text-sm placeholder-gray-400 outline-none"
              placeholder="Write task details here..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg px-4 py-2 text-gray-800"
            >
              <option value="" disabled>
                Select priority
              </option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.LOW}>Low</option>
            </select>
          </div>

          {/* List */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              List
            </label>
            <select
              name="listId"
              value={task.listId}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg px-4 py-2 text-gray-800"
            >
              {lists.length === 0 ? (
                <option>No lists available</option>
              ) : (
                <>
                  <option value="" disabled>
                    Select a list
                  </option>
                  {lists.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg px-4 py-2 text-gray-800"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-8 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={createTask}
            disabled={isFormInvalid() || saving}
            className={`w-full text-white font-semibold py-3 rounded-lg transition
    ${
      isFormInvalid() || saving
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
    }`}
          >
            {saving ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Save Task"
            )}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddTaskModal;
