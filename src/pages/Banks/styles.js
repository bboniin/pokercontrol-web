import styled, { css } from "styled-components";
import ReactInputMask from "react-input-mask";
import { Pagination as PaginationAnt } from "antd";

export const Container = styled.div`
  height: 100%;
  margin-top: 35px;
  width: 100%;
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

  ::-webkit-scrollbar {
    display: none;
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

  div {
    display: flex;
  }

  button {
    margin-left: 25px;
    border: none;
    padding: 10px 15px 10px 10px;
    border-radius: 5px;
    position: relative;
    text-transform: none;
    transition: all 0.15s ease;
    letter-spacing: 0.025em;
    font-size: 0.875rem;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    font-weight: 600;
    span {
      margin-left: 8px;
    }
  }
`;

export const Cards = styled.ul`
  margin-top: 20px;
  display: flex;
  align-items: center;
`;

export const Card = styled.li`
  border-radius: 8px;
  padding: 15px;
  width: 255px;
  margin-bottom: 20px;
  height: 100px;
  margin-right: 20px;
  background: #ffffff;
  display: flex;
  align-items: center;
  position: relative;
  color: #282828;
  fill: #282828;
  cursor: pointer;

  ${({ select }) =>
    select &&
    css`
      border: 2px solid #20d071;
      background: #20d071;
      color: #fff;
      fill: #fff;
    `}

  .icon {
    padding: 10px;
    border-radius: 5px;
    margin-right: 20px;
  }
`;
export const Form = styled.div`
  margin-top: 70px;
  display: flex;

  input {
    flex: 1;
    background: none;
    border: none;
    border-bottom: 1px solid #484848;
    padding: 10px;
    font-size: 16px;
    color: #ffffff;

    &::placeholder {
      color: #ffffff;
    }
  }

  button {
    margin-left: 25px;
    border: none;
    padding: 10px 45px;
    border-radius: 5px;
    position: relative;
    text-transform: none;
    transition: all 0.15s ease;
    letter-spacing: 0.025em;
    font-size: 0.875rem;
    color: #001b22;
    background-color: #20d071;
    transition: all 0.15s ease;
    &:hover {
      background-color: #20d071cc;
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  margin-top: 25px;
  border: none;
  border-collapse: separate;
  color: #001b22;
  border-spacing: 0 1em;

  thead {
    tr {
      td {
        padding: 0 15px;

        &:last-child {
          text-align: center;
        }
      }
    }
  }

  tbody {
    tr {
      td {
        color: #001b22;
        font-size: 14px;
        height: 40px;
        padding: 0 15px;
        background: #ffffff;

        a {
          margin: 10px;
        }

        &:first-child {
          border-bottom-left-radius: 5px;
          border-top-left-radius: 5px;
        }

        &:last-child {
          text-align: center;
          border-bottom-right-radius: 5px;
          border-top-right-radius: 5px;
        }
      }
    }
  }
`;

export const Pagination = styled(PaginationAnt)`
  display: flex;
  justify-content: center;
  margin-top: 40px !important;
`;

export const Filters = styled.div`
  margin: 40px 0;
  span {
    color: #001b22;
  }
`;

export const ViewInput = styled.div`
  min-height: 40px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 5px;
  justify-content: space-between;
  text-align: center;

  p {
    width: 100%;
    font-size: 12px;
    text-align: left;
    margin: 0 0 2px 5px;
  }
`;

export const InputTel = styled(ReactInputMask)`
  box-sizing: border-box;
  margin: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 2px;
  transition: all 0.2s;
  ::placeholder {
    color: #bbb;
    font-size: 13px;
  }
  &:hover {
    border-color: #001b22;
  }
  input:focus {
    border-color: #001b22;
  }
`;
