import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContext'; // Import AuthContext from the context file

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
