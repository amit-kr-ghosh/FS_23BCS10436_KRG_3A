import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BrowseLostItems from './pages/BrowseLostItems';
import ReportLost from './pages/ReportLost';
import MyLostItems from './pages/MyLostItems';
import LostItemDetail from './pages/LostItemDetail';
import EditLostItem from './pages/EditLostItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/browse-lost-items" replace />} />
        <Route path="/browse-lost-items" element={<BrowseLostItems />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/my-lost-items" element={<MyLostItems />} />
        <Route path="/lost-items/:id" element={<LostItemDetail />} />
        <Route path="/edit-lost-item/:id" element={<EditLostItem />} />
      </Routes>
    </Router>
  );
}

export default App;
