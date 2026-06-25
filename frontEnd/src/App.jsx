import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { DataProvider, useDataContext } from './context/dataContext';

import { About } from './pages/About';       
import { Contact } from './pages/Contact';   
import { Toaster } from './components/common/index';
import { Layout, ResumeJdMatcher,  MatchResultsComponent, MatchUnavailableComponent } from './components/index';

function AppRoutes() {
  const { data, setData } = useDataContext();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ResumeJdMatcher setData={setData} />} />
        <Route 
          path="/match" 
          element={data ? <MatchResultsComponent data={data} /> : <MatchUnavailableComponent />} 
        />
        <Route path="/about" element={<About />} />      {/* 3. Mount About */}
        <Route path="/contact" element={<Contact />} />  {/* 4. Mount Contact */}
      </Route>
    </Routes>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  return (
    <DataProvider value={{ data, setData }}>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </DataProvider>
  );
}