import styled from "styled-components";

interface ButtonInnerProps {
  primary?: boolean;
}

const ButtonInner = styled.button<ButtonInnerProps>`
  min-width: 100px;
  color: ${(props) => props?.theme?.button?.color};
  background: ${(props) =>
    props.primary
      ? props?.theme?.button?.primary?.background
      : props?.theme?.button?.secondary?.background};
  font-size: ${(props) => props?.theme?.button?.font_size}px;
  padding: ${(props) => props?.theme?.button?.padding};
  border: 0;
  cursor: pointer;

  &:focus {
    outline: none;
  }
  &:active {
    background: ${(props) =>
      props.primary
        ? props?.theme?.button?.primary?.active_background
        : props?.theme?.button?.secondary?.active_background};
  }
`;

interface ButtonProps {
  primary?: boolean;
  children: string;
}

const Button = (props: ButtonProps) => {
  return (
    <ButtonInner primary={Boolean(props.primary)}>{props.children}</ButtonInner>
  );
};

export default Button;
