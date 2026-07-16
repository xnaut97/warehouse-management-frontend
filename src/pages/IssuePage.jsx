import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import issueApi from "../api/issueApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import IssueTable from "../components/issues/IssueTable.jsx";
import Pagination from "../components/common/Pagination.jsx";

function IssuePage() {

    const [issues, setIssues] = useState([]);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);

    const [pageSize, setPageSize] = useState(8);

    const [totalPages, setTotalPages] = useState(0);


    const loadIssues = async () => {

        try {

            const response = await issueApi.getAll({
                page,
                size: pageSize,
            });


            const data = response.data.data;

            setIssues(data.content);

            setTotalPages(data.totalPages);


        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        loadIssues();

    }, [page, pageSize]);


    const filteredIssues = issues.filter((issue) => {

        const keyword = search.toLowerCase();

        return (

            issue.issueNo.toLowerCase().includes(keyword) ||

            issue.customer.toLowerCase().includes(keyword) ||

            issue.warehouse.toLowerCase().includes(keyword)

        );

    });


    return (

        <div>

            <PageHeader
                title="Phiếu xuất"
                description="Quản lý phiếu xuất kho."
                actionLabel="Thêm phiếu xuất"
                actionIcon={<Plus size={18} />}
                onAction={() => {

                    // TODO

                }}
            />


            <TableToolbar
                search={search}
                setSearch={setSearch}
            />


            <IssueTable
                issues={filteredIssues}
            />


            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />


        </div>

    );

}

export default IssuePage;