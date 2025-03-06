import styled from 'styled-components';

export const Container = styled.div`
  width: calc(100% - 180px);
  margin: 0 auto;
  display: flex;
  overflow: hidden;
  justify-content: flex-start;
  margin-top: 80px;
  height: 100%;
  padding-left: 180px;
  background: #f0f0f0;

  @media(max-width: 800px){
  padding-left: 0px;
  width: 90%;
  }
`;
