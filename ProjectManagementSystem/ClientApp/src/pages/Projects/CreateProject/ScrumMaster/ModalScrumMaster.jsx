import React from "react";

import ListScrumMaster from "./ListScrumMaster";

import { Modal } from "antd";
import "./ModalScrumMaster.css";

const ModalScrumMaster = (props) => {
  return (
    <>
      <Modal
        visible={props.visible}
        onOk={props.handleCancel}
        closable={false}
        width={800}
        className="selectScrumMasterModal"
      >
        <ListScrumMaster
          onSelectedScrumMaster={props.selectedScrumMaster}
          DefaultScrumMaster={props.defaultScrumMaster}
        />
      </Modal>
    </>
  );
};

export default ModalScrumMaster;
