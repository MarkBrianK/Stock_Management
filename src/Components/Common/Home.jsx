import React from "react";
import BrandingOverview from "../Dashboard/BrandingOverview";
import SalesOverview from "../Dashboard/SalesOverview";
import StockOverview from "../Dashboard/StockOverview";
import ProfitOverview from "../Dashboard/ProfitOverview";

function Home() {
  return (
    <div>
      <ProfitOverview />
      <StockOverview />
      <SalesOverview />
      <BrandingOverview />



    </div>
  );
}

export default Home;
