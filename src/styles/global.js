import { createGlobalStyle } from 'styled-components';
import 'antd/dist/reset.css';

export default createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    border: none;
    box-sizing: border-box;
  }

  & .ant-select-selection__rendered {
        width: 200px;
        margin-left: 0;
        margin-right: 0;
        &:focus {
          outline: none;
          border: none;
        }
    }
    &.ant-select-focused {
      border: none;
      &:focus{
        outline: 0;
      }
    }
    
  body {
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    background: #f0f0f0 !important;
  }

  body, input, button {
    font-family: 'Roboto', sans-serif;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  ul {
    list-style: none;
    margin: 0 !important;
  }
  li {
    list-style: none;
  }
  a {
    text-decoration: none;
  }

  p {
    margin: 0 !important;
  }

  .Toastify {
    .Toastify__toast {
      border-radius: 4px;
    }
  }
`;
