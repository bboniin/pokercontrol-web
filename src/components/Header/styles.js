import styled from 'styled-components';

export const Container = styled.div`
  height: 80px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #001B22;
  padding: 15px 15px;
  padding-left: 300px;

  > div {
    height: 100%;
    width: 200px;
    display: flex;
    padding-left: 0 !important;
    justify-content: center;
    align-items: center;

    p{
      color: #FFF;
      margin: 4px 0;
      font-size: 13px;
      text-align: right;
      width: 100%;
    }

    h3{
      color: #FFF;
      margin: 4px 0;
      font-size: 15px;
      text-align: right;
      width: 100%;
      text-transform: capitalize;
    }
  }
`;
