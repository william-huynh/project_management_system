import React from "react";

import ListAssignment from "./ListAssignment";

import { Modal } from "antd";
import "./ModalAssignment.css";

const ModalAssignment = (props) => {
  return (
    <>
      <Modal
        visible={props.visible}
        onOk={props.handleCancel}
        closable={false}
        width={800}
        className="selectAssignmentModal"
      >
        <ListAssignment
          onSelectedAssignment={props.selectedAssignment}
          DefaultAssignment={props.defaultAssignment}
        />
      </Modal>
    </>
  );
};

export default ModalAssignment;
