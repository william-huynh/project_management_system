import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import userService from "../../../services/userService";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Typography, Dropdown, Menu, Input, Button } from "antd";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import "antd/dist/antd.css";
import "./index.css";

const UserTable = () => {
  const { Search } = Input;
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState();
  const [userId, setUserId] = useState();
  const [userDetailDialog, setUserDetailDialog] = useState(false);
  const [disableUserDialog, setDisableUserDialog] = useState();
  const [position, setPosition] = useState("center");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [menuType, setMenuType] = useState("Type");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    type: "All",
    keyword: "",
  });

  //Dialog function map
  const dialogFuncMap = {
    userDetailDialog: setUserDetailDialog,
    disableUserDialog: setDisableUserDialog,
  };

  // Disable user footer
  const renderDisableUserFooter = (name) => {
    return (
      <div>
        <Button
          className="disable-confirm-button"
          onClick={() =>
            userService.disable(userId).then((response) => {
              dialogOnHide("disableUserDialog");
              fetchData({
                pagination,
              });
            })
          }
        >
          Yes
        </Button>
        <Button
          onClick={() => dialogOnHide(name)}
          className="disable-cancel-button"
        >
          No
        </Button>
      </div>
    );
  };

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
    setPagination((pagination.type = e.key));
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

  const disableUserOnClick = (id) => {
    setUserId(id);
    dialogOnDisplay("disableUserDialog");
  };

  // User detail on click
  const userDetailOnClick = (record) => {
    setUserDetail(record);
    dialogOnDisplay("userDetailDialog");
  };

  // Dialog on display
  const dialogOnDisplay = (name, position) => {
    dialogFuncMap[`${name}`](true);
    if (position) {
      setPosition(position);
    }
  };

  // Dialog on hide
  const dialogOnHide = (name) => {
    dialogFuncMap[`${name}`](false);
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
      title: "UserName",
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
    },
    {
      title: "Project",
      width: "15%",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      width: "15%",
      render: (id, record) => (
        <div className="user-button-group">
          <i
            className="pi pi-pencil user-edit-button"
            onClick={() => {
              navigate(`update/${id}`);
            }}
          ></i>
          {record.project === null ? (
            <i
              className="pi pi-trash user-delete-button"
              onClick={() => disableUserOnClick(id)}
            ></i>
          ) : (
            <i className="pi pi-trash user-delete-button"></i>
          )}
          <i
            className="pi pi-exclamation-circle user-detail-button"
            onClick={() => userDetailOnClick(record)}
          ></i>
        </div>
      ),
    },
  ];

  // Menu list
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
          key: "ProductOwner",
        },
        {
          label: "Scrum Master",
          key: "ScrumMaster",
        },
        {
          label: "Developers",
          key: "Developers",
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
      <Typography className="header-user-list">User List</Typography>

      <Dropdown overlay={menu} placement="bottom">
        <Button className="btn-filter" style={{ marginTop: "0.5rem" }}>
          <span></span>
          {menuType}
          <FilterOutlined />
        </Button>
      </Dropdown>

      <Button
        className="create-user-button"
        type="primary"
        onClick={() => navigate("/users/add")}
      >
        Create new user
      </Button>

      <Search onSearch={onSearch} className="search-box" />

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        onRow={(record, rowIndex) => {
          //return {
          //  onClick: () => {
          //    //showModal(record);
          //  },
          //};
        }}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />

      <Dialog
        header="User detail"
        visible={userDetailDialog}
        style={{ width: "50vw" }}
        onHide={() => dialogOnHide("userDetailDialog")}
      >
        {userDetail == null ? (
          <p>It is null</p>
        ) : (
          <div>
            <p>
              <span className="property">User Code </span>{" "}
              <span className="value">{userDetail.userCode}</span>
            </p>
            <p>
              <span className="property">Full Name </span>{" "}
              <span className="value">{userDetail.fullName}</span>
            </p>
            <p>
              <span className="property">Username </span>{" "}
              <span className="value">{userDetail.userName}</span>
            </p>
            <p>
              <span className="property">Date Of Birth </span>{" "}
              <span className="value">
                {moment(userDetail.dateOfBirth).format("DD/MM/YYYY")}
              </span>
            </p>
            <p>
              <span className="property">Gender </span>{" "}
              <span className="value">{userDetail.gender}</span>
            </p>
            <p>
              <span className="property">Role </span>{" "}
              <span className="value">{userDetail.role}</span>
            </p>
            <div className="row">
              <span className="property col-2 p-0">History </span>
              <div className="col-9">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Project Code</th>
                      <th>Project Name</th>
                      <th>Assigned Date</th>
                      <th>Project Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {history ? (
                      history.map((item) => (
                        <tr>
                          <td>
                            {moment(item.assignedDate).format("DD/MM/YYYY")}
                          </td>
                          <td>{item.assignedTo}</td>
                          <td>{item.assignedBy}</td>
                          {item.requestState == "Completed" ? (
                            <td>
                              {moment(item.returnedDate).format("DD/MM/YYYY")}
                            </td>
                          ) : (
                            <td>Updating...</td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No history</td>
                      </tr>
                    )} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        header="Disable User"
        visible={disableUserDialog}
        style={{ width: "25vw" }}
        footer={renderDisableUserFooter("disableUserDialog")}
        onHide={() => dialogOnHide("disableUserDialog")}
      >
        <p>Are you sure you want to disable this user?</p>
      </Dialog>

      {/* <ModalExample
        visible={isModalVisible}
        handleCancel={handleCancel}
        data={infor}
      />
      <DisableUser id={id} bool={bool} handleCancel={handleCancel} /> */}
    </div>
  );
};

export default UserTable;
