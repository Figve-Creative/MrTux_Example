import { Navigate } from "react-router-dom";

// Wedding party intake now lives inside the Start Your Order flow (the "For a
// Wedding Party" path). This route stays in place purely so an old bookmark
// or external link to /wedding-parties still lands somewhere useful instead
// of a 404 — ?for=wedding pre-selects that path on arrival.
const WeddingParties = () => <Navigate to="/start-your-order?for=wedding" replace />;

export default WeddingParties;
