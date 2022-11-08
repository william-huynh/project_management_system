import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import assignmentService from "../../services/assignmentService";
import userService from "../../services/userService";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Input, Button } from "antd";
import "antd/dist/antd.css";

const HomeAssignment = (props) => {
  const role = props.user.role[0];
  const userId = props.user.id;
  const { Search } = Input;
  const navigate = useNavigate();
  const [isUserAssign, setIsUserAssign] = useState(false);
  const [assignmentId, setAssignmentId] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [sprint, setSprint] = useState([]);
  const [category, setCategory] = useState([]);
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
            `assignments/get-assigned-list?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&status=${params.pagination.status}&sprint=${params.pagination.sprint}&category=${params.pagination.category}&sortField=${params.sortField}&sortOrder=${params.sortOrder}&userId=${props.user.id}`
          )
          .then((results) => {
            results.data.assignments.forEach((element) => {
              element.startedDate = moment(element.startedDate).format(
                "DD/MM/YYYY"
              );
              element.endedDate = moment(element.endedDate).format(
                "DD/MM/YYYY"
              );
            });
            setData(results.data.assignments);
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
    assignmentService.getFilters(id).then((result) => {
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

  // Table columns
  const columns = [
    {
      title: "Code",
      dataIndex: "assignmentCode",
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
      title: "Type",
      width: "10%",
      ellipsis: true,
      // dataIndex: "category",
    },
    {
      title: "Category",
      width: "10%",
      ellipsis: true,
      dataIndex: "category",
    },
    {
      title: "Start Date",
      width: "10%",
      dataIndex: "startedDate",
    },
    {
      title: "End Date",
      width: "10%",
      dataIndex: "endedDate",
    },
    {
      title: "Sprint",
      width: "8%",
      ellipsis: true,
      sorter: true,
      dataIndex: "sprintName",
    },
    {
      title: "Status",
      width: "10%",
      ellipsis: true,
      sorter: true,
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
      render: (id, record) =>
        record.status === "Pending" ? (
          <div className="table-button-group">
            <i
              className="fa-solid fa-check fa-xl detail-button"
              data-toggle="modal"
              data-target="#acceptAssignmentModal"
              onClick={() => setAssignmentId(id)}
            ></i>
            <i
              className="fa-solid fa-xmark fa-xl delete-button"
              data-toggle="modal"
              data-target="#denyAssignmentModal"
              onClick={() => setAssignmentId(id)}
            ></i>
            <i
              className="fa-solid fa-circle-exclamation fa-lg edit-button"
              // onClick={() => navigate(`${id}`)}
            ></i>
          </div>
        ) : (
          <div className="table-button-group">
            <i className="fa-solid fa-check fa-lg detail-button-disabled"></i>
            <i className="fa-solid fa-xmark fa-xl delete-button-disabled"></i>
            <i
              className="fa-solid fa-circle-exclamation fa-lg edit-button"
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
    <div className="assignment-table">
      <p
        className={`${
          role === "ScrumMaster"
            ? "header-assignment-list"
            : "header-assignment-list-developer"
        }`}
      >
        Assignment List
      </p>

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

      {/* Change to board view button */}
      <Button
        className="create-assignment-button"
        type="primary"
        onClick={() => navigate("/board")}
      >
        Change to board view
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

      {/* Accept assignment modal */}
      <div
        className="modal fade"
        id="acceptAssignmentModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="acceptAssignmentModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="accept-assignment-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Accept Assignment
              </h5>
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
              Do you want to accept this assignment?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn ${
                  role === "ScrumMaster"
                    ? "btn-confirm-scrum-master"
                    : "btn-confirm-developer"
                }`}
                data-dismiss="modal"
                onClick={() => {
                  assignmentService.accept(assignmentId).then(() => {
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

      {/* Deny assignment modal */}
      <div
        className="modal fade"
        id="denyAssignmentModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="denyAssignmentModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="deny-assignment-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Deny Assignment
              </h5>
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
              Do you want to turn down this assignment?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn ${
                  role === "ScrumMaster"
                    ? "btn-confirm-scrum-master"
                    : "btn-confirm-developer"
                }`}
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
  ) : (
    <div className="no-assign-error">
      <div>
        <i className="fa-solid fa-users-slash fa-xl"></i>
      </div>
      <p>User is not assigned to a project!</p>
    </div>
  );
};

export default HomeAssignment;
