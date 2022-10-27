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
        <ListDeveloper
          onSelectedDeveloper={props.selectedDeveloper}
          DefaultDeveloper={props.defaultDeveloper}
        />
      </Modal>
    </>
  );
};

export default ModalDeveloper;
