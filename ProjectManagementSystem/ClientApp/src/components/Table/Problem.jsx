import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Button } from "antd";

const ProjectDetailProblem = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMenuType, setStatusMenuType] = useState("Status");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    status: "All",
    sprint: "All",
    category: "All",
    keyword: "",
  });

  // Fetch data
  const fetchData = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(
        `problems/get-list?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&status=${params.pagination.status}&sprint=${params.pagination.sprint}&category=${params.pagination.category}&sortField=${params.sortField}&sortOrder=${params.sortOrder}&projectId=${props.projectId}`
      )
      .then((results) => {
        results.data.problems.forEach((element) => {
          element.startedDate = moment(element.startedDate).format(
            "DD/MM/YYYY"
          );
          element.endedDate = moment(element.endedDate).format("DD/MM/YYYY");
        });
        setData(results.data.problems);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: results.data.totalItem,
        });
      });
  };

  // Status menu on click
  const handleStatusMenuClick = (e) => {
    setPagination((pagination.status = e.key));
    setStatusMenuType(e.key);
    fetchData({
      pagination,
    });
  };

  // Table columns
  const columns = [
    {
      title: "Code",
      dataIndex: "problemCode",
      ellipsis: true,
      width: "15%",
      defaultSortOrder: "descend",
    },
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Status",
      width: "20%",
      dataIndex: "status",
      render: (id, record) =>
        record.status === "ProductBacklog" ? (
          <div className="status-waiting">Product Backlog</div>
        ) : record.status === "Backlog" ? (
          <div className="status-waiting">Backlog</div>
        ) : record.status === "Pending" ? (
          <div className="status-waiting">Pending</div>
        ) : record.status === "Todo" ? (
          <div className="status-todo">To Do</div>
        ) : record.status === "InProgress" ? (
          <div className="status-progress">In Progress</div>
        ) : record.status === "InReview" ? (
          <div className="status-review">In Review</div>
        ) : (
          <div className="status-complete">Complete</div>
        ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (id, record) => (
        <div className="table-button-group">
          <i
            className="fa-solid fa-circle-exclamation fa-lg detail-button"
            onClick={() => navigate(`${id}`)}
          ></i>
        </div>
      ),
    },
  ];

  // Filter status menu
  const statusMenu = (
    <Menu
      onClick={handleStatusMenuClick}
      items={[
        {
          label: "All",
          key: "All",
        },
        {
          label: "Product Backlog",
          key: "ProductBacklog",
        },
        {
          label: "Backlog",
          key: "Backlog",
        },
        {
          label: "Pending",
          key: "Pending",
        },
        {
          label: "To do",
          key: "Todo",
        },
        {
          label: "In Progress",
          key: "InProgress",
        },
        {
          label: "In Review",
          key: "InReview",
        },
        {
          label: "Complete",
          key: "Complete",
        },
      ]}
    />
  );

  // Table on change
  const onChange = (newPagination, filters, sorter, extra) => {
    fetchData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...filters,
    });
  };

  useEffect(() => {
    fetchData({
      pagination,
    });
  }, []);

  return (
    <div>
      {/* Filter status menu */}
      <Dropdown overlay={statusMenu} placement="bottom">
        <Button className="btn-filter" style={{ marginBottom: "0.5rem" }}>
          <span></span>
          {statusMenuType}
          <FilterOutlined />
        </Button>
      </Dropdown>

      {/* Problem table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />
    </div>
  );
};

export default ProjectDetailProblem;
