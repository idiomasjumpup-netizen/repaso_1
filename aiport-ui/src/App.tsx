import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BakeryDashboard from "./pages/BakeryDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BakeryDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}