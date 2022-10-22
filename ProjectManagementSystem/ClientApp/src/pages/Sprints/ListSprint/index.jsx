import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import sprintService from "../../../services/sprintService";
import moment from "moment";

import { FilterOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Input, Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";

const SprintTable = (props) => {
  const role = props.user.role[0];
  const { Search } = Input;
  const navigate = useNavigate();
  const [sprintDetail, setSprintDetail] = useState();
  const [sprintId, setSprintId] = useState();
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
        `sprints/getlist?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&keyword=${params.pagination.keyword}&status=${params.pagination.status}&sortField=${params.sortField}&sortOrder=${params.sortOrder}&userId=${props.user.id}`
      )
      .then((results) => {
        results.data.sprints.forEach((element) => {
          element.startedDate = moment(element.startedDate).format(
            "DD/MM/YYYY"
          );
          element.endedDate = moment(element.endedDate).format("DD/MM/YYYY");
        });
        setData(results.data.sprints);
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
      title: "Sprint Code",
      dataIndex: "sprintCode",
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
        <div className="table-button-group">
          {/* {record.advisor.id === props.user.id ? ( */}
          <i
            className="fa-solid fa-pen-to-square fa-lg edit-button"
            onClick={() => {
              navigate(`update/${id}`);
            }}
          ></i>
          {/* ) : (
            <i className="fa-solid fa-pen-to-square fa-lg edit-button disabled edit-button-disabled"></i>
          )} */}
          {/* {record.scrumMaster.id === null ? ( */}
          <i
            className="fa-solid fa-xmark fa-xl delete-button"
            data-toggle="modal"
            data-target="#disableSprintModal"
            onClick={() => setSprintId(id)}
          ></i>
          {/* ) : (
            <i className="fa-solid fa-xmark fa-xl delete-button disabled delete-button-disabled"></i>
          )} */}
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

  return (
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
        onClick={() => navigate("/sprints/add")}
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
  );
};

export default SprintTable;
