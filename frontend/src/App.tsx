// test comment


// 1. Import your component
import './App.css';
import {AuthForm} from './components/AuthForm';

function App() {
  return (
    // 2. Render it inside the main div
    <div className="app-shell">
      <AuthForm/>
    </div>
  );
}

export default App;