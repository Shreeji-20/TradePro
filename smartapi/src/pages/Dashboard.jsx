import MarketOverview from "../components/dashboard/MarketOverview";
import IndexChart from "../components/dashboard/IndexChart";
import {useLiveData} from "../hooks/use_live_data"
const Dashboard = () => {
  
  return (
    
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* <DashboardHeader /> */}
      <useLiveData />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="animate-fade-in">
          <MarketOverview />

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Market Charts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IndexChart name="NIFTY 50" isPositive={true} />
              <IndexChart name="BANK NIFTY" isPositive={false} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner border-t py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Market data is delayed by 15 minutes. For educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
