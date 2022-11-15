import React from "react";

import ListDeveloper from "./ListDeveloper";

import { Modal } from "antd";
import "./ModalDeveloper.css";

const ModalDeveloper = (props) => {
  return (
    <>
      <Modal
        visible={props.visible}
        onOk={props.handleCancel}
        closable={false}
        width={800}
        className="selectDeveloperModal"
      >
        {props.sprintId === null ? (
          <p style={{ margin: "0" }}>Please select sprint to continue</p>
        ) : (
          <ListDeveloper
            sprintId={props.sprintId}
            onSelectedDeveloper={props.selectedDeveloper}
            DefaultDeveloper={props.defaultDeveloper}
          />
        )}
      </Modal>
    </>
  );
};

export default ModalDeveloper;
