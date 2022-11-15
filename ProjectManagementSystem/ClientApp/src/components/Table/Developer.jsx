import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Button } from "antd";

const ProjectDetailDeveloper = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roleMenuType, setRoleMenuType] = useState("Role");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    type: "All",
    keyword: "",
  });

  // Fetch data
  const fetchData = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(
        `users/getlist?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&roles=${params.pagination.type}&sortField=${params.sortField}&sortOrder=${params.sortOrder}&projectId=${props.projectId}`
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
        setData(results.data.users);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: results.data.totalItem,
        });
      });
  };

  // Role menu on click
  const handleRoleMenuClick = (e) => {
    setPagination((pagination.role = e.key));
    setRoleMenuType(e.key);
    fetchData({
      pagination,
    });
  };

  // Table columns
  const columns = [
    {
      title: "Code",
      dataIndex: "userCode",
      ellipsis: true,
      width: "15%",
      defaultSortOrder: "descend",
    },
    {
      title: "Name",
      dataIndex: "fullName",
      ellipsis: true,
    },
    {
      title: "Role",
      width: "20%",
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

  // Filter role menu
  const roleMenu = (
    <Menu
      onClick={handleRoleMenuClick}
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
          label: "Developer",
          key: "Developer",
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
      {/* Filter role menu */}
      <Dropdown overlay={roleMenu} placement="bottom">
        <Button className="btn-filter" style={{ marginBottom: "0.5rem" }}>
          <span></span>
          {roleMenuType}
          <FilterOutlined />
        </Button>
      </Dropdown>

      {/* Assignment table */}
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

export default ProjectDetailDeveloper;
