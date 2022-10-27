import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import assignmentService from "../../../services/assignmentService";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Input, Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";

const AssignmentTable = (props) => {
  const { Search } = Input;
  const navigate = useNavigate();
  const [assignmentId, setAssignmentId] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [statusMenuType, setStatusMenuType] = useState("Status");
  const [sprintMenuType, setSprintMenuType] = useState("Sprint");
  const [categoryMenuType, setCategoryMenuType] = useState("Category");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
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
        `assignments/get-list?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&status=${params.pagination.status}&sprint=${params.pagination.sprint}&sortField=${params.sortField}&sortOrder=${params.sortOrder}&userId=${props.user.id}`
      )
      .then((results) => {
        results.data.assignments.forEach((element) => {
          element.startedDate = moment(element.startedDate).format(
            "DD/MM/YYYY"
          );
          element.endedDate = moment(element.endedDate).format("DD/MM/YYYY");
        });
        setData(results.data.assignments);
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

  // Sprint menu on click
  const handleSprintMenuClick = (e) => {
    setPagination((pagination.sprint = e.key));
    setSprintMenuType(e.key);
    fetchData({
      pagination,
    });
  };

  // Category menu on click
  const handleCategoryMenuClick = (e) => {
    setPagination((pagination.category = e.key));
    setCategoryMenuType(e.key);
    fetchData({
      pagination,
    });
  };

  // On search enter
  const onSearch = (value) => {
    setPagination((pagination.keyword = value), (pagination.current = 1));
    fetchData({
      pagination,
    });
  };

  // Table columns
  const columns = [
    {
      title: "Assignment Code",
      dataIndex: "assignmentCode",
      ellipsis: true,
      defaultSortOrder: "ascend",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      sorter: true,
    },
    {
      title: "Start Date",
      width: "15%",
      dataIndex: "startedDate",
      sorter: true,
    },
    {
      title: "End Date",
      width: "15%",
      dataIndex: "endedDate",
      sorter: true,
    },
    {
      title: "Sprint",
      width: "10%",
      dataIndex: "sprintName",
    },
    {
      title: "Status",
      width: "10%",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      width: "15%",
      render: (id, record) => (
        <div className="table-button-group">
          {/* {record.advisor.id === props.user.id ? ( */}
          <i
            className="fa-solid fa-pen-to-square fa-lg edit-button"
            //   onClick={() => navigate(`update/${id}`)}
          ></i>
          {/* ) : (
            <i className="fa-solid fa-pen-to-square fa-lg edit-button disabled edit-button-disabled"></i>
          )} */}
          {/* {record.scrumMaster.id === null ? ( */}
          <i
            className="fa-solid fa-xmark fa-xl delete-button"
            data-toggle="modal"
            data-target="#disableAssignmentModal"
            //   onClick={() => setAssignmentId(id)}
          ></i>
          {/* ) : (
            <i className="fa-solid fa-xmark fa-xl delete-button disabled delete-button-disabled"></i>
          )} */}
          <i
            className="fa-solid fa-circle-exclamation fa-lg detail-button"
            // onClick={() => navigate(`${id}`)}
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
          label: "Active",
          key: "Active",
        },
        {
          label: "Complete",
          key: "Complete",
        },
      ]}
    />
  );

  // Filter sprint menu
  const sprintMenu = (
    <Menu
      onClick={handleSprintMenuClick}
      items={[
        {
          label: "All",
          key: "All",
        },
        {
          label: "Sprint 01",
          key: "Sprint 01",
        },
        {
          label: "Sprint 02",
          key: "Sprint 02",
        },
      ]}
    />
  );

  // Filter category menu
  const categoryMenu = (
    <Menu
      onClick={handleCategoryMenuClick}
      items={[
        {
          label: "All",
          key: "All",
        },
        {
          label: "UI",
          key: "UI",
        },
        {
          label: "Database",
          key: "Database",
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
    <div className="assignment-table">
      <p className="header-assignment-list">Assignment List</p>

      {/* Filter status menu */}
      <Dropdown overlay={statusMenu} placement="bottom">
        <Button className="btn-filter" style={{ marginTop: "0.5rem" }}>
          <span></span>
          {statusMenuType}
          <FilterOutlined />
        </Button>
      </Dropdown>

      {/* Filter sprint menu */}
      <Dropdown overlay={sprintMenu} placement="bottom">
        <Button
          className="btn-filter"
          style={{ marginTop: "0.5rem", marginLeft: "2rem" }}
        >
          <span></span>
          {sprintMenuType}
          <FilterOutlined />
        </Button>
      </Dropdown>

      {/* Filter category menu */}
      <Dropdown overlay={categoryMenu} placement="bottom">
        <Button
          className="btn-filter"
          style={{ marginTop: "0.5rem", marginLeft: "2rem" }}
        >
          <span></span>
          {categoryMenuType}
          <FilterOutlined />
        </Button>
      </Dropdown>

      {/* Create new user button */}
      <Button
        className="create-assignment-button"
        type="primary"
        onClick={() => navigate("/assignments/add")}
      >
        Add new assignment
      </Button>

      {/* Search bar */}
      <Search onSearch={onSearch} className="search-box" />

      {/* Assignment table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />

      {/* Disable assignment modal */}
      <div
        className="modal fade"
        id="disableAssignmentModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="disableAssignmentModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="disable-assignment-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Disable Assignment</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure you want to disable this assignment?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-confirm-scrum-master"
                data-dismiss="modal"
                onClick={() => {
                  assignmentService.disable(assignmentId).then(() => {
                    fetchData({
                      pagination,
                    });
                  });
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                data-dismiss="modal"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentTable;
