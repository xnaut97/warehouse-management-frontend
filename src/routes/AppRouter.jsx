import {
    BrowserRouter, Routes, Route
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
                    element={<ProtectedRoute>

                        <AppLayout>

                            <DashboardPage/>

                        </AppLayout>

                    </ProtectedRoute>}
                />

                <Route
                    path="/dashboard"
                    element={<ProtectedRoute>

                        <AppLayout>

                            <DashboardPage/>

                        </AppLayout>

                    </ProtectedRoute>}
                />

                <Route

                    path="/users"

                    element={

                        <ProtectedRoute>

                            <AppLayout>

                                <UserPage/>

                            </AppLayout>

                        </ProtectedRoute>

                    }

                />

                <Route
                    path="/suppliers"
                    element={<ProtectedRoute>

                        <AppLayout>

                            <SupplierPage/>

                        </AppLayout>

                    </ProtectedRoute>}
                />

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

                <Route

                    path="/warehouses"

                    element={

                        <ProtectedRoute>

                            <AppLayout>

                                <WarehousePage/>

                            </AppLayout>

                        </ProtectedRoute>

                    }

                />

                <Route
                    path="/receipts"
                    element=
                        {
                            <ProtectedRoute>
                                <AppLayout>
                                    <ReceiptPage/>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/receipts/:id"
                    element={<ReceiptDetail/>}
                />

                <Route
                    path="/issues"
                    element=
                        {
                            <ProtectedRoute>
                                <AppLayout>
                                    <IssuePage/>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/issues/:id"
                    element={<IssueDetail/>}
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

            </Routes>


        </BrowserRouter>

    )

}


export default AppRouter;