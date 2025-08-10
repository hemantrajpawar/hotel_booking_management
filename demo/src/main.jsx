import { StrictMode,useState } from 'react'
import  {Route, RouterProvider,createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import './index.css'
import {createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import App from './App'
import Bighome from './Bighome'
import Rooms from './components/Rooms'
import User_Rooms from './assets/User_Rooms'
import Events from './components/Events'
import Specific from './components/Specific'
import Form from './components/Form'
import Admin from './dashboards/Admin/Admin'
import About from './components/About'
import Analysis from './dashboards/Admin/Analysis'
import Booking_management from './dashboards/Admin/Booking_management'
import Reviews_management from './dashboards/Admin/Reviews_management'
import Room_management from './dashboards/Admin/Room_management'
import User_management from './dashboards/Admin/User_management'
import Booking_form from "./Forms/Booking_form"
import ContactPage from './components/ContactPage'
import My_bookings from './dashboards/My_bookings'
import User_profile from './dashboards/User_profile'
import Wishlist from './dashboards/Wishlist'
import Registration_from from './Forms/Registration_from'
import Login_form from './Forms/Login_form'
import Chatbot from './Chatbot'


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service worker registered.', reg))
      .catch(err => console.log('Service worker registration failed:', err));
  });
}





const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Bighome/>} />
      <Route path='/rooms' element={<Rooms/>}/>
      <Route path='/events' element={<Events/>}/>
      <Route path='/specific/:roomId' element={<Specific/>}/>
      <Route path='/form' element={<Form/>}/>
      <Route path='/user_rooms' element={<User_Rooms/>} />
      <Route path='/booking/:roomId' element={<Booking_form />} />
      <Route path="/my-bookings" element={<My_bookings />} />
      <Route path='/about' element={<About/>}/>
      <Route path='/admin' element={<Admin/>} />
      <Route path='/contact' element={<ContactPage/>}/>
      <Route path='/admin/rooms' element={<Room_management/>}/>
      <Route path='/admin/bookings' element={<Booking_management/>}/>
      <Route path='/admin/reviews' element={<Reviews_management/>}/>
      <Route path='/admin/users' element={<User_management/>}/>
      <Route path='/admin/analysis' element={<Analysis/>}/>
      <Route path='/user_profile' element={<User_profile/>}/>
      <Route path='/wishlist' element={<Wishlist/>}/>
      <Route path='/login' element={<Login_form/>}/>
      <Route path='/register' element={<Registration_from/>}/>
      <Route  path="/chatbot" element={<Chatbot/>} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode> 
)
