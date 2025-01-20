import React, { useState } from 'react';
import { Plus, X, Calendar, Flag } from 'lucide-react';
import { TodoPriority } from '../types';

interface AddTodoFormProps {
  onAdd: (data: {
    title: string;
    description?: string;
    priority: TodoPriority;
    dueDate?: string;
  }) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-indigo-200 rounded-xl
          text-indigo-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50
          transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span className="font-medium">Create New Task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              placeholder-gray-400"
            required
          />
        </div>
        
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              placeholder-gray-400"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center space-x-1">
                <Flag size={16} className="text-gray-400" />
                <span>Priority Level</span>
              </div>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TodoPriority)}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center space-x-1">
                <Calendar size={16} className="text-gray-400" />
                <span>Due Date</span>
              </div>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600
              transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </form>
  );
}