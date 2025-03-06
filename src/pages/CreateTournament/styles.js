import styled, { css } from "styled-components";
import ReactInputMask from "react-input-mask";
import { Pagination as PaginationAnt } from "antd";

export const Container = styled.div`
  height: 100%;
  margin-top: 35px;
  width: 100%;
  max-width: 1000px;
  overflow-x: scroll;
  padding-bottom: 80px;

  h2 {
    color: #001b22;
    font-weight: 400;
    margin: 0;
    line-height: 20px;
  }

  .error {
    width: 100%;
    color: #001b22;
    text-align: center;
    margin: 80px 0 50px 0;
    background: #fff;
    padding: 25px 15px;
    border-radius: 10px;
  }

  .errorInput {
    border-color: #d00;
  }

  .errorButton {
    background-color: #d007;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ContainerInputs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  button {
    min-width: 250px;
    border: none;
    margin-top: 25px;
    padding: 10px 15px 10px 10px;
    border-radius: 5px;
    position: relative;
    text-transform: none;
    transition: all 0.15s ease;
    letter-spacing: 0.025em;
    font-size: 0.875rem;
    transition: all 0.15s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    span {
      margin-left: 8px;
    }
  }
`;

export const ButtonAdd = styled.div`
  display: flex;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  align-items: center;
  margin-left: 15px;
  flex-direction: column;
  background-color: #fff;
`;

export const ViewRanking = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border-radius: 2px;
  align-items: center;
  flex-direction: row;
  background-color: #fff;
  margin-top: 10px;

  div {
    display: flex;
    width: 40px;
    justify-content: space-between;
    flex-direction: row;
    cursor: pointer;
  }
`;

export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;

  h2 {
    color: #001b22;
    font-weight: 400;
  }
`;

export const ViewRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  min-height: 80px;
`;

export const ViewPurchase = styled.div`
  display: flex;
  justify-content: space-between;
  width: 200px;
  padding: 10px 15px;
  border-radius: 5px;
  align-items: center;
  margin: 5px 15px 15px 0;
  height: 100%;
  min-height: 130px;
  flex-direction: column;
  background-color: #fff;

  .content {
    display: flex;
    width: 100%;
    align-self: flex-start;
    justify-content: flex-start;
    flex-direction: column;
  }
  .actions {
    display: flex;
    width: 100%;
    align-self: flex-end;
    justify-content: flex-end;

    svg {
      margin-left: 10px;
      cursor: pointer;
    }
  }

  h4 {
    color: #001b22;
    font-weight: 400;
    width: 100%;
    margin: 0 0 10px 0;
    text-align: left;
  }

  p {
    color: #000;
  }
`;

export const ViewInput = styled.div`
  min-height: 40px;
  border-radius: 5px;
  width: 100%;
  margin: 0 15px 10px 0;
  justify-content: space-between;
  text-align: center;

  p {
    width: 100%;
    font-size: 12px;
    text-align: left;
    margin: 0 0 5px 5px;
  }

  div {
    display: flex;
    flex-direction: row;

    input {
      margin-right: 15px;
      margin-bottom: 5px;
    }
  }
`;
