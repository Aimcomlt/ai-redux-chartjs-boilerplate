import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './app/store';
import AppShell from './components/AppShell/AppShell';
import Overview from './pages/Overview';
import ModelLab from './pages/ModelLab';
import ErrorBoundary from './components/system/ErrorBoundary';
import AppSkeleton from './components/system/AppSkeleton';
import './index.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Suspense fallback={<AppSkeleton />}>
                  <AppShell />
                </Suspense>
              </ErrorBoundary>
            }
          >
            <Route index element={<Overview />} />
            <Route path="model-lab" element={<ModelLab />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
