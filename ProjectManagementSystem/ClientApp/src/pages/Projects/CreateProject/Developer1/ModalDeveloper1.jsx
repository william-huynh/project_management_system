import React from "react";

import ListDeveloper from "./ListDeveloper1";

import { Modal } from "antd";
import "./ModalDeveloper1.css";

const ModalDeveloper1 = (props) => {
  return (
    <>
      <Modal
        visible={props.visible}
        onOk={props.handleCancel}
        closable={false}
        width={800}
        className="selectDeveloperModalProject"
      >
        <ListDeveloper
          onSelectedDeveloper={props.selectedDeveloper}
          DefaultDeveloper={props.defaultDeveloper}
          developer1={props.developer1}
          developer2={props.developer2}
          developer3={props.developer3}
          developer4={props.developer4}
        />
      </Modal>
    </>
  );
};

export default ModalDeveloper1;
