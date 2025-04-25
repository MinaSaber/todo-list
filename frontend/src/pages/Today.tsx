import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Task } from "../types/dtos";
import AddTaskModal from "../components/AddTaskModal";
import TaskCard from "../components/TaskCard";
import { toggleTaskStatus } from "../services/api";
import { TaskStatus } from "../types/task-status.enum";
import TaskDetails from "../components/TaskDetails";
import { ListDto } from "../types/list.dto";
import { toast, ToastContainer } from "react-toastify";

type ContextType = {
  todayTasks: Task[];
  lists: ListDto[];
};

const SkeletonLoader = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-200 animate-pulse rounded-lg px-2 py-2"
      >
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);

const Today = () => {
  const context = useOutletContext<ContextType>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(context.todayTasks);
    setLoading(false);
  }, [context.todayTasks]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await toggleTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleAddTask = (newTask: Task) => {
    const today = new Date();
    if (today.toDateString() === new Date(newTask.dueDate).toDateString()) {
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {showModal && (
        <AddTaskModal
          show
          onClose={closeModal}
          onSave={handleAddTask}
          lists={context.lists}
        />
      )}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        Today
        <span className="bg-gray-200 text-black px-3 py-1 rounded-lg text-base">
          {tasks.length}
        </span>
      </h1>
      <div className="flex gap-5 h-full flex-col md:flex-row">
        <div
          className={`bg-white p-6 rounded-xl shadow-sm mb-8 ${
            task ? "lg:w-2/3" : "w-full"
          }`}
        >
          <div className="space-y-3">
            <div
              className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-black"
              onClick={openModal}
            >
              <span className="text-xl font-bold">+</span>
              <span>Add New Task</span>
            </div>
            {loading ? (
              <SkeletonLoader />
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onChangeStatus={handleStatusChange}
                  onViewDetails={() => setTask(task)}
                />
              ))
            )}
          </div>
        </div>

        {task && (
          <div
            className={`bg-gray-50 p-6 rounded-xl shadow-sm ${
              task ? "lg:w-1/3" : "w-full"
            }`}
          >
            <TaskDetails
              task={task}
              lists={context.lists}
              onClose={() => setTask(null)}
            />
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Today;
