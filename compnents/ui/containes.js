import styled from "styled-components/native";

export const Flex = styled.View`
  flex: ${({ flex }) => flex ?? 1};
  flex-direction: ${({ direction }) => direction || "column"};
  justify-content: ${({ justify }) => justify || "flex-start"};
  align-items: ${({ align }) => align || "flex-start"};
  ${({ bg }) => bg && `background-color: ${bg};`}
`;

