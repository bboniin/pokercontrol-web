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

  h4 {
    margin: 10px 0;
  }

  .data {
    width: 100%;
    font-weight: 400;
    font-size: 15px;
    margin: 1px 0 !important;
  }

  .ant-select-selector {
    border-radius: 8px;
    min-height: 38px;
    padding: 5px;
    align-items: center;
  }
  .ant-select-selection-item {
    border-radius: 8px;
    min-height: !important 38px;
  }

  .ant-select-selection.ant-select-selection--single {
    border-radius: 8px;
    min-height: !important 38px;
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

export const Filters = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;

export const BoxInput = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  input {
    box-sizing: border-box;
    margin: 0;
    padding: 7px 11px;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
    line-height: 1.5714285714285714;
    list-style: none;
    font-family: -apple-system, BlinkMacSystemFont, segoe ui, Roboto,
      helvetica neue, Arial, noto sans, sans-serif, apple color emoji,
      segoe ui emoji, segoe ui symbol, noto color emoji;
    position: relative;
    display: flex;
    width: 100%;
    min-width: 500px;
    background-color: #fff;
    background-image: none;
    border-width: 1px;
    border-style: solid;
    border-color: #d9d9d9;
    border-radius: 6px;
    transition: all 0.2s;
  }
`;

export const BoxSelect = styled.div``;

export const SearchBar = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

export const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const DateInputBox = styled.div`
  margin-right: 15px;
  margin-bottom: 10px;

  label {
    margin-right: 10px;
    font-size: 14px;
  }

  input {
    min-width: 160px;
    height: 38px;
    background-color: #ffffff;
    border: 1px solid rgb(217, 217, 217);
    padding: 4px 15px;
    border-radius: 6px;
  }
`;
