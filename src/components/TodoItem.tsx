import React, { useState } from 'react';
import { Check, Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Todo, TodoPriority } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
}

const priorityConfig: Record<TodoPriority, { color: string; icon: JSX.Element }> = {
  low: { 
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <AlertCircle size={14} className="text-blue-500" />
  },
  medium: { 
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: <AlertCircle size={14} className="text-yellow-500" />
  },
  high: { 
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: <AlertCircle size={14} className="text-red-500" />
  },
};

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');

  const handleSave = () => {
    if (!editedTitle.trim()) return;
    onEdit(todo.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const priorityStyle = priorityConfig[todo.priority];
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md
      ${todo.completed ? 'border-green-100 bg-green-50/30' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
              ${todo.completed 
                ? 'bg-green-500 border-green-500 hover:bg-green-600' 
                : 'border-gray-300 hover:border-gray-400'}`}
          >
            {todo.completed && <Check size={14} className="text-white" />}
          </button>
          <div className="flex-1">
            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1
                ${priorityStyle.color}`}>
                {priorityStyle.icon}
                {todo.priority}
              </span>
              {todo.dueDate && (
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1
                  ${isOverdue 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                  <Calendar size={14} />
                  {new Date(todo.dueDate).toLocaleDateString()}
                  {isOverdue && ' (Overdue)'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}