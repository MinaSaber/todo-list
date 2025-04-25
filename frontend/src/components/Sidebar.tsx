import { ChangeEvent, useEffect, useState } from "react";
import { Menu, Settings, LogOut, X, Plus } from "lucide-react";
import { addList, logout } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { ListDto } from "../types/list.dto";
import { toast } from "react-toastify";
import { CreateListDto } from "../types/create-list.dto";

type SidebarProps = {
  todayTasks: number;
  tomorrowTasks: number;
  upcomingTasks: number;
  lists: ListDto[];
  loading: boolean;
};

const Sidebar = ({
  todayTasks,
  tomorrowTasks,
  upcomingTasks,
  lists,
  loading,
}: SidebarProps) => {
  const [active, setActive] = useState("Tasks");
  const [isOpen, setIsOpen] = useState(true);
  const tasks = ["Tasks", "Today", "Upcoming", "Sticky"];
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const pathFromUrl = location.pathname.split("/").pop();
    if (pathFromUrl) {
      setActive(pathFromUrl.charAt(0).toUpperCase() + pathFromUrl.slice(1));
    }
  }, []);

  const [isAddingList, setIsAddingList] = useState(false);
  const [list, setList] = useState<CreateListDto>({
    name: "",
    color: "#facc15",
  });

  const handleCreateList = async () => {
    if (!list.name.trim()) return;
    try {
      const res = await addList(list);
      lists.push({
        _id: res._id,
        name: res.name,
        color: res.color,
        taskCount: "0",
      });
    } catch (err: any) {
      toast.error("error");
    } finally {
      setList({
        name: "",
        color: "#facc15",
      });
      setIsAddingList(false);
    }
  };

  const handleSettingsNavigation = () => {
    navigate("/dashboard/settings");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateList();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const onItemClick = (path: string) => {
    setActive(path);
    navigate(`/dashboard/${path.toLowerCase()}`);
  };

  const onListClick = (listId: string) => {
    navigate(`/dashboard/lists/${listId}`);
  };

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setList({ ...list, [e.target.name]: e.target.value });
  };

  return (
    <>
      {!isOpen ? (
        <aside className="bg-gray-50 h-auto mb-10 p-4 shadow-md my-4 flex flex-col justify-between">
          <button className="cursor-pointer" onClick={handleMenuClick}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col gap-2 text-sm">
            <button
              onClick={handleSettingsNavigation}
              className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              className="flex items-center gap-2 hover:text-red-500 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>
      ) : (
        <aside
          className={`fixed sm:static top-0 left-0 z-50 w-64 sm:w-80 bg-gray-50 h-full sm:min-h-screen p-4 shadow-md flex flex-col gap-6 transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        >
          <button
            className="flex justify-between items-center cursor-pointer"
            onClick={handleMenuClick}
          >
            <h1 className="text-xl font-bold">Menu</h1>
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-medium mb-2 text-gray-500">TASKS</h2>
            {tasks.map((task, index) => (
              <div
                key={index}
                onClick={() => onItemClick(task)}
                className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer ${
                  active === task
                    ? "bg-gray-200 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{task}</span>
                {task === "Tasks" && (
                  <span className="text-xs">
                    {todayTasks + tomorrowTasks + upcomingTasks}
                  </span>
                )}
                {task === "Upcoming" && (
                  <span className="text-xs">
                    {tomorrowTasks + upcomingTasks}
                  </span>
                )}
                {task === "Today" && (
                  <span className="text-xs">{todayTasks}</span>
                )}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-sm font-medium mb-2 text-gray-500">LISTS</h2>
            {loading ? (
              [...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2 py-1 animate-pulse"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-6 h-4 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : lists.length > 0 ? (
              lists.map((list) => (
                <div
                  key={list._id}
                  onClick={() => onListClick(list._id)}
                  className={`flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded cursor-pointer ${
                    active === list.name ? "bg-gray-200 font-medium" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: list.color }}
                    ></div>
                    <span>{list.name}</span>
                  </div>
                  <span className="text-xs">{list.taskCount}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-400 ml-2">No lists found.</div>
            )}
            {isAddingList ? (
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="text"
                  name="name"
                  value={list.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="List name"
                  className="flex-1 border !w-10 border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="color"
                  name="color"
                  value={list.color}
                  onChange={handleChange}
                  title="Choose color"
                  className="!w-7 !h-8 !p-0 border-none cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-gray-50"
                />
                <button
                  onClick={handleCreateList}
                  className="text-green-600 hover:text-green-800 transition p-2 rounded-md cursor-pointer"
                  title="Add list"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => {
                    setIsAddingList(false);
                    setList({ name: "", color: "" });
                  }}
                  className="text-red-500 hover:text-red-700 transition p-2 rounded-md cursor-pointer"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                className="text-sm text-blue-500 mt-2 hover:underline ml-2"
                onClick={() => setIsAddingList(true)}
              >
                + Add New List
              </button>
            )}
          </div>
          <div className="mt-auto flex flex-col gap-2 text-sm">
            <button
              className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
              onClick={handleSettingsNavigation}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              className="flex items-center gap-2 hover:text-red-500 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
