import './App.css';
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'
import Navbar from './components/NavBar';
import ProjectDisplay from './pages/projects/ProjectDisplay';
import AllProjects from './pages/projects/AllProjects';

function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Navbar/>
                <div className='pageWrapper'>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="projects" element={<AllProjects />} />
                        <Route path="projects/*" element={<ProjectDisplay />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
export default App;
