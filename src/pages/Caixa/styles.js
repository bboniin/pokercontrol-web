import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  margin-top: 35px;
  width: 100%;
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

  h4 {
    margin: 0;
  }

  .ant-statistic-title,
  .ant-statistic-content {
    color: #333333 !important;
  }
  .ant-statistic-content-value-int,
  .ant-statistic-content-value-decimal {
    color: #00c281;
  }
  .error {
    width: 100%;
    color: #001b22;
    text-align: center;
    background: #fff;
    padding: 25px 15px;
    border-radius: 10px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h2 {
    color: #001b22;
    font-weight: 400;
  }

  div {
    display: flex;
  }

  .ant-btn {
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

  .ant-btn-dangerous {
    background-color: #ff4d4f;
    color: #fff;
    &:hover {
      background-color: #cc0000;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 20px;
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px;

  .active {
    border: 1px solid #00c281 !important;
  }

  .ant-card {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
  }
`;

export const PaymentsContainer = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  .ant-card {
    background-color: #f9f9f9;
    border: 1px solid #00c281;
    color: #333333;
    border-radius: 10px;
  }
  .payment-cards-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .ant-card {
      flex-basis: calc(25% - 12px); // 4 cards per row
      @media (max-width: 1200px) {
        flex-basis: calc(33.33% - 10.67px); // 3 cards per row
      }
      @media (max-width: 768px) {
        flex-basis: calc(50% - 8px); // 2 cards per row
      }
      @media (max-width: 480px) {
        flex-basis: 100%; // 1 card per row
      }
    }
  }
`;

export const PaymentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
    color: #333;
  }

  .intl-currency-input {
    width: 100%;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    color: rgba(0, 0, 0, 0.88);
    padding: 8px;
    font-size: 14px;
    border-radius: 5px;
    &:focus {
      border-color: #001b22;
      outline: none;
      box-shadow: none;
    }
  }
`;
export const Table = styled.table`
  width: 100%;
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
        min-height: 40px;
        padding: 10px 15px;
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
