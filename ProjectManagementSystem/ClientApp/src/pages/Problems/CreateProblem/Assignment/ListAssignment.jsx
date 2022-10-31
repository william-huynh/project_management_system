import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../axios";
import { Table, Divider } from "antd";

import "antd/dist/antd.css";

const ListAssignment = (props) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      var id = selectedRowKeys[0];
      var name = selectedRows[0].name;
      var infoAssignment = {
        id: id,
        name: name,
      };
      props.onSelectedAssignment(infoAssignment);
    },
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });

  const fetchData = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(
        `problems/assignment-list?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&sortField=${params.sortField}&sortOrder=${params.sortOrder}`
      )
      .then((results) => {
        console.log(results);
        setData(results.data.assignments);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: results.data.totalItem,
        });
      });
  };

  const columns = [
    {
      title: "Assignment Code",
      dataIndex: "assignmentCode",
      width: "25%",
      defaultSortOrder: "ascend",
      sorter: true,
    },
    {
      title: "Assignment Name",
      dataIndex: "name",
      ellipsis: true,
      sorter: true,
    },
  ];

  useEffect(() => {
    fetchData({
      pagination,
    });
  }, []);

  const onChange = (newPagination, filters, sorter, extra) => {
    fetchData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...filters,
    });
  };

  return (
    <div>
      <div>
        <p className="header-assignment-list">Choose a assignment</p>
      </div>
      <Divider />
      <Table
        rowSelection={{
          type: "radio",
          defaultSelectedRowKeys: [props.DefaultAsset],
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              const { id: selectedRowKeys } = record;
              const selectedRows = record;
              setSelectedRowKeys([selectedRowKeys]);
              rowSelection.onChange([selectedRowKeys], [selectedRows]);
            },
          };
        }}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
      />
    </div>
  );
};

export default ListAssignment;
