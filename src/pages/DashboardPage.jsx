import {useEffect, useRef, useState} from "react";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import dashboardApi from "../api/dashboardApi.js";
import InventoryAnalysis from "../components/dashboard/InventoryAnalysis.jsx";
import VarianceAnalysis from "../components/dashboard/VarianceAnalysis.jsx";
import DecisionSupport from "../components/dashboard/DecisionSupport.jsx";
import OperationAlerts from "../components/dashboard/OperationAlerts.jsx";
import QuickActions from "../components/dashboard/QuickActions.jsx";
import RecentTransactions from "../components/dashboard/RecentTransactions.jsx";

function DashboardPage() {

    const loaded = useRef(false);


    const [overview, setOverview] = useState([]);
    const [inventoryAnalysis, setInventoryAnalysis] = useState([]);
    const [inventoryTrend, setInventoryTrend] = useState([]);
    const [varianceAnalysis, setVarianceAnalysis] = useState([]);
    const [decisionSupport, setDecisionSupport] = useState([]);
    const [operationAlerts, setOperationAlerts] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState(null);

    useEffect(() => {

        if (loaded.current) return;

        loaded.current = true;


        const loadDashboard = async () => {

            const [
                overview,
                summary,
                invAnalysis,
                invTrend,
                varianceAnalysis,
                decisionSupport,
                operationAlerts,
                recentTransactions
            ] = await Promise.all([
                dashboardApi.getOverview(),
                dashboardApi.getSummary(),
                dashboardApi.getInventoryAnalysis(),
                dashboardApi.getInventoryTrend(),
                dashboardApi.getInventoryVariance(),
                dashboardApi.getDecisionSupport(),
                dashboardApi.getOperationAlerts(),
                dashboardApi.getRecentTransactions()
            ]);


            setOverview(overview.data.data);
            setInventoryAnalysis(invAnalysis.data.data);
            setInventoryTrend(invTrend.data.data);
            setVarianceAnalysis(varianceAnalysis.data.data);
            setDecisionSupport(decisionSupport.data.data);
            setOperationAlerts(operationAlerts.data.data);
            setRecentTransactions(recentTransactions.data.data);

        };


        loadDashboard();

    }, []);

    return (

        <div>

            <div className="grid gap-10 md:col-span-2 xl:col-span-4">

                <OverviewCards
                    data={overview}
                />

                <OperationAlerts
                    data={operationAlerts}
                />

                <QuickActions />

                <RecentTransactions
                    data={recentTransactions}
                />


                <div className="border-t border-(--color-border) pt-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-400">
                            Báo cáo tác nghiệp
                        </h2>
                    </div>

                    <InventoryAnalysis
                        analysis={inventoryAnalysis}
                        trend={inventoryTrend}
                    />
                </div>


                <div className="border-t border-(--color-border) pt-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-400">
                            Báo cáo trực quan
                        </h2>
                    </div>

                    <div className="grid gap-10">
                        <VarianceAnalysis
                            data={varianceAnalysis}
                        />

                        <DecisionSupport
                            data={decisionSupport}
                        />
                    </div>
                </div>

            </div>

        </div>

    );

}

export default DashboardPage;
