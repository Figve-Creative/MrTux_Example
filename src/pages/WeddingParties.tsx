import { Navigate } from "react-router-dom";

// Old /wedding-parties links now land on the combined booking page.
const WeddingParties = () => <Navigate to="/book?for=wedding" replace />;

export default WeddingParties;
