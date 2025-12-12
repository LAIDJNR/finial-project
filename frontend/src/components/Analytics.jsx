import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const Analytics = ({ tasks }) => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;

    const data = [
        { name: 'Completed', value: completed },
        { name: 'Pending', value: pending },
    ];

    const COLORS = ['#10B981', '#F59E0B'];

    // Category data
    const categoryCount = tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.keys(categoryCount).map(key => ({
        name: key,
        tasks: categoryCount[key]
    }));

    if (tasks.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-6">
            <div className="glass rounded-3xl p-6 relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-4">
                    <ChartBarIcon className="w-5 h-5 text-gray-500" />
                    <h3 className="font-display font-bold text-gray-700">Task Status</h3>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-sm font-medium text-gray-500">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Completed</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Pending</span>
                </div>
            </div>

            <div className="glass rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <ChartBarIcon className="w-5 h-5 text-gray-500" />
                    <h3 className="font-display font-bold text-gray-700">Category Breakdown</h3>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                            <Bar dataKey="tasks" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45 + 200}, 70%, 60%)`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
