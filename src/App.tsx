import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard, Sign } from "./pages";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./utils/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Sign />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
