import styled, { css } from 'styled-components/macro';

export const Container = styled.div`
  background: #001B22;
  display: absolute;
  position: fixed;
  top: 0;
  z-index: 99;
  min-height: 100vh;
  width: 200px;
  padding-top: 25px;
  transition: all 0.3s ease;

  @media (max-width: 800px){
    padding-top: 50px;
  }

  @media (min-width: 800px){
    width: 200px;
  }

  ${({ isMenuMinimized }) =>
    isMenuMinimized &&
    css`
      width: 0px;
      overflow: hidden;
    `}
`;

export const Logo = styled.div`
  text-align: center;
  padding: 20px 0 0 0;
  transition: all 0.3s ease;

  img {
    width: 150px;
  }

  h1 {
    color: #fff;
    font-size: 30px;
  }


  @media (max-width: 800px){
    ${({ isMenuMinimized }) =>
      isMenuMinimized &&
      css`
        width: 0px;
        overflow: hidden;
    `}
  }
`;

export const Menu = styled.ul`
  margin-top: 50px !important;
  position: relative;
  transition: all 0.15s ease;

  li {
    a,
    button {
      height: 40px;
      padding: 0 10px 0 18px;
      display: flex;
      align-items: center;
      color: #fff;
      transition: all ease-in 0.2s;
      border-left: 3px solid #001B22;
      font-weight: 600;

      &:hover {
        border-left: 3px solid #fff;
      }
    }

    span {
      margin-left: 15px;
      font-size: 14px;
    }
  }
`;


export const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  background: #fff;
  display: none;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;

  @media (max-width: 800px){
    display: flex;
  }
`;
