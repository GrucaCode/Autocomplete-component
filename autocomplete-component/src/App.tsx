import Autocomplete from './components/Autocomplete';
import backgroundImage from "./assets/building.jpg";
import { technologies } from './data/technologies';
// import { addresses } from "./data/addresses";
// import { tags } from "./data/tags";

function App() {
  return (
    <main 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div     
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xs scale-105 bg-white/30"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-white/30"/>
      <p className='absolute bottom-5 left-5 text-gray-300 z-1'>Obraz wal_172619 z Pixabay</p>
        <Autocomplete
          suggestions={technologies}
          getSuggestionLabel={(suggestion) => suggestion}
          getSuggestionId={(suggestion) => suggestion}
          createSuggestion={(query)=> query}
        />
    </main>
  )
}
export default App;
