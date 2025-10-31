import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { makeClient } from '../api/client.js';
import NavBar from '../components/NavBar.jsx';
import StatsCards from '../components/StatsCards.jsx';
import AttackChart from '../components/AttackChart.jsx';
import LogsTable from '../components/LogsTable.jsx';

export default function Dashboard() {
  const { token, user } = useAuth();
  const api = makeClient(token);
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('pie');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [s, l] = await Promise.all([api.get('/api/stats'), api.get('/api/logs')]);
        if (!mounted) return;
        setStats(s.data);
        setLogs(l.data.logs || []);
      } catch (e) {
        setError(e?.response?.data?.error || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function reloadDataset() {
    try {
      await api.post('/api/admin/reload');
      const [s, l] = await Promise.all([api.get('/api/stats'), api.get('/api/logs')]);
      setStats(s.data);
      setLogs(l.data.logs || []);
    } catch (e) {
      setError(e?.response?.data?.error || 'Reload failed');
    }
  }

  async function deleteLog(id) {
    try {
      await api.delete(`/api/admin/logs/${id}`);
      setLogs((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      setError(e?.response?.data?.error || 'Delete failed');
    }
  }

  return (
    <div>
      <NavBar />
      <div className="container">
        {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
        {loading ? (
          <div className="card">Loading...</div>
        ) : (
          <>
            <StatsCards stats={stats} />
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>Attacks Overview</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={chartType === 'pie' ? 'primary' : ''} onClick={() => setChartType('pie')}>Pie</button>
                <button className={chartType === 'bar' ? 'primary' : ''} onClick={() => setChartType('bar')}>Bar</button>
              </div>
            </div>
            <AttackChart dataMap={stats.attackCountsByType} type={chartType} />
            {user?.role === 'admin' && (
              <div className="card">
                <button className="primary" onClick={reloadDataset}>Trigger Dataset Reload</button>
              </div>
            )}
            <LogsTable logs={logs} isAdmin={user?.role === 'admin'} onDelete={deleteLog} />
          </>
        )}
      </div>
    </div>
  );
}


