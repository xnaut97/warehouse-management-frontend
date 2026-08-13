import {
    BrowserRouter, Routes, Route, Navigate
} from "react-router-dom";

import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout.jsx";
import UserPage from "../pages/UserPage.jsx";
import SupplierPage from "../pages/SupplierPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import MaterialPage from "../pages/MaterialPage.jsx";
import WarehousePage from "../pages/WarehousePage.jsx";
import ReceiptDetail from "../components/receipts/ReceiptDetail.jsx";
import ReceiptPage from "../pages/ReceiptPage.jsx";
import IssueDetail from "../components/issues/IssueDetail.jsx";
import IssuePage from "../pages/IssuePage.jsx";
import CustomerPage from "../pages/CustomerPage.jsx";
import LowStockPage from "../pages/LowStockPage.jsx";
import InventoryPage from "../pages/InventoryPage.jsx";
import InventoryDetail from "../components/inventory/InventoryDetail.jsx";
import GuestRoute from "./GuestRoute.jsx";
import ProductPage from "../pages/ProductPage.jsx";
import ReportsPage from "../pages/reports/ReportsPage.jsx";
import ReceiptReport from "../pages/reports/ReceiptReport.jsx";
import IssueReport from "../pages/reports/IssueReport.jsx";
import InventoryReport from "../pages/reports/InventoryReport.jsx";
import StocktakingReport from "../pages/reports/StocktakingReport.jsx";
import AuditLog from "../pages/reports/AuditLog.jsx";
import ReceiptsIssuesPage from "../pages/ReceiptsIssuesPage.jsx";
import MaterialConsumptionPage from "../pages/MaterialConsumptionPage.jsx";
import ReceiptNew from "../components/receipts/ReceiptNew.jsx";
import IssueNew from "../components/issues/IssueNew.jsx";
import ProductReceiptDetailPage from "../pages/ProductReceiptDetailPage.jsx";
import ProductIssueDetailPage from "../pages/ProductIssueDetailPage.jsx";
import StocktakingPage from "../pages/StocktakingPage.jsx";
import StocktakingDetailPage from "../pages/StocktakingDetailPage.jsx";
import ProductDocumentNew from "../components/products/ProductDocumentNew.jsx";
import MaterialBOMPage from "../pages/MaterialBOMPage.jsx";

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    }
                />


                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="/dashboard"
                    element={<ProtectedRoute>

                        <AppLayout>

                            <DashboardPage/>

                        </AppLayout>

                    </ProtectedRoute>}
                />

                {/*<Route*/}

                {/*    path="/users"*/}

                {/*    element={*/}

                {/*        <ProtectedRoute>*/}

                {/*            <AppLayout>*/}

                {/*                <UserPage/>*/}

                {/*            </AppLayout>*/}

                {/*        </ProtectedRoute>*/}

                {/*    }*/}

                {/*/>*/}

                {/*<Route*/}
                {/*    path="/suppliers"*/}
                {/*    element={<ProtectedRoute>*/}

                {/*        <AppLayout>*/}

                {/*            <SupplierPage/>*/}

                {/*        </AppLayout>*/}

                {/*    </ProtectedRoute>}*/}
                {/*/>*/}

                <Route

                    path="/materials"

                    element={

                        <ProtectedRoute>

                            <AppLayout>

                                <MaterialPage/>

                            </AppLayout>

                        </ProtectedRoute>

                    }

                />

                {/*<Route*/}

                {/*    path="/warehouses"*/}

                {/*    element={*/}

                {/*        <ProtectedRoute>*/}

                {/*            <AppLayout>*/}

                {/*                <WarehousePage/>*/}

                {/*            </AppLayout>*/}

                {/*        </ProtectedRoute>*/}

                {/*    }*/}

                {/*/>*/}

                <Route
                    path="/material-bom"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <MaterialBOMPage/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/materials-consumptions"
                    element=
                        {
                            <ProtectedRoute>
                                <AppLayout>
                                    <MaterialConsumptionPage/>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/receipts/new"
                    element=
                        {
                            <ProtectedRoute>
                                <AppLayout>
                                    <ReceiptNew/>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/receipts/:id"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ReceiptDetail/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                {/*<Route*/}
                {/*    path="/issues"*/}
                {/*    element=*/}
                {/*        {*/}
                {/*            <ProtectedRoute>*/}
                {/*                <AppLayout>*/}
                {/*                    <IssuePage/>*/}
                {/*                </AppLayout>*/}
                {/*            </ProtectedRoute>*/}
                {/*        }*/}
                {/*/>*/}

                <Route
                    path="/issues/new"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <IssueNew />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/issues/:id"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <IssueDetail />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/receipts-issues"
                    element=
                        {
                            <ProtectedRoute>
                                <AppLayout>
                                    <ReceiptsIssuesPage/>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/customers"
                    element=
                        {
                            <ProtectedRoute>
                                <AppLayout>
                                    <CustomerPage/>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/inventories/low-stock"
                    element={<LowStockPage />}
                />

                <Route
                    path="/inventories"
                    element=
                        {
                            <ProtectedRoute>
                                <AppLayout>
                                    <InventoryPage/>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/inventories/:id"
                    element={<InventoryDetail />}
                />

                <Route
                    path="/products"
                    element=
                        {
                            <ProtectedRoute>
                                <AppLayout>
                                    <ProductPage/>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ReportsPage/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports/receipts"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ReceiptReport/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports/issues"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <IssueReport/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/reports/inventory"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <InventoryReport/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports/stocktaking"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <StocktakingReport/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports/audit-logs"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AuditLog/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/stocktaking"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <StocktakingPage/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/stocktaking/:id"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <StocktakingDetailPage/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/product-receipts/new"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ProductDocumentNew transactionType="RECEIPT"/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/product-issues/new"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ProductDocumentNew transactionType="ISSUE"/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/product-receipts/:id"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ProductReceiptDetailPage/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/product-issues/:id"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ProductIssueDetailPage/>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

            </Routes>


        </BrowserRouter>

    )

}


export default AppRouter;
