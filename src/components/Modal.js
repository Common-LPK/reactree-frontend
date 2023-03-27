/* eslint-disable react/prop-types */
import styled from "styled-components";
import { COLORS, SIZE } from "../assets/constants";

const Wrapper = styled.div`
  display: ${props => (props.nodeId ? "block" : "none")};
  width: 180px;
  padding: ${SIZE.PADDING}px;
  background-color: ${COLORS.BORDER};
  border: 1px solid ${COLORS.BUTTON};
  border-radius: 4px;
  color: ${COLORS.WHITE};
  box-shadow: 0px 1px 5px 1px rgba(255, 255, 255, 0.2);
  font-family: "Whitney", "Helvetica Neue";
  transition: all 0.3s ease;
`;

export default function Modal({ nodeId, children }) {
  return <Wrapper nodeId={nodeId}>{children}</Wrapper>;
}
