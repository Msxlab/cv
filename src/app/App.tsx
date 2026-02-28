import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CVProvider } from './context/cv-context';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <CVProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </CVProvider>
  );
}
