import { Navigate } from "react-router-dom";

// Booking a visit is now the last step of the Start Your Order flow, so every
// entry point on the site links there directly. This route stays in place
// (rather than being deleted) purely so an old bookmark or external link to
// /appointment still lands somewhere useful instead of a 404.
const Appointment = () => <Navigate to="/start-your-order" replace />;

export default Appointment;
