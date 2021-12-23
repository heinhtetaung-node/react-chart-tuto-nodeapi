import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Task1 from './components/Task1'

function App() {
  return (
    <div className='bg-gray-200'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Task1 />} />
        </Routes>
      </BrowserRouter>    
    </div>
  )
}

export default App;
