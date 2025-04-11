import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import TreeVisualizerPage from './pages/TreeVisualizer';
import ChartsPage from './pages/Charts';
import CodeEditorPage from './pages/CodeEditor';
import SettingsPage from './pages/Settings';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="tree-visualizer" element={<TreeVisualizerPage />} />
                    <Route path="charts" element={<ChartsPage />} />
                    <Route path="code-editor" element={<CodeEditorPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;