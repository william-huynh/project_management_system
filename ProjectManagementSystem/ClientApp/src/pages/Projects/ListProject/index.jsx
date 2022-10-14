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
            // onClick={() => {
            //   navigate(`update/${id}`);
            // }}
          ></i>
          {/* {record.project === null ? (
            <i
              className="fa-solid fa-xmark fa-xl project-delete-button"
              data-toggle="modal"
              data-target="#disableModal"
              onClick={() => setUserId(id)}
            ></i>
          ) : ( */}
          <i className="fa-solid fa-xmark fa-xl project-delete-button"></i>
          {/* )} */}
          <i
            className="fa-solid fa-circle-exclamation fa-lg project-detail-button"
            // data-toggle="modal"
            // data-target="#projectDetailModal"
            // onClick={() => setUserDetail(record)}
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

      {/* Project detail modal */}
      <div
        className="modal fade"
        id="projectDetailModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="projectDetailModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="project-detail-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Project Detail
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
              {projectDetail == null ? (
                <div className="loading">
                  <img src={loading} alt="Loading..." />
                </div>
              ) : (
                <div className="row">
                  <div className="col-4">
                    <img
                      src="https://leaveitwithme.com.au/wp-content/uploads/2013/11/dummy-image-square.jpg"
                      alt="dummy"
                      className="project-detail-picture"
                    />
                  </div>
                  <div className="col-8">
                    <div>
                      <p>
                        <span className="property">Project Code </span>{" "}
                        <span className="value">
                          {projectDetail.projectCode}
                        </span>
                      </p>
                      <p>
                        <span className="property">Project Name </span>{" "}
                        <span className="value">{projectDetail.name}</span>
                      </p>
                      <p>
                        <span className="property">Project Description </span>{" "}
                        <span className="value">
                          {projectDetail.description}
                        </span>
                      </p>
                      <p>
                        <span className="property">Start Date </span>{" "}
                        <span className="value">
                          {moment(projectDetail.startedDate).format(
                            "DD/MM/YYYY"
                          )}
                        </span>
                      </p>
                      <p>
                        <span className="property">End Date </span>{" "}
                        <span className="value">
                          {moment(projectDetail.endedDate).format("DD/MM/YYYY")}
                        </span>
                      </p>
                      <p>
                        <span className="property">Status </span>{" "}
                        <span className="value">{projectDetail.status}</span>
                      </p>
                      {/* <p>
                        <div className="row">
                          <div className="col-4 property">Current Project</div>

                          <div className="col-8 value">
                            <table
                              className="table"
                              style={{ marginBottom: 0 }}
                            >
                              <thead>
                                <tr>
                                  <th>Project Code</th>
                                  <th>Project Name</th>
                                  <th>Project Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>PC0001</td>
                                  <td>Project 01</td>
                                  <td>Active</td>
                                </tr> */}
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
                      {/* </tbody>
                            </table>
                          </div>
                        </div>
                      </p> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
              Are you sure you want to disable this user?
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
