import styled, { css } from "styled-components";
import { Card } from "antd";

export const Container = styled.div`
  height: 100%;
  margin-top: 35px;
  width: 100%;
  padding-bottom: 80px;

  h2 {
    color: #001b22;
    font-weight: 400;
    margin-bottom: 25px;
  }

  h3 {
    color: #001b22;
    font-weight: 400;
    margin: 5px 0 0 0;
    font-size: 15px;
  }

  .error {
    width: 100%;
    color: #001b22;
    text-align: center;
    margin: 50px 0 30px 0;
    background: #fff;
    padding: 25px 15px;
    border-radius: 10px;
  }
`;

export const TitleStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;

  h2 {
    color: #001b22;
    font-weight: 400;
  }
`;

export const CardItem = styled(Card)`
  width: 100%;
  max-width: 800px;
  margin-left: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  color: #333333;
  transition: all 0.3s ease;
  margin-top: 15px;
  cursor: pointer;

  ${(props) =>
    props.select &&
    css`
      border-color: #00c281;
    `}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 194, 129, 0.1);
  }

  p {
    color: #333333;
  }
  strong {
    color: #00c281;
  }
`;

export const CardContent = styled.p`
  margin-bottom: 8px;
  font-size: 16px;
`;
