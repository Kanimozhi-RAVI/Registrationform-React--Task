import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Formdata from './Component/RegistrationForm';
import Usertable from './Component/Usertable';
import Forms from './Component/Form';
import Loading from './Component/Loading';
import MycodeHtmlforForm from './Component/MycodeHtmlforForm';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/formdata' element ={<Formdata/>}/>
       <Route path='/users' element={<Usertable />} />
       <Route path='/forms' element={<Forms/>}/>
       <Route path='loading' element = {<Loading/>}/>
       <Route path='/myform' element ={<MycodeHtmlforForm/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
