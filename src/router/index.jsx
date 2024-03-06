import { Route, Routes } from "react-router-dom";
import HomePage from "src/pages/home";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default Router;
