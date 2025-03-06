import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  border-radius: 5px;
  display: flex;
  padding: 0;
  margin: 5px 0 0 0 !important;
  flex-direction: column;
  font-size: 0.875rem;
  color: ${props => props.white ? "#FFF" : "#001B22"};
  background-color:  ${props => props.white ? "#001B22" : "#fff"};
  transition: all 0.15s ease;

  p{
    width: 100%;
    text-align: left;
  }

 .input{
    width: 100%;
    padding: 8px 10px;
    min-height: 40px;
    border-radius: 5px;
    margin: 5px 0 0 0;
    display: flex;
    align-items: center;
    transition: all 0.15s ease;
    border: 1px solid #aaa; 
    &:hover {
    border-color: #001B22;
    } 
    input:focus {
      border-color: #001B22;
    }

    input{
      flex: 1;
      background: transparent;
      margin: 0;
    }
  }

 

  .input-white{
    width: 100%;
    padding: 8px 10px;
    min-height: 40px;
    border-radius: 5px;
    margin: 5px 0 0 0;
    display: flex;
    align-items: center;
    transition: all 0.15s ease;
    border: 1px solid #ccc; 
    &:hover {
    border-color: #fff;
    } 
    input:focus {
      border-color: #fff;
    }

    input{
      flex: 1;
      background: #001B22;
      margin: 0;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active{
        -webkit-background-clip: text;
        -webkit-text-fill-color: #ffffff;
        transition: background-color 5000s ease-in-out 0s;
        box-shadow: inset 0 0 20px 20px #23232329;
    }
  }
`;
