/** @format */

import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  display: ${(props) => (props.visible ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const ModalButton = styled.button`
  /* Add your button styles here */
`;

const Modal = ({modalVisible, setModalVisible, modalContent}) => {

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <Overlay visible={modalVisible}>
        <ModalContainer>
            {modalContent}
          <button onClick={closeModal}>Close Modal</button>
        </ModalContainer>
      </Overlay>
    </div>
  );
};

export default Modal;
