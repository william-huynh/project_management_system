import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Typography, Dropdown, Menu, Input, Button } from "antd";
import { Dialog } from "primereact/dialog";
import "antd/dist/antd.css";
import "./index.css";

const UserTable = () => {
  const { Search } = Input;
  const [userDetailDialog, setUserDetailDialog] = useState(false);
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

  // User detail dialog on click
  const userDetailOnClick = (name, position) => {
    dialogFuncMap[`${name}`](true);
    if (position) {
      setPosition(position);
    }
  };

  // User detail dialog on hide
  const userDetailOnHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  // Table columns
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      ellipsis: true,
      defaultSortOrder: "ascend",
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
      render: (id) => (
        <div className="user-button-group">
          <i
            className="pi pi-pencil user-edit-button"
            // onClick={() => {
            //   navigate(`update/${id}`);
            // }}
          ></i>
          <i
            className="pi pi-trash user-delete-button"
            // onClick={(e) => {
            //   e.stopPropagation();
            //   showSubModal(id);
            // }}
          ></i>
          <i
            className="pi pi-exclamation-circle user-detail-button"
            onClick={() => userDetailOnClick("userDetailDialog")}
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
        // onClick={() => navigate("/users/add")}
      >
        Create new user
      </Button>

      <Search onSearch={onSearch} className="search-box" />

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              //showModal(record);
            },
          };
        }}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />

      <Dialog
        header="Header"
        visible={userDetailDialog}
        style={{ width: "50vw" }}
        onHide={() => userDetailOnHide("userDetailDialog")}
      >
        <p>Hello there!</p>
        <p>This is user detail</p>
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
