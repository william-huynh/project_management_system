import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import userService from "../../../services/userService";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Input, Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";

const UserTable = () => {
  const { Search } = Input;
  const navigate = useNavigate();
  const [userDisable, setUserDisable] = useState(false);
  const [userId, setUserId] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [menuType, setMenuType] = useState("Type");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    type: "All",
    keyword: "",
  });

  // Fetch data
  const fetchData = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(
        `users/getlist?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&roles=${params.pagination.type}&sortField=${params.sortField}&sortOrder=${params.sortOrder}`
      )
      .then((results) => {
        results.data.users.forEach((element) => {
          element.dateOfBirth = moment(element.dateOfBirth).format(
            "DD/MM/YYYY"
          );
          element.role =
            element.role === "ProductOwner"
              ? "Product Owner"
              : element.role === "ScrumMaster"
              ? "Scrum Master"
              : "Developers";
        });
        console.log(results);
        setData(results.data.users);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: results.data.totalItem,
        });
      });
  };

  // Menu on click
  const handleMenuClick = (e) => {
    let filter = "";
    switch (e.key) {
      case "Product Owner":
        filter = "ProductOwner";
        break;
      case "Scrum Master":
        filter = "ScrumMaster";
        break;
      case "Developer":
        filter = "Developer";
        break;
      default:
        break;
    }
    setPagination((pagination.type = filter));
    setMenuType(e.key);
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

  // Check can user disable
  const canDisable = (record) => {
    setUserId(record.id);
    if (record.role === "Product Owner")
      userService.checkAdvisorDisable(record.id).then((response) => {
        setUserDisable(response.data);
      });
    else
      userService.checkDeveloperDisable(record.id).then((response) => {
        setUserDisable(response.data);
      });
  };

  // Table columns
  const columns = [
    {
      title: "User Code",
      dataIndex: "userCode",
      ellipsis: true,
      defaultSortOrder: "ascend",
      sorter: true,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      ellipsis: true,
      sorter: true,
    },
    {
      title: "Username",
      dataIndex: "userName",
      ellipsis: true,
      sorter: true,
    },
    {
      title: "Date of Birth",
      width: "15%",
      dataIndex: "dateOfBirth",
      sorter: true,
    },
    {
      title: "Role",
      width: "15%",
      dataIndex: "role",
      render: (id, record) =>
        record.role === "Product Owner" ? (
          <div className="role-product-owner">Product Owner</div>
        ) : record.role === "Scrum Master" ? (
          <div className="role-scrum-master">Scrum Master</div>
        ) : (
          <div className="role-developer">Developer</div>
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
            onClick={() => {
              navigate(`update/${id}`);
            }}
          ></i>
          <i
            className="fa-solid fa-trash fa-lg delete-button"
            data-toggle="modal"
            data-target="#disableModal"
            onClick={() => canDisable(record)}
          ></i>
          <i
            className="fa-solid fa-circle-exclamation fa-lg detail-button"
            onClick={() => navigate(`${id}`)}
          ></i>
        </div>
      ),
    },
  ];

  // File menu list
  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: "All",
          key: "All",
        },
        {
          label: "Product Owner",
          key: "Product Owner",
        },
        {
          label: "Scrum Master",
          key: "Scrum Master",
        },
        {
          label: "Developer",
          key: "Developer",
        },
      ]}
    />
  );

  // Table on change
  const onChange = (newPagination, filters, sorter, extra) => {
    console.log(sorter);
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
    <div className="user-table">
      <p className="header-user-list">User List</p>

      {/* Filter menu */}
      <Dropdown overlay={menu} placement="bottom">
        <Button className="btn-filter" style={{ marginTop: "0.5rem" }}>
          <span></span>
          {menuType}
          <FilterOutlined />
        </Button>
      </Dropdown>

      {/* Create new user button */}
      <Button
        className="create-user-button"
        type="primary"
        onClick={() => navigate("/users/add")}
      >
        Create new user
      </Button>

      {/* Search bar */}
      <Search onSearch={onSearch} className="search-box" />

      {/* User table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />

      {/* Disable user modal */}
      <div
        className="modal fade"
        id="disableModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="disableModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="disable-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Disable User
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
              {userDisable === true
                ? "Are you sure you want to disable this user?"
                : "This user is currently managing or assigned to a project"}
            </div>
            {userDisable === true ? (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-confirm-advisor"
                  data-dismiss="modal"
                  onClick={() => {
                    userService.disable(userId).then(() => {
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
  );
};

export default UserTable;
