import React, { useEffect, useState } from 'react';
import { Rocket, ListTodo, Calendar, CheckCircle2, Filter } from 'lucide-react';
import { Todo } from './types';
import { TodoItem } from './components/TodoItem';
import { AddTodoForm } from './components/AddTodoForm';

const STORAGE_KEY = 'todos-v1';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'createdAt'>('createdAt');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (data: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-500 p-3 rounded-2xl">
              <Rocket className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task Master Pro
          </h1>
          <p className="text-gray-600">Organize, Prioritize, Accomplish</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-blue-600 font-semibold">Total Tasks</div>
              <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-green-600 font-semibold">Completed</div>
              <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl">
              <div className="text-yellow-600 font-semibold">Active</div>
              <div className="text-2xl font-bold text-yellow-700">{stats.active}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <div className="text-red-600 font-semibold">High Priority</div>
              <div className="text-2xl font-bold text-red-700">{stats.highPriority}</div>
            </div>
          </div>

          <AddTodoForm onAdd={addTodo} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="createdAt">Sort by Created Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="dueDate">Sort by Due Date</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
            {filteredTodos.length === 0 && (
              <div className="text-center py-12">
                <ListTodo size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No tasks found. Add your first task to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;