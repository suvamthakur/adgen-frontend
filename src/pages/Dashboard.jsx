import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    user && (
      <div className="container mx-auto px-4 py-4">
        <div className="bg-darker rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.firstName}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-darkest rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">
                Video Generation Limit
              </h3>
              <div className="flex items-center justify-between">
                <span>Used: {user?.generationCount}</span>
                <span>Limit: {user?.generationLimit || ""}</span>
              </div>
              <div className="w-full bg-darker rounded-full h-2.5 mt-2">
                <div
                  className="bg-lighter h-2.5 rounded-full"
                  style={{
                    width: `${
                      ((user?.generationCount || 0) /
                        (user?.generationLimit || 3)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-darkest rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
              <div className="flex flex-col space-y-2">
                <a
                  href="/generate-ads"
                  className="bg-lighter text-lightest py-2 px-4 rounded-md text-center hover:bg-opacity-90 transition-colors"
                >
                  Create New Ad
                </a>
                <a
                  href="/previous-orders"
                  className="bg-transparent border border-lighter text-lightest py-2 px-4 rounded-md text-center hover:bg-lighter hover:bg-opacity-10 transition-colors"
                >
                  View Previous Ads
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
