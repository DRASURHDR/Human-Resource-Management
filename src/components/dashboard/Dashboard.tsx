import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const teamMembers = [
  { id: 'EMP-001', name: 'Jane Cooper', department: 'Product', role: 'Product Manager' },
  { id: 'EMP-002', name: 'Devon Lane', department: 'Engineering', role: 'Frontend Developer' },
  { id: 'EMP-003', name: 'Leslie Alexander', department: 'Design', role: 'UI/UX Designer' },
  { id: 'EMP-004', name: 'Courtney Henry', department: 'Operations', role: 'Scrum Master' },
  { id: 'EMP-005', name: 'Bessie Cooper', department: 'Engineering', role: 'Backend Developer' },
] as const;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome, {user?.username ?? 'team member'}!</p>
          </div>
          <Button type="button" variant="ghost" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Team directory</h2>
            <p className="text-sm text-slate-600">
              A snapshot of the teammates you will collaborate with.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-3 font-mono text-xs font-semibold text-slate-500">
                      {member.id}
                    </td>
                    <td className="px-6 py-3 font-medium">{member.name}</td>
                    <td className="px-6 py-3">{member.department}</td>
                    <td className="px-6 py-3">{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;