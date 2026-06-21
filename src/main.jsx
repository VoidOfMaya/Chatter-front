import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Signup } from './components/signup/signup.jsx'
import { Channel } from './components/channel/channel.jsx'
import { Profile } from './components/profile/profile.jsx'
import { NotFound } from './components/404/404.jsx'
import { Search } from './components/search/search.jsx'


//page routing
const router = createBrowserRouter([
  {path:'/', element: <App />,
    children: [
      {path:'/', element: <Signup />},
      {path:'/chatter', element:<Channel/>},
      {path: '/profile/:profileId', element:<Profile/>},
      {path: '/search',element:<Search/>}
    ],
    errorElement:<NotFound />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
