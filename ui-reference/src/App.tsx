import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Discounts from './pages/Discounts';
import PharmacyDashboard from './pages/PharmacyDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="discounts" element={<Discounts />} />
          <Route path="pharmacy" element={<PharmacyDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;