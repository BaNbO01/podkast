import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NovaEpizodaForm from './Components/NovaEpizodaForm ';
import EpizodeList from './Components/EpizodeList';
import PodkastiList from './Components/PodkastList';
import EpizodaDetalji from './Components/EpizodaDetalji';
import CreatePodcast from './Components/CreatePodcast';
import Login from './Components/Login';
import Register from './Components/Register';
import OmiljeniPodkasti  from './Components/Favorites';
import UserManagement from './Components/UserManagement';
import CategoryManagement from './Components/CategoryManagement';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />  
          <Route path="/register" element={<Register />} />
          <Route path="/kreirajPodkast" element={<CreatePodcast />} />
          <Route path="/podkasti" element={<PodkastiList />} />
          <Route path="/podkasti/:id" element={<EpizodeList />} />
          <Route path="/epizode/:id" element={<EpizodaDetalji />} />
          <Route path="/kreirajEpizodu" element={<NovaEpizodaForm podkastId={11} />} />
          <Route path="/omiljeni" element={<OmiljeniPodkasti />} />
          <Route path="/korisnici" element={<UserManagement />} />
          <Route path="/kategorije" element={<CategoryManagement/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
