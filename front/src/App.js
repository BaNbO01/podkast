import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NovaEpizodaForm from './Components/NovaEpizodaForm ';
import EpizodeList from './Components/EpizodeList';
import PodkastiList from './Components/PodkastList';
import EpizodaDetalji from './Components/EpizodaDetalji';
import CreatePodcast from './Components/CreatePodcast';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<CreatePodcast />} />  
        <Route path="/podkasti" element={<PodkastiList />} />
          <Route path="/podkasti/:id" element={<EpizodeList />} />
          <Route path="/epizode/:id" element={<EpizodaDetalji />} />
          <Route path="/kreirajEpizodu" element={<NovaEpizodaForm podkastId={11} />} />
           </Routes>
      </div>
    </Router>
  );
};

export default App;
