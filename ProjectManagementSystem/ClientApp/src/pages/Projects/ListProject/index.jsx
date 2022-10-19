import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import projectService from "../../../services/projectService";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Input, Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";

const ProjectTable = () => {
  const { Search } = Input;
  const navigate = useNavigate();
  const [projectDetail, setProjectDetail] = useState();
  const [projectId, setProjectId] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [menuType, setMenuType] = useState("Status");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    status: "All",
    keyword: "",
  });

  // Fetch data
  const fetchData = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(
        `projects/getlist?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&status=${params.pagination.status}&sortField=${params.sortField}&sortOrder=${params.sortOrder}`
      )
      .then((results) => {
        results.data.projects.forEach((element) => {
          element.startedDate = moment(element.startedDate).format(
            "DD/MM/YYYY"
          );
          element.endedDate = moment(element.endedDate).format("DD/MM/YYYY");
        });
        setData(results.data.projects);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: results.data.totalItem,
        });
      });
  };

  // Menu on click
  const handleMenuClick = (e) => {
    setPagination((pagination.status = e.key));
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

  // Table columns
  const columns = [
    {
      title: "Project Code",
      dataIndex: "projectCode",
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
      title: "Advisor",
      dataIndex: "advisorName",
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
      title: "Status",
      width: "15%",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      width: "15%",
      render: (id, record) => (
        <div className="project-button-group">
          <i
            className="fa-solid fa-pen-to-square fa-lg project-edit-button"
            onClick={() => {
              navigate(`update/${id}`);
            }}
          ></i>
          {record.scrumMaster.Id === null ? (
            <i
              className="fa-solid fa-xmark fa-xl project-delete-button"
              data-toggle="modal"
              data-target="#disableProjectModal"
              onClick={() => setProjectId(id)}
            ></i>
          ) : (
            <i className="fa-solid fa-xmark fa-xl project-delete-button disabled project-delete-button-disabled"></i>
          )}
          <i
            className="fa-solid fa-circle-exclamation fa-lg project-detail-button"
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
          label: "Inactive",
          key: "Inactive",
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
    <div className="project-table">
      <p className="header-project-list">Project List</p>

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
        className="create-project-button"
        type="primary"
        onClick={() => navigate("/projects/add")}
      >
        Add new project
      </Button>

      {/* Search bar */}
      <Search onSearch={onSearch} className="search-box" />

      {/* User table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        // onRow={(record, rowIndex) => {
        //   return {
        //    onClick: () => {
        //      //showModal(record);
        //    },
        //   };
        // }}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />

      {/* Disable project modal */}
      <div
        className="modal fade"
        id="disableProjectModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="disableProjectModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="disable-project-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Disable Project
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
              Are you sure you want to disable this project?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-confirm-advisor"
                data-dismiss="modal"
                onClick={() => {
                  projectService.disable(projectId).then(() => {
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
                className="btn btn-cancel-advisor"
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

export default ProjectTable;
