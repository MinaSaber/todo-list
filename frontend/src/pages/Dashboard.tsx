import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { fetchTasks, getLists } from "../services/api";
import { useEffect, useState } from "react";
import { Task } from "../types/dtos";
import { ListDto } from "../types/list.dto";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<ListDto[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState<boolean>(true);

  const fetchLists = async () => {
    try {
      const lists = await getLists();
      setLists(lists);
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Can't fetch lists.");
      }
    } finally {
      setIsLoadingLists(false);
    }
  };

  const handleTasks = async () => {
    try {
      const allTasks = await fetchTasks();

      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const isSameDay = (date1: Date, date2: Date) =>
        date1.toDateString() === date2.toDateString();

      const parsedTasks = allTasks.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));

      setTodayTasks(
        parsedTasks.filter((task) => isSameDay(task.dueDate, today))
      );
      setTomorrowTasks(
        parsedTasks.filter((task) => isSameDay(task.dueDate, tomorrow))
      );
      setUpcomingTasks(parsedTasks.filter((task) => task.dueDate > tomorrow));
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    handleTasks();
    fetchLists();
  }, []);

  return (
    <div className="flex relative w-full">
      <Sidebar
        todayTasks={todayTasks.length}
        tomorrowTasks={tomorrowTasks.length}
        upcomingTasks={upcomingTasks.length}
        lists={lists}
        loading={isLoadingLists}
      />
      <main className="flex-1 p-4">
        <Outlet
          context={{
            todayTasks,
            tomorrowTasks,
            upcomingTasks,
            lists,
          }}
        />
      </main>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
