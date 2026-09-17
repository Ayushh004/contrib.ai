import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider,Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LinkDrop from "./components/LinkDrop";
import AiChatBox from "./components/AiChatBox"
import DemoChatBox from "./components/DemoChatBox"
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleCallback from "./components/GoogleCallback";
import Docs from "./Pages/Docs";
const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/docs" element={<Docs/>}/>
        <Route path="/chatbox/demo" element={<DemoChatBox/>} />
        <Route 
            path="/pastelink" 
            element={
                <ProtectedRoute>
                    <LinkDrop/>
                </ProtectedRoute>
            }
        />
        <Route 
            path="/chatbox" 
            element={
                <ProtectedRoute>
                    <AiChatBox/>
                </ProtectedRoute>
            }
        />
        <Route
            path="/chatbox/:jobId"
            element={
                <ProtectedRoute>
                    <AiChatBox/>
                </ProtectedRoute>
            }
        />
        <Route
            path="/chatbox/:jobId/:conversationId"
            element={
                <ProtectedRoute>
                    <AiChatBox/>
                </ProtectedRoute>
            }
        />
        <Route
            path="/chat/:jobId"
            element={
                <ProtectedRoute>
                    <AiChatBox/>
                </ProtectedRoute>
            }
        />
        <Route 
            path="/loading/:jobId" 
            element={
                <ProtectedRoute>
                    <Loading />
                </ProtectedRoute>
            }
        />
        
        </>
        
    )
)


createRoot(document.getElementById('root')!).render(
    
        <RouterProvider router = {router}/>
    
       
    
    
    
)
