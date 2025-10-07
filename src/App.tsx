import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import type { AuthView, RegisterStep, RegistrationData } from './types/auth';

const App: React.FC = () => {
  const location = useLocation();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('personal');
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});

  useEffect(() => {
    if (location.pathname.startsWith('/register')) {
      setAuthView('register');
    } else if (location.pathname.startsWith('/forgot')) {
      setAuthView('forgot-password');
    } else {
      setAuthView('login');
    }
  }, [location.pathname]);

  const resetRegistration = useCallback(() => {
    setRegisterStep('personal');
    setRegistrationData({});
  }, []);

  return (
    <AppRoutes
      authView={authView}
      registerStep={registerStep}
      setRegisterStep={setRegisterStep}
      registrationData={registrationData}
      setRegistrationData={setRegistrationData}
      resetRegistration={resetRegistration}
    />
  );
};

export default App;