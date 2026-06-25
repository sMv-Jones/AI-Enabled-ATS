import { Outlet} from 'react-router-dom';
import Header from "./layout/Header"
import Footer from "./layout/Footer"

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b1329] text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b1329] to-[#050914]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}