import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import problemService from "../../../services/problemService";
import userService from "../../../services/userService";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Input, Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";

const ProblemTable = (props) => {
  const userId = props.user.id;
  const { Search } = Input;
  const navigate = useNavigate();
  const [isUserAssign, setIsUserAssign] = useState(false);
  const [problemId, setProblemId] = useState();
  const [problemCanDisable, setProblemCanDisable] = useState(false);
  const [data, setData] = useState();
  const [sprint, setSprint] = useState([]);
  const [category, setCategory] = useState([]);
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
    userService.checkUserAssigned(userId).then((response) => {
      setIsUserAssign(response.data);
      if (response.data == true) {
        axiosInstance
          .get(
            `problems/get-list?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&status=${params.pagination.status}&sprint=${params.pagination.sprint}&category=${params.pagination.category}&sortField=${params.sortField}&sortOrder=${params.sortOrder}&userId=${props.user.id}`
          )
          .then((results) => {
            results.data.problems.forEach((element) => {
              element.startedDate = moment(element.startedDate).format(
                "DD/MM/YYYY"
              );
              element.endedDate = moment(element.endedDate).format(
                "DD/MM/YYYY"
              );
            });
            setData(results.data.problems);
            setLoading(false);
            setPagination({
              ...params.pagination,
              total: results.data.totalItem,
            });
          });
      }
    });
  };

  // Fetch filters
  const fetchFilter = (id) => {
    problemService.getFilters(id).then((result) => {
      var allFilter = { label: "All", key: "All" };
      var sprintFilter = result.data.sprints;
      var categoryFilter = result.data.categories;
      sprintFilter.unshift(allFilter);
      categoryFilter.unshift(allFilter);
      setSprint(result.data.sprints);
      setCategory(result.data.categories);
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

  // Can problem disable
  const problemDisable = (record) => {
    if (record.status === "Waiting For Acceptance") {
      setProblemCanDisable(true);
      setProblemId(record.id);
    } else setProblemCanDisable(false);
  };

  // Table columns
  const columns = [
    {
      title: "Code",
      dataIndex: "problemCode",
      ellipsis: true,
      width: "8%",
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
      title: "Category",
      width: "10%",
      dataIndex: "category",
    },
    {
      title: "Developer",
      width: "13%",
      ellipsis: true,
      dataIndex: "developerName",
    },
    {
      title: "Start Date",
      width: "10%",
      dataIndex: "startedDate",
      sorter: true,
    },
    {
      title: "End Date",
      width: "10%",
      dataIndex: "endedDate",
      sorter: true,
    },
    {
      title: "Sprint",
      width: "8%",
      dataIndex: "sprintName",
    },
    {
      title: "Status",
      width: "10%",
      dataIndex: "status",
      render: (id, record) =>
        record.status === "Pending" ? (
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
      width: "15%",
      render: (id, record) => (
        <div className="table-button-group">
          <i
            className="fa-solid fa-pen-to-square fa-lg edit-button"
            onClick={() => navigate(`update/${id}`)}
          ></i>
          <i
            className="fa-solid fa-trash fa-lg delete-button"
            data-toggle="modal"
            data-target="#disableProblemModal"
            onClick={() => problemDisable(record)}
          ></i>
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

  // Filter sprint menu
  const sprintMenu = <Menu onClick={handleSprintMenuClick} items={sprint} />;

  // Filter category menu
  const categoryMenu = (
    <Menu onClick={handleCategoryMenuClick} items={category} />
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
    fetchFilter(userId);
  }, []);

  return isUserAssign === true ? (
    <div className="problem-table">
      <p className="header-problem-list">Problem List</p>

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
        className="create-problem-button"
        type="primary"
        onClick={() => navigate("/problems/add")}
      >
        Add new problem
      </Button>

      {/* Search bar */}
      <Search onSearch={onSearch} className="search-box" />

      {/* Problem table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />

      {/* Disable problem modal */}
      <div
        className="modal fade"
        id="disableProblemModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="disableProblemModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="disable-problem-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Disable Problem</h5>
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
              {problemCanDisable === true
                ? "Are you sure you want to disable this problem?"
                : "This problem is currently assigned to a developer"}
            </div>
            {problemCanDisable === true ? (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-confirm-scrum-master"
                  data-dismiss="modal"
                  onClick={() => {
                    problemService.disable(problemId).then(() => {
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
            ) : (
              <div className="modal-footer"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="no-assign-error">
      <div>
        <i class="fa-solid fa-users-slash fa-xl"></i>
      </div>
      <p>User is not assigned to a project!</p>
    </div>
  );
};

export default ProblemTable;
