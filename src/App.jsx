import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import './core/styles/App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import('./core/pages/login'));
const BoardWorkspace = lazy(() => import('./core/pages/boards/BoardWorkspace'));
const ProtectedRoute = lazy(() => import('./core/components/ProtectedRoute'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/boards"
            element={
              <ProtectedRoute>
                <BoardWorkspace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" autoClose={3000} />
    </QueryClientProvider>
  );
}

export default App;
