import React from 'react';
import { PencilSquareIcon, TrashIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
    const isCompleted = task.completed;

    // Category Color Map - Richer colors
    const getCategoryTheme = (cat) => {
        switch (cat) {
            case 'Work': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Personal': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Shopping': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'Health': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className={`
        group relative
        glass rounded-3xl p-6 
        transition-all duration-300 ease-out
        hover:transform hover:-translate-y-2 hover:shadow-xl
        border-white/40
        ${isCompleted ? 'opacity-60 grayscale-[0.5]' : 'bg-white/60'}
    `}>
            <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryTheme(task.category)}`}>
                    <TagIcon className="w-3.5 h-3.5" />
                    {task.category}
                </span>

                <button
                    onClick={() => onToggleComplete(task)}
                    className={`
            transition-all duration-300 rounded-full p-1
            ${isCompleted
                            ? 'text-green-500 bg-green-50 shadow-inner'
                            : 'text-gray-300 hover:text-green-500 hover:bg-green-50'}
          `}
                >
                    <CheckCircleIcon className="w-8 h-8" />
                </button>
            </div>

            <div className="mb-6">
                <h3 className={`font-display font-bold text-xl text-gray-800 mb-2 leading-tight ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                    {task.description || "No description provided."}
                </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{task.dueDate || 'No Date'}</span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 rounded-xl text-blue-500 hover:bg-blue-100 transition-colors"
                        title="Edit"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-100 transition-colors"
                        title="Delete"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
