import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SmallChart(){
  const data = [
    { name: 'Mon', patients: 10 },
    { name: 'Tue', patients: 15 },
    { name: 'Wed', patients: 12 },
    { name: 'Thu', patients: 18 },
    { name: 'Fri', patients: 20 },
    { name: 'Sat', patients: 14 },
    { name: 'Sun', patients: 22 },
  ];
  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="patients" stroke="#3182ce" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
