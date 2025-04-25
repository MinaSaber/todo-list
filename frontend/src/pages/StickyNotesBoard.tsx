import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Task } from "../types/dtos";

type ContextType = {
  todayTasks: Task[];
  tomorrowTasks: Task[];
  upcomingTasks: Task[];
};

const getRandomColor = () => {
  const colors = [
    "bg-yellow-200",
    "bg-sky-100",
    "bg-rose-100",
    "bg-orange-200",
    "bg-teal-100",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-green-200",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const SkeletonLoader = () => (
  <div className="p-4 rounded-md shadow-sm bg-gray-200 animate-pulse">
    <div className="h-5 bg-gray-300 w-3/4 mb-2 rounded"></div>
    <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
  </div>
);

const StickyNotesBoard = () => {
  const { todayTasks, tomorrowTasks, upcomingTasks } =
    useOutletContext<ContextType>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      todayTasks.length > 0 ||
      tomorrowTasks.length > 0 ||
      upcomingTasks.length > 0
    ) {
      setLoading(false);
    }
  }, [todayTasks, tomorrowTasks, upcomingTasks]);

  const tasks = [...todayTasks, ...tomorrowTasks, ...upcomingTasks];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {loading
        ? [...Array(4)].map((_, idx) => <SkeletonLoader key={idx} />)
        : tasks.map((task, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-md shadow-sm ${getRandomColor()} whitespace-pre-line`}
            >
              <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
              <p className="text-sm">{task.description}</p>
            </div>
          ))}
    </div>
  );
};

export default StickyNotesBoard;
