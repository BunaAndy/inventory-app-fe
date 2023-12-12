import './App.css';
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache } from 'react-query'
import Navbar from './components/NavBar';
import ProjectDisplay from './pages/projects/ProjectDisplay';
import AllProjects from './pages/projects/AllProjects';
import AllItems from './pages/items/AllItems';
import AddProjectItems from './pages/projects/AddProjectItems';
import {Login} from './pages/Login';
import ArchivedProjects from './pages/archive/ArchivedProjects';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) =>
            toast.error(String(error.message), ),
        }),
    })
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Navbar/>
                <div className='pageWrapper'>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="items" element={<AllItems />} />
                        <Route path="add_project_items" element={<AddProjectItems />} />
                        <Route path="projects" element={<AllProjects />} />
                        <Route path="projects/*" element={<ProjectDisplay />} />
                        <Route path="archives" element={<ArchivedProjects />} />
                        <Route path="login" element={<Login />} />
                    </Routes>
                </div>
            </BrowserRouter>
            <ToastContainer/>
        </QueryClientProvider>
    );
}
export default App;
