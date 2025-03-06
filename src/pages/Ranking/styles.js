import styled, { css } from "styled-components";
import ReactInputMask from "react-input-mask";
import { Pagination as PaginationAnt } from "antd";

export const Container = styled.div`
  height: 100%;
  margin-top: 35px;
  width: 100%;
  overflow-x: scroll;
  padding-bottom: 120px;

  h2 {
    color: #001b22;
    font-weight: 400;
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

  .row {
    display: flex;
  }

  .drop-container {
    display: flex;
    flex-wrap: wrap;
  }

  .column-drop {
    width: 50%;
    flex-direction: column;
  }

  .column {
    width: 100% !important;
    flex-direction: column;
  }

  .item {
    width: 100% !important;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;

  .select {
    display: flex;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
  }

  p {
    margin-right: 5px;
    font-size: 12px;
    line-height: 14px;
  }
`;

export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;

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
  height: 100px;
  margin-right: 30px;
  background: #ffffff;
  display: flex;
  align-items: center;
  position: relative;

  ${({ active }) =>
    active &&
    css`
      border: 2px solid #20d071;
    `}

  .icon {
    padding: 10px;
    border-radius: 5px;
    margin-right: 20px;
  }

  .number {
    span {
      display: block;
      font-size: 24px;
      margin-bottom: 4px;
    }

    p {
      font-size: 14px;
    }
  }

  .growth {
    position: absolute;
    top: 10px;
    right: 15px;
    color: green;
    font-size: 14px;
    font-weight: 500;
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

export const Chair = styled.div`
  min-width: 450px;
  max-width: 450px;
  display: flex;
  margin: 0 20px 15px 0;
  flex-direction: column;
  flex: 1;
  background: #fff;
  border-radius: 5px;

  h2 {
    width: auto;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    padding: 15px;
    color: #fff;
    margin: 0px;
    background: #001b22;
    border-radius: 5px;
  }

  div {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  button {
    margin: 0;
  }
`;

export const ClientChair = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: none;
  flex: 1;
  background: #fff;
  border-radius: 5px;
  margin-bottom: -15px;

  span {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    padding: 0px;
    display: inline;
  }

  h2 {
    width: auto;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    padding: 15px;
    color: #fff;
    margin: 0px;
    background: #001b22;
    border-radius: 5px;
  }

  p {
    width: auto;
    font-size: 14px;
    font-weight: normal;
    text-align: left;
  }

  .infos {
    display: inline;
    width: 100%;
    padding: 0px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
  }

  .actions {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
    padding: 0px;

    button {
      margin-right: 3px;
    }
  }

  button {
    margin: 0;
  }
`;

export const Client = styled.div`
  min-width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background: #fff;
  height: 38px;
  margin: 0px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #899;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: #899;
  padding: 0px 10px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 80px;
    margin-right: 15px;
  }

  h2 {
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    padding: 0px;
    color: #001b22;
    margin: 0px;
    height: 16px;
    background: #fff;
  }

  p {
    flex: 1;
    font-size: 14px;
    font-weight: normal;
    text-align: left;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 8px;
    height: 38px;
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

export const Payments = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 5px 0 0px 0;
  padding: 0;

  button {
    width: 48%;
  }

  h4 {
    font-size: 12px;
    margin-bottom: -5px;
  }

  .amount {
    display: flex;
    width: 33%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 0px;

    p {
      font-size: 16px;
    }

    button {
      border: none;
      padding: 10px;
      border-radius: 5px;
      position: relative;
      text-transform: none;
      transition: all 0.15s ease;
      font-size: 18px;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      font-weight: 600;
      margin-bottom: 0;
      span {
        margin: 0 5px;
      }
    }

    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
`;

export const InfosTournament = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 25px 0;
  padding: 15px;
  background: #ffffff;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  h1 {
    font-size: 20px;
    text-align: center;
    width: 100%;
  }

  p {
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    width: 100%;
  }

  .infos {
    width: 50%;
    min-width: 250px;
  }

  button {
    border: none;
    padding: 10px;
    border-radius: 5px;
    position: relative;
    text-transform: none;
    transition: all 0.15s ease;
    letter-spacing: 0.025em;
    font-size: 18px;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    font-weight: 600;
    margin: 10px;
    span {
      margin: 0 5px;
    }
  }
`;

export const ViewAward = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin: 15px 0;
  justify-content: flex-start;
  text-align: center;

  div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    margin-bottom: 10px;
    margin-right: 10px;

    span {
      font-size: 14px;
      margin-right: 5px;
    }
  }
`;
