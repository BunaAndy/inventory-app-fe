import './App.css';
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'

function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className='pageWrapper'>
                    <Routes>
                        <Route index element={<Home />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
export default App;
