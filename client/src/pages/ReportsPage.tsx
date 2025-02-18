import { useEffect } from "react";
import PageTitle from "../components/common/utils/PageTitle";

const ReportsPage = () => {
  useEffect(() => {
    document.title = "Reports | E&L Delicatessen";
  }, []);

  return (
    <>
      <PageTitle>Reports Page</PageTitle>
    </>
  );
};

export default ReportsPage;
