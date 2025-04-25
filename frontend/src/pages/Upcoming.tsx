import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Task } from "../types/dtos";
import { ListDto } from "../types/list.dto";
import AddTaskModal from "../components/AddTaskModal";
import TaskDetails from "../components/TaskDetails";
import { toggleTaskStatus } from "../services/api";
import TaskCard from "../components/TaskCard";
import { TaskStatus } from "../types/task-status.enum";
import { toast, ToastContainer } from "react-toastify";

type ContextType = {
  tomorrowTasks: Task[];
  upcomingTasks: Task[];
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

const Upcoming = () => {
  const context = useOutletContext<ContextType>();
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTomorrowTasks(context.tomorrowTasks);
    setUpcomingTasks(context.upcomingTasks);
    setLoading(false);
  }, [context.tomorrowTasks, context.upcomingTasks]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await toggleTaskStatus(taskId, newStatus);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      setTomorrowTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      setUpcomingTasks((prev) =>
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
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    console.log(newTask);
    if (tomorrow.toDateString() === new Date(newTask.dueDate).toDateString()) {
      console.log("get hena");
      setTomorrowTasks((prev) => [newTask, ...prev]);
    } else if (
      tomorrow.toDateString() < new Date(newTask.dueDate).toDateString()
    ) {
      console.log("ro7t hnak");
      setUpcomingTasks((prev) => [newTask, ...prev]);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen flex flex-col lg:flex-row gap-5">
      {showModal && (
        <AddTaskModal
          show
          onSave={handleAddTask}
          onClose={closeModal}
          lists={context.lists}
        />
      )}

      <div className={`w-full rounded ${task ? "w-4/7" : ""}`}>
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          Upcoming
          <span className="bg-gray-200 text-black px-3 py-1 rounded-lg text-base">
            {context.tomorrowTasks.length + context.upcomingTasks.length}
          </span>
        </h1>

        <div className="flex flex-col gap-5">
          <div className="bg-white p-6 rounded-xl w-full shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Tomorrow</h2>
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
                tomorrowTasks.map((task) => (
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

          <div className="bg-white p-6 w-full rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
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
                upcomingTasks.map((task) => (
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
        </div>
      </div>

      {task && (
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm w-full lg:w-3/7">
          <TaskDetails
            task={task}
            lists={context.lists}
            onClose={() => setTask(null)}
          />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Upcoming;
