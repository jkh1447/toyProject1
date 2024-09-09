import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './component/Navbar';
import Post from './component/Post';
import {BrowserRouter, Route, Routes} from 'react-router-dom';


function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Navbar/>
      
      <Routes>
        <Route path='/post' element={<Post/>}/>
        
        
        

      </Routes>

      
    </BrowserRouter>
    </div> 
  );

}

export default App;
