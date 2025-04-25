import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";
import { Task } from "../types/dtos";
import { getListWithTasks, toggleTaskStatus } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import TaskCard from "./TaskCard";
import TaskDetails from "./TaskDetails";
import { ListDto } from "../types/list.dto";
import { TaskStatus } from "../types/task-status.enum";

type ContextType = {
  lists: ListDto[];
};

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-100 animate-pulse rounded-lg px-4 py-3"
      >
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 rounded-full bg-gray-300"></div>
          <div className="w-32 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);

const TasksList = () => {
  const { listId } = useParams();
  const context = useOutletContext<ContextType>();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [task, setTask] = useState<Task | null>(null);

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

  const [tasks, setTasks] = useState<Task[]>([]);
  const [listName, setListName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const getTasks = async () => {
    if (!listId) return;
    try {
      const list = await getListWithTasks(listId);
      setListName(list.name);
      setTasks(list.tasks);
      setLoading(false);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  const handleAddTask = (newTask: Task) => {
    if (newTask.listId === listId) {
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  useEffect(() => {
    getTasks();
  }, [listId]);

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
        {loading ? (
          <div className="w-32 h-6 bg-gray-300 animate-pulse rounded"></div>
        ) : (
          <>
            {listName}
            <span className="bg-gray-200 text-black px-3 py-1 rounded-lg text-base">
              {tasks.length}
            </span>
          </>
        )}
      </h1>

      <div className="flex flex-col md:flex-row justify-between gap-5">
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

export default TasksList;
