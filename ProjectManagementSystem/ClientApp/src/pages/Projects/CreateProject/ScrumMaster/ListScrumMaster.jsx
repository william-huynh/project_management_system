import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../axios";
import { Table, Divider } from "antd";

import "antd/dist/antd.css";

const ListScrumMaster = (props) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      var id = selectedRowKeys[0];
      var fullName = selectedRows[0].fullName;
      var infoScrumMaster = {
        id: id,
        fullName: fullName,
      };
      props.onSelectedScrumMaster(infoScrumMaster);
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
        `users/scrum-master-list?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&sortOrder=${params.sortOrder}&sortField=${params.sortField}`
      )
      .then((results) => {
        console.log(results);
        setData(results.data.users);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: results.data.totalItem,
        });
      });
  };

  const columns = [
    {
      title: "User Code",
      dataIndex: "userCode",
      width: "25%",
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
      title: "User Name",
      dataIndex: "userName",
      ellipsis: true,
      width: "30%",
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
        <p className="header-project-list">Create new project</p>
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

export default ListScrumMaster;
