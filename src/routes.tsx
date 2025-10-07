import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import PersonalDetails from './components/register/PersonalDetails';
import RolePreference from './components/register/RolePreference';
import SelectDesignation from './components/register/SelectDesignation';
import SetupAccount from './components/register/SetupAccount';
import Congratulations from './components/register/Congratulations';
import AuthLayout from './components/common/AuthLayout';
import { useAuth } from './context/AuthContext';
import type { AuthView, RegisterStep, RegistrationData } from './types/auth';

interface AppRoutesProps {
  authView: AuthView;
  registerStep: RegisterStep;
  setRegisterStep: Dispatch<SetStateAction<RegisterStep>>;
  registrationData: Partial<RegistrationData>;
  setRegistrationData: Dispatch<SetStateAction<Partial<RegistrationData>>>;
  resetRegistration: () => void;
}

interface RegisterRouteProps {
  registerStep: RegisterStep;
  setRegisterStep: Dispatch<SetStateAction<RegisterStep>>;
  registrationData: Partial<RegistrationData>;
  setRegistrationData: Dispatch<SetStateAction<Partial<RegistrationData>>>;
  resetRegistration: () => void;
}

const isRegistrationComplete = (data: Partial<RegistrationData>): data is RegistrationData =>
  Boolean(
    data.fullName &&
      data.email &&
      data.phoneNumber &&
      data.role &&
      data.department &&
      data.position &&
      data.description &&
      data.username &&
      data.password,
  );

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const RegisterRoute: React.FC<RegisterRouteProps> = ({
  registerStep,
  setRegisterStep,
  registrationData,
  setRegistrationData,
  resetRegistration,
}) => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    setSubmissionError(null);
  }, [registerStep]);

  useEffect(() => {
    if (registerStep === 'congratulations' && !isRegistrationComplete(registrationData)) {
      resetRegistration();
      setRegisterStep('personal');
    }
  }, [registerStep, registrationData, resetRegistration, setRegisterStep]);

  const handlePersonalNext = (values: Pick<RegistrationData, 'fullName' | 'email' | 'phoneNumber'>) => {
    setRegistrationData((prev) => ({ ...prev, ...values }));
    setRegisterStep('role');
  };

  const handleRoleNext = (values: Pick<RegistrationData, 'role'>) => {
    setRegistrationData((prev) => ({ ...prev, ...values }));
    setRegisterStep('designation');
  };

  const handleDesignationNext = (values: Pick<RegistrationData, 'department' | 'position' | 'description'>) => {
    setRegistrationData((prev) => ({ ...prev, ...values }));
    setRegisterStep('account');
  };

  const handleAccountSubmit = async (values: Pick<RegistrationData, 'username' | 'password'>) => {
    const nextData = { ...registrationData, ...values };

    if (!isRegistrationComplete(nextData)) {
      setSubmissionError('Please complete each step before creating your account.');
      return;
    }

    try {
      setSubmissionError(null);
      const completeData = nextData;
      await register(completeData);
      setRegistrationData(completeData);
      setRegisterStep('congratulations');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create the account. Please try again.';
      setSubmissionError(message);
    }
  };

  const handleContinue = () => {
    resetRegistration();
    navigate('/login');
  };

  const stepTitles: Record<RegisterStep, string> = {
    personal: 'Tell us about yourself',
    role: 'Choose your role preference',
    designation: 'Share your designation',
    account: 'Set up your account',
    congratulations: 'Welcome aboard!',
  };

  const stepDescriptions: Record<RegisterStep, string> = {
    personal: 'We use this information to personalize your onboarding experience.',
    role: 'Let us know where you see yourself contributing the most.',
    designation: 'Help us understand the team you expect to collaborate with.',
    account: 'Create the credentials you will use to access the platform.',
    congratulations: 'Your registration is complete. Review your details below.',
  };

  let stepContent: ReactNode = null;

  switch (registerStep) {
    case 'personal':
      stepContent = <PersonalDetails data={registrationData} onNext={handlePersonalNext} />;
      break;
    case 'role':
      stepContent = (
        <RolePreference
          data={registrationData}
          onBack={() => setRegisterStep('personal')}
          onNext={handleRoleNext}
        />
      );
      break;
    case 'designation':
      stepContent = (
        <SelectDesignation
          data={registrationData}
          onBack={() => setRegisterStep('role')}
          onNext={handleDesignationNext}
        />
      );
      break;
    case 'account':
      stepContent = (
        <SetupAccount
          data={registrationData}
          onBack={() => setRegisterStep('designation')}
          onSubmit={handleAccountSubmit}
          loading={loading}
          errorMessage={submissionError}
        />
      );
      break;
    case 'congratulations':
      if (isRegistrationComplete(registrationData)) {
        stepContent = <Congratulations data={registrationData} onContinue={handleContinue} />;
      }
      break;
    default:
      stepContent = null;
  }

  return (
    <AuthLayout
      title={stepTitles[registerStep]}
      description={stepDescriptions[registerStep]}
      headerAction={{
        label: 'Back to login',
        to: '/login',
        onClick: resetRegistration,
      }}
      asideTitle="Collaborate with a world-class team"
      asideDescription="Discover a supportive community of engineers, designers, and product leaders shaping the future of digital experiences."
    >
      <div className="space-y-6">
        {registerStep !== 'account' && submissionError ? (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {submissionError}
          </div>
        ) : null}
        {stepContent}
      </div>
    </AuthLayout>
  );
};

const AppRoutes: React.FC<AppRoutesProps> = ({
  authView,
  registerStep,
  setRegisterStep,
  registrationData,
  setRegistrationData,
  resetRegistration,
}) => {
  useEffect(() => {
    if (authView !== 'register') {
      resetRegistration();
    }
  }, [authView, resetRegistration]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route
        path="/register"
        element={
          <RegisterRoute
            registerStep={registerStep}
            setRegisterStep={setRegisterStep}
            registrationData={registrationData}
            setRegistrationData={setRegistrationData}
            resetRegistration={resetRegistration}
          />
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;