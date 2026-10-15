import { Navigate, useLocation } from "react-router-dom";

// "Start Your Order" became /book (Book an Appointment / Submit Your Measurements)
// when the site launched as an appointment-first MVP. This stays only so old
// links and bookmarks still land somewhere useful; it keeps any ?for= param.
const StartOrder = () => {
  const { search } = useLocation();
  return <Navigate to={`/book${search}`} replace />;
};

export default StartOrder;
