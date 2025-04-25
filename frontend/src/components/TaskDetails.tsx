import { Trash } from "lucide-react";
import { Task } from "../types/dtos";
import { deleteTask, updateTask } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { ConfirmationModal } from "./ConfirmationModal";

const TaskDetails = ({
  task,
  lists,
  onClose,
}: {
  task: Task;
  lists: any;
  onClose: () => void;
}) => {
  const [selectedListId, setSelectedListId] = useState<string>(
    task.listId ? task.listId._id : ""
  );
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(
    task.description || ""
  );
  const [dueDate, setDueDate] = useState<string>(
    task.dueDate
      ? typeof task.dueDate === "string"
        ? task.dueDate.substring(0, 10)
        : new Date(task.dueDate).toISOString().substring(0, 10)
      : ""
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleListChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedListId(event.target.value);
  };
  const handleDeleteTask = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(task._id);
      toast.success("Task deleted successfully!");
      window.location.reload();
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
    setShowConfirmation(false);
  };

  const handleSaveChanges = async () => {
    try {
      await updateTask(task._id, {
        title,
        description,
        dueDate,
        listId: selectedListId,
        priority: task.priority,
        status: task.status,
      });
      toast.success("Task updated successfully!");
      window.location.reload();
    } catch (err: any) {
      toast.error("Failed to update the task.");
    }
  };

  return (
    <div className="flex flex-col h-full gap-3 justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">Task:</h2>
          <button
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Renew driver’s license"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
          rows={3}
        />

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">List</label>
          <select
            value={selectedListId}
            onChange={handleListChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Select a list</option>
            {lists?.map((list: { _id: string; name: string }) => (
              <option key={list._id} value={list._id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <button
          className="flex items-center w-full gap-2 text-red-600 border cursor-pointer border-red-300 rounded-lg px-4 py-2 hover:bg-red-50 hover:border-red-400"
          onClick={handleDeleteTask}
        >
          <Trash className="w-4 h-4" />
          Delete Task
        </button>
        <button
          className="bg-amber-400 w-full hover:bg-amber-500 text-white rounded-lg px-4 py-2 cursor-pointer"
          onClick={handleSaveChanges}
        >
          Save changes
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmDelete}
      />

      <ToastContainer />
    </div>
  );
};

export default TaskDetails;
