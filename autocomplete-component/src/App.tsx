import Autocomplete from './components/Autocomplete';
import backgroundImage from "./assets/building.jpg";

function App() {
  return (
    <main 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div     
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xs scale-105 bg-white/30"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-white/30" />
        <Autocomplete />
    </main>
  )
}
export default App;
