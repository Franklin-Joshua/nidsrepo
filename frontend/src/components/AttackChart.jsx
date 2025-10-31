import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

const COLORS = ['#ff6b6b', '#f06595', '#845ef7', '#339af0', '#51cf66', '#fcc419', '#ffa94d'];

export default function AttackChart({ dataMap, type = 'pie' }) {
  const data = Object.entries(dataMap || {}).map(([name, value]) => ({ name, value }));
  if (!data.length) return <div className="card">No attack data</div>;
  return (
    <div className="card">
      <h3>Attack Types</h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          {type === 'pie' ? (
            <PieChart>
              <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={120} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide={false} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis/>
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6c5ce7" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}


