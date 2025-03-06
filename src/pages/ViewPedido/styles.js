import styled, { css } from "styled-components";
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

  h3 {
    color: #001b22;
    font-weight: 400;
    margin-bottom: 25px;
  }

  h4 {
    color: #001b22;
    font-weight: 400;
    margin: 5px 0 0 0;
    font-size: 15px;
  }
  .error {
    width: 100%;
    color: #001b22;
    text-align: center;
    margin: 40px 0 50px 0;
    background: #fff;
    padding: 25px 15px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Amount = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0px;

  p {
    font-size: 10px;
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
    span {
      margin: 0 5px;
    }
  }
`;

export const Payment = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin: 25px 0;
  padding: 15px;
  background: #ffffff;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;

  h1 {
    font-size: 20px;
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
    margin-top: 10px;
    span {
      margin: 0 5px;
    }
  }
`;

export const Action = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 20px 0px;

  button {
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
        font-size: 12px;

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

export const TablePrint = styled.table`
  width: 100%;
  margin: 15px 0;
  border: none;
  border-collapse: separate;
  color: #001b22;
  border-spacing: 0px;

  thead {
    tr {
      td {
        padding: 5px 15px;
        height: 35px;
        font-size: 12px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #001b22;

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
        height: 35px;
        padding: 5px 15px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #001b22;

        a {
          margin: 10px;
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

export const Payments = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 5px 0 10px 0;
  padding: 0;

  button {
    width: 24%;
    margin-bottom: 10px;
    font-size: 12px;
  }
`;
