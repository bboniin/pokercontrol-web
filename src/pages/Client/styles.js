import ReactInputMask from "react-input-mask";
import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  margin-top: 35px;
  width: 100%;
  overflow-x: scroll;
  padding-bottom: 80px;

  h2 {
    color: #001b22;
    font-weight: 400;
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
    margin: 80px 0 50px 0;
    background: #fff;
    padding: 25px 15px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Payments = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px 0 10px 0;
  padding: 0;

  button {
    width: 48%;
    margin-bottom: 10px;
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

export const Transaction = styled.table`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 0.5px solid #ccc;
  color: #001b22;

  p {
    flex: 1;
    font-size: 12px;
  }

  div {
    width: 50px;
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

export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;

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
