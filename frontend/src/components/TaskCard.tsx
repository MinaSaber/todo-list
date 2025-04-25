import { AlertTriangle } from "lucide-react";
import { TaskStatus } from "../types/task-status.enum";
import { TaskPriority } from "../types/task-priority.enum";
import { Task } from "../types/dtos";

type TaskCardProps = {
  task: Task;
  onChangeStatus: (taskId: string, newStatus: TaskStatus) => void;
  onViewDetails: (taskId: string) => void;
};

const TaskCard = ({ task, onChangeStatus, onViewDetails }: TaskCardProps) => {
  const getPriorityIcon = (priority: string) => {
    const priorityColor = {
      [TaskPriority.HIGH]: "text-red-500",
      [TaskPriority.MEDIUM]: "text-orange-500",
      [TaskPriority.LOW]: "text-yellow-500",
    }[priority];

    return (
      <AlertTriangle className={`w-5 h-5 ${priorityColor}`}>
        <title>{`${priority}`}</title>
      </AlertTriangle>
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center p-4 rounded-2xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 w-full max-w-full">
      {/* Left Content */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          {getPriorityIcon(task.priority)}
          <h3
            className={`text-lg font-semibold ${
              task.status === TaskStatus.COMPLETED
                ? "text-gray-400 line-through"
                : "text-gray-800"
            }`}
          >
            {task.title}
          </h3>
        </div>
        {task.description && (
          <p className="text-sm text-gray-500">{task.description}</p>
        )}
      </div>

      {/* Right Content */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
        <select
          value={task.status}
          onChange={(e) =>
            onChangeStatus(task._id, e.target.value as TaskStatus)
          }
          className="bg-white border border-gray-300 text-sm px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all w-full md:w-auto"
        >
          <option value={TaskStatus.PENDING}>🕒 Pending</option>
          <option value={TaskStatus.COMPLETED}>✅ Completed</option>
        </select>

        <button
          onClick={() => onViewDetails(task._id)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-lg transition-colors duration-200"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
