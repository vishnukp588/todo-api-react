import { useMemo, useState } from 'react';

type Task = {
  id: number;
  text: string;
  done: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Cutting the release branch', done: false },
    { id: 2, text: 'Updated the release page', done: true },
    { id: 3, text: 'Deploy the artifacts', done: false },
  ]);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      filter === 'all' ? true : filter === 'active' ? !task.done : task.done
    );
  }, [tasks, filter]);

  const completedCount = tasks.filter((task) => task.done).length;

  const addTask = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setTasks((current) => [
      ...current,
      { id: Date.now(), text: trimmed, done: false },
    ]);
    setDraft('');
  };

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const removeTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <main className="page-shell">
      <section className="todo-hero">
        <div className="hero-copy-block">
          <p className="eyebrow">Task manager</p>
          <h1>Stay focused with a clean, PXP TODO experience.</h1>
          <p>
            Create tasks, track progress, and keep your day organized in a polished dark-mode layout.
          </p>
          <div className="hero-stats">
            <div>
              <span>{tasks.length}</span>
              <small>Tasks total</small>
            </div>
            <div>
              <span>{completedCount}</span>
              <small>Completed</small>
            </div>
            <div>
              <span>{Math.max(tasks.length - completedCount, 0)}</span>
              <small>Remaining</small>
            </div>
          </div>
        </div>
        <div className="todo-card">
          <header className="todo-card-header">
            <div>
              <p className="tag">Today</p>
              <h2>Productivity board</h2>
            </div>
            <div className="chip">Ready for Release</div>
          </header>

          <div className="task-input-block">
            <input
              placeholder="Add a new task"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && addTask()}
            />
            <button className="button primary" type="button" onClick={addTask}>
              Add
            </button>
          </div>

          <div className="task-filters">
            {(['all', 'active', 'completed'] as const).map((value) => (
              <button
                key={value}
                className={filter === value ? 'filter-pill active' : 'filter-pill'}
                onClick={() => setFilter(value)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>

          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task.id} className={task.done ? 'task-item done' : 'task-item'}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.text}</span>
                </label>
                <button className="icon-button" onClick={() => removeTask(task.id)}>
                  ✕
                </button>
              </li>
            ))}
            {filteredTasks.length === 0 && (
              <li className="empty-state">No tasks match this filter yet.</li>
            )}
          </ul>

          <div className="task-table-card">
            <div className="table-card-header">
              <div>
                <p className="tag">Summary</p>
                <h3>Task overview</h3>
              </div>
              <span className="table-chip">Live data</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.text}</td>
                      <td>
                        <span className={task.done ? 'status-badge done' : 'status-badge active'}>
                          {task.done ? 'Completed' : 'In progress'}
                        </span>
                      </td>
                      <td>{task.done ? 'Ready to review' : 'Action item'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
