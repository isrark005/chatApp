import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home.tsx'

const router= createBrowserRouter([{
    element: <App />,
    children: [
        {
            path: "",
            element: <Home />
        },
        {
            path: "/:roomId",
            element: <Home />
        },
    ]
}])
createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
