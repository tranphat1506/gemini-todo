import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { useAppSelector } from "@/hooks/storeHooks";
import { getFirstName } from "@/utils/string";
import SearchBar from "@/features/search/SearchBar";

import {
  createMockTodos,
  createMockReminders,
  mockTags,
  mockProjects,
} from "@/features/todos/utils/mock.data.generator";

import {
  toTodoViewModel,
  toReminderViewModel,
} from "@/features/todos/utils/mappers";

import { getTodayTodos } from "@/features/todos/utils/todo.helpers";
import RemindersSection from "@/features/todos/RemindersSection";
import TodosList from "@/features/todos/TodosList";
import Accordion from "@/components/Accordion";
import { PiPlus } from "react-icons/pi";
import AddTodoButton from "@/features/todos/AddTodoButton";

const HomePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [todos, setTodos] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);

  const firstName = getFirstName(user?.displayName ?? "");

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((res) => setTimeout(res, 500));

      const { todos: todoEntities, tasks } = createMockTodos();
      const reminderEntities = createMockReminders(10);

      // map sang view model
      const todoVMs = todoEntities.map((t) =>
        toTodoViewModel(t, tasks, mockTags, mockProjects)
      );
      const reminderVMs = reminderEntities.map((r) =>
        toReminderViewModel(r, tasks, mockTags)
      );

      setTodos(getTodayTodos(todoVMs));
      setReminders(reminderVMs);
    };

    fetchData();
  }, []);

  return (
    <Container className="px-6 py-8 sm:py-4 sm:px-2 flex flex-col h-full text-white w-7xl">
      {/* Search */}
      <div className="mb-6 sm:mb-2">
        <SearchBar />
      </div>

      <div className="mb-6 sm:mb-2 sm:bg-[#111] sm:p-6 sm:rounded-2xl flex justify-between items-center flex-wrap gap-4">
        {/* Welcome */}
        <div className="welcome">
          <h2 className="text-3xl text-white font-semibold">
            Chào buổi sáng, {firstName}!
          </h2>
          <p className="text-md text-gray-400">Bạn sẽ làm gì hôm nay?</p>
        </div>

        {/* Add Todos Now */}
        <AddTodoButton />
      </div>

      <div className="sm:hidden mb-4">
        <Accordion className="text-lg font-medium" title="Projects">
          <div className="flex flex-wrap gap-2 my-2 mx-4">
            {mockProjects.map((p) => (
              <span
                key={p.id}
                className="px-3 py-1 rounded-md text-sm font-medium text-white"
                style={{ backgroundColor: p.color }}
              >
                {p.projectName}
              </span>
            ))}
          </div>
        </Accordion>

        <Accordion title="Tags" className="text-lg font-medium mt-3">
          <div className="flex flex-wrap gap-2 my-2 mx-4">
            {mockTags.map((t) => (
              <span
                key={t.id}
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: t.color }}
              >
                #{t.text}
              </span>
            ))}
          </div>
        </Accordion>
      </div>

      {/* Reminders */}
      <RemindersSection reminders={reminders} />

      {/* Today Todos */}
      <TodosList todos={todos} />
    </Container>
  );
};

export default HomePage;
