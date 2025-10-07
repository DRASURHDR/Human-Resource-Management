import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface HeaderAction {
  label: string;
  to: string;
  onClick?: () => void;
}

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  asideTitle?: string;
  asideDescription?: string;
  headerAction?: HeaderAction;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  asideTitle = 'Your next chapter starts here',
  asideDescription = 'Join a multidisciplinary team that values collaboration, growth, and meaningful work.',
  headerAction,
}) => {
  const action = headerAction ?? { label: 'Sign up', to: '/register' };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-indigo-600">
            TeamFlow
          </Link>
          <Link
            to={action.to}
            onClick={action.onClick}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {action.label}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr,0.8fr]">
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
              {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
            </div>
            {children}
          </section>

          <aside className="hidden flex-col justify-between rounded-2xl bg-indigo-600 p-10 text-indigo-50 lg:flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
                Why TeamFlow
              </p>
              <h2 className="mt-4 text-2xl font-semibold">{asideTitle}</h2>
              <p className="mt-4 text-sm leading-6 text-indigo-100">{asideDescription}</p>
            </div>
            <div className="rounded-xl bg-indigo-500/40 p-4 text-sm leading-6 text-indigo-50">
              “From day one, you are empowered to contribute, learn, and grow with peers who cheer you on.”
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} TeamFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;