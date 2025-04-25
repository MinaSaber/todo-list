import { useState, useEffect } from "react";
import AddTaskModal from "../components/AddTaskModal";
import { useOutletContext } from "react-router-dom";
import { Task } from "../types/dtos";
import { ListDto } from "../types/list.dto";
import TaskDetails from "../components/TaskDetails";
import TaskCard from "../components/TaskCard";
import { toggleTaskStatus } from "../services/api";
import { TaskStatus } from "../types/task-status.enum";
import { toast, ToastContainer } from "react-toastify";

type ContextType = {
  todayTasks: Task[];
  tomorrowTasks: Task[];
  upcomingTasks: Task[];
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

const AllTasksPage = () => {
  const context = useOutletContext<ContextType>();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadTasks = () => {
      const allTasks = [
        ...context.todayTasks,
        ...context.tomorrowTasks,
        ...context.upcomingTasks,
      ];
      setTasks(allTasks);
      setLoading(false);
    };

    loadTasks();
  }, [context.todayTasks, context.tomorrowTasks, context.upcomingTasks]);

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

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-h-screen flex flex-col gap-8">
      {showModal && (
        <AddTaskModal
          show
          onClose={() => setShowModal(false)}
          onSave={handleAddTask}
          lists={context.lists}
        />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold items-center justify-center flex text-gray-800">
          All Tasks
          <span className="bg-gray-200 text-gray-700 px-3 items-center py-1 rounded-full text-sm ml-3">
            {tasks.length}
          </span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-white shadow rounded-xl border border-gray-200">
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-sm font-medium text-gray-600">Filter:</label>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as TaskStatus | "all")
            }
          >
            <option value="all">All Tasks</option>
            <option value={TaskStatus.PENDING}>Pending</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-1/2">
          <label className="sr-only" htmlFor="task-search">
            Search tasks
          </label>
          <input
            id="task-search"
            type="text"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex gap-6 md:flex-row flex-col h-full">
        <div className={`space-y-3 ${task ? "lg:w-2/3" : "w-full"}`}>
          <div
            className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-black"
            onClick={() => setShowModal(true)}
          >
            <span className="text-xl font-bold">+</span>
            <span>Add New Task</span>
          </div>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-gray-500 text-center py-8 rounded-lg bg-white shadow-md">
                  No tasks found.
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onChangeStatus={handleStatusChange}
                    onViewDetails={() => setTask(task)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {task && (
          <div
            className={`bg-gray-50 p-6 rounded-xl shadow-sm ${
              task ? "lg:w-1/3" : "w-full"
            } overflow-y-auto max-h-[calc(100vh-150px)]`}
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

export default AllTasksPage;
