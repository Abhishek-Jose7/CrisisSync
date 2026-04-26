// This page has been replaced by the "How It Works" and "About" pages.
// Kept for backward compatibility - redirects to How It Works.
import { Navigate } from 'react-router-dom';

export function Platform() {
  return <Navigate to="/how-it-works" replace />;
}
