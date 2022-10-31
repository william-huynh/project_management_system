import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import axiosInstance from "../../../axios";
import sprintService from "../../../services/sprintService";
import userService from "../../../services/userService";
import * as yup from "yup";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Input, Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";

const SprintTable = (props) => {
  const userId = props.user.id;
  const { Search } = Input;
  const [isUserAssign, setIsUserAssign] = useState(false);
  const [projectDetail, setProjectDetail] = useState(null);
  const [sprintId, setSprintId] = useState();
  const [sprintStartedDate, setSprintStartedDate] = useState(new Date());
  const [sprintEndedDate, setSprintEndedDate] = useState(new Date());
  const startDateRef = useRef(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [menuType, setMenuType] = useState("Status");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    status: "All",
    keyword: "",
  });

  // Get project duration months
  function getDuration(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let year = end.getFullYear() - start.getFullYear();
    let month = end.getMonth() - start.getMonth();
    let date = end.getDate() - start.getDate();
    if (year > 0) date += 365 * year;
    if (month > 0) date += 30 * month;
    console.log(start);
    console.log(end);
    return date;
  }

  // Fetch table data
  const fetchData = (params = {}) => {
    setLoading(true);
    userService.checkUserAssigned(userId).then((response) => {
      setIsUserAssign(response.data);
      if (response.data === true) {
        axiosInstance
          .get(
            `sprints/get-list?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&status=${params.pagination.status}&sortField=${params.sortField}&sortOrder=${params.sortOrder}&userId=${props.user.id}`
          )
          .then((results) => {
            results.data.sprints.forEach((element) => {
              element.startedDate = moment(element.startedDate).format(
                "DD/MM/YYYY"
              );
              element.endedDate = moment(element.endedDate).format(
                "DD/MM/YYYY"
              );
            });
            setData(results.data.sprints);
            setLoading(false);
            setPagination({
              ...params.pagination,
              total: results.data.totalItem,
            });
          });
        sprintService.projectDetail(userId).then((response) => {
          setProjectDetail(response.data);
        });
      }
    });
  };

  // Create sprint on click
  const createSprintClick = () => {
    sprintService.createDetail(projectDetail.id).then((response) => {
      createFormik.setFieldValue("name", response.data.name);
      if (
        getDuration(projectDetail.startedDate, response.data.endedDate) >= 0
      ) {
        let startDate = new Date(response.data.endedDate);
        setSprintStartedDate(startDate.setDate(startDate.getDate() + 1));
      } else setSprintStartedDate(projectDetail.startedDate);
      setSprintEndedDate(projectDetail.endedDate);
    });
  };

  // Update sprint on click
  const updateSprintClick = (id) => {
    sprintService.updateDetail(projectDetail.id, id).then((response) => {
      updateFormik.setFieldValue("name", response.data.name);
      updateFormik.setFieldValue("maxPoint", response.data.maxPoint);
      updateFormik.setFieldValue(
        "startedDate",
        moment(response.data.startedDate).format("YYYY-MM-DD")
      );
      updateFormik.setFieldValue(
        "endedDate",
        moment(response.data.endedDate).format("YYYY-MM-DD")
      );
      if (
        getDuration(projectDetail.startedDate, response.data.endedDate) >= 0
      ) {
        let startDate = new Date(response.data.endedDate);
        setSprintStartedDate(startDate.setDate(startDate.getDate() + 1));
      } else setSprintStartedDate(projectDetail.startedDate);
      if (
        getDuration(
          response.data.endedDate,
          response.data.newerSprint.startedDate
        ) >= 0
      ) {
        let startDate = new Date(response.data.newerSprint.startedDate);
        setSprintEndedDate(startDate.setDate(startDate.getDate() - 1));
      } else setSprintEndedDate(projectDetail.endedDate);
    });
  };

  const createFormik = useFormik({
    initialValues: {
      name: "",
      maxPoint: "",
      startedDate: moment(today).format("YYYY-MM-DD"),
      endedDate: moment(today).format("YYYY-MM-DD"),
      projectId: "",
    },
    validationSchema: yup.object({
      // Max point validation
      maxPoint: yup.string().required("Max user point is required"),

      // Start date validation
      startedDate: yup.date().required("Start date is required"),

      // End date validation
      endedDate: yup
        .date()
        .required("End date is required")
        .test({
          name: "test",
          exclusive: false,
          params: {},
          message: "Sprint duration should be more than 1 week",
          test: function (value) {
            return getDuration(this.parent.startedDate, value) >= 7;
          },
        })
        .test({
          name: "test",
          exclusive: false,
          params: {},
          message: "Sprint duration should be less than 1 month",
          test: function (value) {
            return getDuration(this.parent.startedDate, value) <= 30;
          },
        }),
    }),
    onSubmit: (data) => {
      console.log(data);
      data.projectId = projectDetail.id;

      sprintService
        .create(data)
        .then((response) => {
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  });

  const updateFormik = useFormik({
    initialValues: {
      id: sprintId,
      name: "",
      maxPoint: 0,
      startedDate: moment(today).format("YYYY-MM-DD"),
      endedDate: moment(today).format("YYYY-MM-DD"),
      projectId: "",
    },
    validationSchema: yup.object({
      // Max point validation
      maxPoint: yup.number().required("Max user point is required"),

      // Start date validation
      startedDate: yup.date().required("Start date is required"),

      // End date validation
      endedDate: yup
        .date()
        .required("End date is required")
        .test({
          name: "sprintSmaller",
          exclusive: false,
          params: {},
          message: "Sprint duration should be more than 1 week",
          test: function (value) {
            return getDuration(this.parent.startedDate, value) >= 7;
          },
        })
        .test({
          name: "sprintLarger",
          exclusive: false,
          params: {},
          message: "Sprint duration should be less than 1 month",
          test: function (value) {
            return getDuration(this.parent.startedDate, value) <= 30;
          },
        }),
    }),
    onSubmit: (data) => {
      sprintService
        .update(sprintId, data)
        .then((response) => {})
        .catch((e) => {
          console.log(e);
        });
    },
  });

  // Menu on click
  const handleMenuClick = (e) => {
    setPagination((pagination.status = e.key));
    setMenuType(e.key);
    fetchData({
      pagination,
    });
  };

  const handleCreateSprintClick = () => {
    createSprintClick(projectDetail.id);
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
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      defaultSortOrder: "ascend",
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
      title: "User point limit per sprint",
      dataIndex: "maxPoint",
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
            data-toggle="modal"
            data-target="#updateSprintModal"
            onClick={() => updateSprintClick(id)}
          ></i>
          <i
            className="fa-solid fa-trash fa-lg delete-button"
            data-toggle="modal"
            data-target="#disableSprintModal"
            onClick={() => setSprintId(id)}
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

  return isUserAssign === true ? (
    <div className="sprint-table">
      <p className="header-sprint-list">Sprint List</p>

      {/* Filter menu */}
      <Dropdown overlay={menu} placement="bottom">
        <Button className="btn-filter" style={{ marginTop: "0.5rem" }}>
          <span></span>
          {menuType}
          <FilterOutlined />
        </Button>
      </Dropdown>

      {/* Create new sprint button */}
      <Button
        className="create-sprint-button"
        type="primary"
        data-toggle="modal"
        data-target="#createSprintModal"
        onClick={() => handleCreateSprintClick()}
      >
        Add new sprint
      </Button>

      {/* Search bar */}
      <Search onSearch={onSearch} className="search-box" />

      {/* Sprint table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />

      {/* Create sprint modal */}
      <div
        className="modal fade"
        id="createSprintModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="createSprintModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="create-sprint-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Sprint</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={createFormik.handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-7">
                    <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">
                          Sprint name
                        </span>
                      </div>
                      <input
                        id="name"
                        name="name"
                        value={createFormik.values.name}
                        onChange={createFormik.handleChange}
                        type="text"
                        className="form-control"
                        aria-label="name"
                        aria-describedby="addon-wrapping"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">
                          User point limit
                        </span>
                      </div>
                      <select
                        id="maxPoint"
                        name="maxPoint"
                        value={createFormik.values.maxPoint}
                        onChange={createFormik.handleChange}
                        type="number"
                        className={`form-control ${
                          createFormik.errors.maxPoint &&
                          createFormik.touched.maxPoint === true
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="name"
                        aria-describedby="addon-wrapping"
                      >
                        <option defaultValue></option>
                        <option value="13">13</option>
                        <option value="16">16</option>
                        <option value="19">19</option>
                      </select>
                    </div>
                    {createFormik.errors.maxPoint &&
                      createFormik.touched.maxPoint && (
                        <p
                          className="text-danger mb-0 font-weight-normal"
                          style={{ marginLeft: "8.6rem" }}
                        >
                          {createFormik.errors.maxPoint}
                        </p>
                      )}
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-6">
                    <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">
                          Start date
                        </span>
                      </div>
                      <input
                        id="startedDate"
                        name="startedDate"
                        value={createFormik.values.startedDate}
                        onChange={createFormik.handleChange}
                        type="date"
                        ref={startDateRef}
                        min={moment(sprintStartedDate).format("YYYY-MM-DD")}
                        max={moment(sprintEndedDate).format("YYYY-MM-DD")}
                        className={`form-control ${
                          createFormik.errors.startedDate &&
                          createFormik.touched.startedDate === true
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="StartedDate"
                        aria-describedby="addon-wrapping"
                      />
                    </div>
                    {createFormik.errors.startedDate &&
                      createFormik.touched.startedDate && (
                        <p
                          className="text-danger mb-0 font-weight-normal"
                          style={{ marginLeft: "6.2rem" }}
                        >
                          {createFormik.errors.startedDate}
                        </p>
                      )}
                  </div>
                  <div className="col-6">
                    <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">
                          End date
                        </span>
                      </div>
                      <input
                        id="endedDate"
                        name="endedDate"
                        value={createFormik.values.endedDate}
                        onChange={createFormik.handleChange}
                        type="date"
                        min={moment(sprintStartedDate).format("YYYY-MM-DD")}
                        max={moment(sprintEndedDate).format("YYYY-MM-DD")}
                        className={`form-control ${
                          createFormik.errors.endedDate &&
                          createFormik.touched.endedDate === true
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="EndedDate"
                        aria-describedby="addon-wrapping"
                      />
                    </div>
                    {createFormik.errors.endedDate &&
                      createFormik.touched.endedDate && (
                        <p
                          className="text-danger mb-0 font-weight-normal"
                          style={{ marginLeft: "5.9rem" }}
                        >
                          {createFormik.errors.endedDate}
                        </p>
                      )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-confirm-scrum-master">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Update sprint modal */}
      <div
        className="modal fade"
        id="updateSprintModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="updateSprintModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="create-sprint-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Sprint</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={updateFormik.handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-7">
                    <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">
                          Sprint name
                        </span>
                      </div>
                      <input
                        id="name"
                        name="name"
                        value={updateFormik.values.name}
                        onChange={updateFormik.handleChange}
                        type="text"
                        className="form-control"
                        aria-label="name"
                        aria-describedby="addon-wrapping"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">
                          User point limit
                        </span>
                      </div>
                      <select
                        id="maxPoint"
                        name="maxPoint"
                        value={updateFormik.values.maxPoint}
                        onChange={updateFormik.handleChange}
                        type="number"
                        className={`form-control ${
                          updateFormik.errors.maxPoint &&
                          updateFormik.touched.maxPoint === true
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="name"
                        aria-describedby="addon-wrapping"
                      >
                        <option defaultValue></option>
                        <option value="13">13</option>
                        <option value="16">16</option>
                        <option value="19">19</option>
                      </select>
                    </div>
                    {updateFormik.errors.maxPoint &&
                      updateFormik.touched.maxPoint && (
                        <p
                          className="text-danger mb-0 font-weight-normal"
                          style={{ marginLeft: "8.6rem" }}
                        >
                          {updateFormik.errors.maxPoint}
                        </p>
                      )}
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-6">
                    <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">
                          Start date
                        </span>
                      </div>
                      <input
                        id="startedDate"
                        name="startedDate"
                        value={updateFormik.values.startedDate}
                        onChange={updateFormik.handleChange}
                        type="date"
                        ref={startDateRef}
                        min={moment(sprintStartedDate).format("YYYY-MM-DD")}
                        max={moment(sprintEndedDate).format("YYYY-MM-DD")}
                        className={`form-control ${
                          updateFormik.errors.startedDate &&
                          updateFormik.touched.startedDate === true
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="StartedDate"
                        aria-describedby="addon-wrapping"
                      />
                    </div>
                    {updateFormik.errors.startedDate &&
                      updateFormik.touched.startedDate && (
                        <p
                          className="text-danger mb-0 font-weight-normal"
                          style={{ marginLeft: "6.2rem" }}
                        >
                          {updateFormik.errors.startedDate}
                        </p>
                      )}
                  </div>
                  <div className="col-6">
                    <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="addon-wrapping">
                          End date
                        </span>
                      </div>
                      <input
                        id="endedDate"
                        name="endedDate"
                        value={updateFormik.values.endedDate}
                        onChange={updateFormik.handleChange}
                        type="date"
                        min={moment(sprintStartedDate).format("YYYY-MM-DD")}
                        max={moment(sprintEndedDate).format("YYYY-MM-DD")}
                        className={`form-control ${
                          updateFormik.errors.endedDate &&
                          updateFormik.touched.endedDate === true
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="EndedDate"
                        aria-describedby="addon-wrapping"
                      />
                    </div>
                    {updateFormik.errors.endedDate &&
                      updateFormik.touched.endedDate && (
                        <p
                          className="text-danger mb-0 font-weight-normal"
                          style={{ marginLeft: "5.9rem" }}
                        >
                          {updateFormik.errors.endedDate}
                        </p>
                      )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-confirm-scrum-master">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Disable sprint modal */}
      <div
        className="modal fade"
        id="disableSprintModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="disableSprintModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="disable-sprint-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Disable Sprint</h5>
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
              Are you sure you want to disable this sprint?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-confirm-scrum-master"
                data-dismiss="modal"
                onClick={() => {
                  sprintService.disable(sprintId).then(() => {
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
        <i class="fa-solid fa-users-slash fa-xl"></i>
      </div>
      <p>User is not assigned to a project!</p>
    </div>
  );
};

export default SprintTable;
