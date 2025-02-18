import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "Page Not Found | E&L Delicatessen";
  }, []);

  return (
    <section className="h-screen text-center flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold">404 Not Found</h1>
      <p className="text-xl">This page does not exist</p>
      <Link
        to="/dashboard/overview"
        className="text-white bg-primary hover:bg-secondary rounded-md px-3 py-2 mt-4"
      >
        Go Back
      </Link>
    </section>
  );
};
export default NotFoundPage;
