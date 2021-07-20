/**
 * Action Styles
 */
import styled from 'styled-components';

export const Button = styled.button`
  border: none;
  border-radius: 2px;
  padding: 8px 12px;
  margin: 0 5px;
  color: white;
  cursor: pointer;
`;

export const ToggleButton = styled(Button)`
  background-color: purple;

  &:disabled {
    background-color: dimgrey;
    opacity: 0.8;
    pointer-events: none;
  }
`;

export const KillButton = styled(Button)`
  background-color: red;
`;
