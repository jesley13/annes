import { useContext } from 'react';
import { CelebrationContext } from '../context/CelebrationContext';

export const useCelebrations = () => {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error('useCelebrations must be used within a CelebrationProvider');
  }
  return context;
};
