import React from 'react';
import TaskCard from './TaskCard';
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-96">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <ArchiveBoxXMarkIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-600">No tasks found</h3>
                <p className="text-gray-400 mt-2">Get started by creating a new task!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                />
            ))}
        </div>
    );
};

export default TaskList;
