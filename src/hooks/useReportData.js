import { useCallback, useEffect, useState } from "react";

import { unwrap } from "../components/reports/reportUtils.js";

const resolveMessage = (error) =>
    error?.response?.data?.message ??
    error?.message ??
    "Không tải được dữ liệu báo cáo.";

export function useReportData(request, dependencies = []) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadToken, setReloadToken] = useState(0);

    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    useEffect(() => {

        let active = true;

        const load = async () => {

            setLoading(true);
            setError(null);

            try {
                const response = await request();

                if (!active) return;

                setData(unwrap(response, null));
            } catch (requestError) {
                if (!active) return;

                setData(null);
                setError(resolveMessage(requestError));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }

        };

        load();

        return () => {
            active = false;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies, reloadToken]);

    return { data, loading, error, reload };

}

export default useReportData;
