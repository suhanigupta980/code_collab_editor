// import logo from './logo.svg';
import {  Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./component/Home";
import EditorPage from "./component/EditorPage";
// import{Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
    <Toaster position='top-center'></Toaster>
     <Routes>
      <Route path ="/" element ={<Home/>}/>
       <Route path ="/editor/:roomId" element ={<EditorPage/>}/>
     </Routes>
    </>
  );
}

export default App;
