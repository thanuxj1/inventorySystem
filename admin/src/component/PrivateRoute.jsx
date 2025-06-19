import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  // Access the currentUser from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  // Check if currentUser exists
  return currentUser ? <Outlet /> : <Navigate to='/login' />;
}
