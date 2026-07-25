import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import LoginLeftSide from '../components/LoginLeftSide'
import LoginRIghtSide from '../components/LoginRIghtSide'
import { useAuth } from '../Context/authContext';

const Landing = () => {
   const {user , loading} = useAuth();
  
    if(loading) return <Loading />
    if (user) {
    return <Navigate to="/dashboard" replace />;
}

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />
      <LoginRIghtSide />
    </div>
  )
}

export default Landing