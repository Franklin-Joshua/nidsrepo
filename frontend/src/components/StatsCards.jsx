export default function StatsCards({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card accent">
        <div className="stat-label">Total Logs</div>
        <div className="stat-value">{stats.totalLogs ?? '-'}</div>
      </div>
      <div className="stat-card green">
        <div className="stat-label">Normal Traffic</div>
        <div className="stat-value">{stats.totalNormalTraffic ?? '-'}</div>
      </div>
      <div className="stat-card red">
        <div className="stat-label">Attack Traffic</div>
        <div className="stat-value">{stats.totalAttackTraffic ?? '-'}</div>
      </div>
    </div>
  );
}


