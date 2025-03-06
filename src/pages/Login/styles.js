import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #001B22F5;

    button {
      flex: 1;
      margin: 0 5px;
      border-radius: 12px;
      min-height: 42px;
      max-height: 42px;
    }
`;

export const Content = styled.div`
  width: 90%;
  max-width: 450px;
  min-height: 450px;
  display: flex;
  padding: 50px 15px;
  background: #001B22;
  border-radius: 15px;
  align-items: center;
  flex-direction: column;

  .logo {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 0px 30px 0;
    img {
      width: 200px;
    }
  }

  .user{
    display: flex;
    width: 100%;
    padding: 0;

    button{
      flex: 1;
    }
  }

  .input{
    width: calc(100% - 10px);
    margin: 15px 0 25px 0; 
    padding: 0;
    background: #001B22;
  }
`;
