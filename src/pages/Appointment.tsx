import { Navigate } from "react-router-dom";

// Old /appointment links now land on the combined booking page.
const Appointment = () => <Navigate to="/book?for=appointment" replace />;

export default Appointment;
