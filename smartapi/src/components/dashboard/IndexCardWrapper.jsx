import { useLiveData } from "../../hooks/use_live_data";
import IndexCard from "./IndexCard";
import { useSelector } from "react-redux";

export function IndexCardWrapper({ index }) {
  const liveData = useSelector((state) => state.liveData.data[index.token]);

  const value = liveData ? liveData.last_traded_price / 100 : index.value;
  const change = liveData
    ? (liveData.last_traded_price - liveData.closed_price) / 100
    : index.change;
  const changePercentage = liveData
    ? ((change / (liveData.last_traded_price / 100)) * 100).toFixed(2)
    : index.changePercentage;
  const isPositive = change >= 0;

  return (
    <IndexCard
      name={index.name}
      value={value}
      change={change}
      changePercentage={changePercentage}
      isPositive={isPositive}
    />
  );
}
