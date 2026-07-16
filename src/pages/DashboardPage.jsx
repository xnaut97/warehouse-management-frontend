import {useEffect, useRef, useState} from "react";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import dashboardApi from "../api/dashboardApi.js";
import InventoryAnalysis from "../components/dashboard/InventoryAnalysis.jsx";
import VarianceAnalysis from "../components/dashboard/VarianceAnalysis.jsx";
import DecisionSupport from "../components/dashboard/DecisionSupport.jsx";

function DashboardPage() {

    const loaded = useRef(false);


    const [overview, setOverview] = useState([]);
    const [inventoryAnalysis, setInventoryAnalysis] = useState([]);
    const [inventoryTrend, setInventoryTrend] = useState([]);
    const [varianceAnalysis, setVarianceAnalysis] = useState([]);
    const [decisionSupport, setDecisionSupport] = useState([]);

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
                decisionSupport
            ] = await Promise.all([
                dashboardApi.getOverview(),
                dashboardApi.getSummary(),
                dashboardApi.getInventoryAnalysis(),
                dashboardApi.getInventoryTrend(),
                dashboardApi.getInventoryVariance(),
                dashboardApi.getDecisionSupport()
            ]);


            setOverview(overview.data.data);
            setInventoryAnalysis(invAnalysis.data.data);
            setInventoryTrend(invTrend.data.data);
            setVarianceAnalysis(varianceAnalysis.data.data);
            setDecisionSupport(decisionSupport.data.data);

        };


        loadDashboard();

    }, []);

    return (

        <div>

            {/*<DashboardHeader/>*/}

            <div className="grid gap-10 md:col-span-2 xl:col-span-4">

                <OverviewCards
                    data={overview}
                />

                <InventoryAnalysis
                    analysis={inventoryAnalysis}
                    trend={inventoryTrend}
                />

                <VarianceAnalysis
                    data={varianceAnalysis}
                />

                <DecisionSupport
                    data={decisionSupport}
                />

            </div>

        </div>

    );

}

export default DashboardPage;