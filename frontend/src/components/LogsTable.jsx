import { useMemo, useState } from 'react';

export default function LogsTable({ logs, isAdmin, onDelete }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const filtered = useMemo(() => {
    const src = (logs || []);
    if (!q) return src;
    const s = q.toLowerCase();
    return src.filter((r) =>
      (r.protocol_type || '').toLowerCase().includes(s) ||
      (r.service || '').toLowerCase().includes(s) ||
      String(r.src_bytes || '').includes(s) ||
      String(r.dst_bytes || '').includes(s) ||
      (r.attack_label || '').toLowerCase().includes(s) ||
      (r.classification || '').toLowerCase().includes(s)
    );
  }, [logs, q]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      let va = a[sortBy];
      let vb = b[sortBy];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  function onSort(key) {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(key);
      setSortDir('asc');
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Logs</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input placeholder="Search protocol/service/bytes/label" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} style={{ width: 280 }} />
          <select value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => onSort('protocol_type')}>Protocol</th>
              <th style={{ cursor: 'pointer' }} onClick={() => onSort('service')}>Service</th>
              <th style={{ cursor: 'pointer' }} onClick={() => onSort('src_bytes')}>Src Bytes</th>
              <th style={{ cursor: 'pointer' }} onClick={() => onSort('dst_bytes')}>Dst Bytes</th>
              <th style={{ cursor: 'pointer' }} onClick={() => onSort('attack_label')}>Label</th>
              <th style={{ cursor: 'pointer' }} onClick={() => onSort('classification')}>Class</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr key={row._id}>
                <td>{row.protocol_type}</td>
                <td>{row.service}</td>
                <td>{row.src_bytes}</td>
                <td>{row.dst_bytes}</td>
                <td>{row.attack_label}</td>
                <td>
                  <span className={`tag ${row.classification === 'Attack' ? 'red' : 'green'}`}>
                    {row.classification}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    <button className="danger" onClick={() => onDelete(row._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}


