import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Viewer from "./pages/Viewer";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Define all routes here */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/viewer" element={<Layout><Viewer /></Layout>} />

          {/* IMPORTANT: DO NOT place any routes below this. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;