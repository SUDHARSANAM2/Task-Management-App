import React, { useState} from 'react';
import { Plus, User, Search, Check, Trash2, Calendar, Clock, LogOut, Edit3, Play, CheckCircle, Bell, Settings } from 'lucide-react';

const TodoApp = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  // Simulated Google Auth
  const handleGoogleAuth = () => {
    const mockUser = {
      id: '1',
      name: 'SUDHARSANAM D',
      email: 'sudharsanam1754gmail.com',
      avatar: 'https://images.app.goo.gl/K5uGunWcKqk422n1A'
    };
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setShowProfile(false);
    setActiveTab('home');
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        ...newTask,
        completed: false,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowAddTask(false);
    }
  };

  const toggleTask = (id, status = 'completed') => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task };
        if (status === 'completed') {
          updatedTask.completed = !task.completed;
          updatedTask.status = updatedTask.completed ? 'completed' : 'pending';
          if (updatedTask.completed) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
          }
        } else {
          updatedTask.status = status;
          updatedTask.completed = status === 'completed';
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const editTask = (id, updatedData) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updatedData } : task
    ));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && task.completed) ||
                         (filter === 'pending' && !task.completed);
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    return { total, completed, inProgress, pending };
  };

  const stats = getStatusStats();

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-white/20">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-full mx-auto mb-6 flex items-center justify-center border border-white/30">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">TaskFlow</h1>
            <p className="text-white/80">Your personal task manager</p>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full bg-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300 shadow-lg"
          >
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full"></div>
            <span className="text-gray-800 font-semibold">Continue with Google</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              Secure • Fast • Reliable
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Mobile App
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">TaskFlow</h1>
              <p className="text-xs text-white/80">{stats.total} tasks total</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="relative"
            >
              <img
                src={user.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white/30"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 py-4 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 text-center border border-white/20">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/80">Total</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 text-center border border-white/20">
            <p className="text-2xl font-bold text-white">{stats.pending}</p>
            <p className="text-xs text-white/80">Pending</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 text-center border border-white/20">
            <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            <p className="text-xs text-white/80">Progress</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 text-center border border-white/20">
            <p className="text-2xl font-bold text-white">{stats.completed}</p>
            <p className="text-xs text-white/80">Done</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4 bg-white shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 bg-white border-b">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'pending', 'completed'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === filterOption
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="px-4 py-4 pb-24 space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-2xl shadow-md border-l-4 ${getPriorityColor(task.priority)} p-4 ${task.completed ? 'opacity-75' : ''}`}
          >
            {/* Task Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'in-progress' ? 'In Progress' : 
                     task.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Task Description */}
            {task.description && (
              <p className={`text-gray-600 mb-3 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setEditingTask(task)}
                className="flex-1 py-2 px-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => toggleTask(task.id, 'completed')}
                className="flex-1 py-2 px-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Done
              </button>
              <button
                onClick={() => toggleTask(task.id, 'in-progress')}
                className="flex-1 py-2 px-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="py-2 px-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Created Date */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Check className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tasks found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Tap the + button to create your first task'
              }
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddTask(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all z-30"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 max-w-md mx-auto">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'
            }`}
          >
            <Check className="w-5 h-5" />
            <span className="text-xs font-medium">Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === 'search' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">Search</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === 'stats' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Calendar</span>
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              showProfile ? 'bg-blue-50 text-blue-600' : 'text-gray-500'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Congratulations Alert */}
      {showAlert && (
        <div className="fixed top-20 left-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">🎉 Task Completed!</p>
              <p className="text-sm text-green-100">Great job! Keep it up!</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              
              <div className="text-center mb-6">
                <img src={user.avatar} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100" />
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-sm text-blue-800">Total Tasks</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-sm text-green-800">Completed</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full py-3 px-4 bg-gray-100 rounded-2xl flex items-center gap-3 hover:bg-gray-200 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">Settings</span>
                </button>
                <button className="w-full py-3 px-4 bg-gray-100 rounded-2xl flex items-center gap-3 hover:bg-gray-200 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">Notifications</span>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Task</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Add more details..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Task</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editTask(editingTask.id, editingTask)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;