import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  border-radius: 5px;
  display: flex;
  padding: 0;
  margin: 5px 0 0 0 !important;
  flex-direction: column;
  align-items: center;
  font-size: 0.875rem;
  transition: all 0.15s ease;

  p{
    width: 100%;
    text-align: left;
  }

  svg{
    cursor: pointer;
  }
`;

export const Method = styled.div`
  width: 100%;
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: space-between;
  margin: 5px  0 !important;
  flex-direction: row;

  p{
    width: 100%;
    text-align: left;
  }
`;
Method