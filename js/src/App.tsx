import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/UI/Navbar';
import About from './pages/About';

import TrackingPage from './pages/TrackingPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<TrackingPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
