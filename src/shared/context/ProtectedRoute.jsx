import { Navigate } from "react-router-dom";
import { useAuth } from "./../context";

const ProtectedRoute = ({ children }) => {
  const { userLoggedIn } = useAuth(); // ใช้ context ในการเช็คว่าผู้ใช้ล็อกอินแล้วหรือยัง

  if (!userLoggedIn) {
    // ถ้าไม่ได้ล็อกอิน ให้ redirect ไปที่หน้า login
    return <Navigate to="/login" replace />;
  }

  return children; // ถ้าล็อกอินแล้ว แสดง children (เนื้อหาของ Protected Route)
};

export default ProtectedRoute;