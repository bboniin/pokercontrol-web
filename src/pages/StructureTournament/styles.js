import styled, { css } from "styled-components";
import fundo from "./../../assets/fundo.png";

export const Container = styled.div`
  height: 100%;
  margin-top: 35px;
  width: 100%;
  max-width: 1000px;
  overflow-x: scroll;
  padding-bottom: 80px;

  h2 {
    color: #001b22;
    font-weight: 400;
    margin: 0;
    line-height: 20px;
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

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ContainerInputs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  button {
    width: 100%;
    border: none;
    margin-top: 25px;
    padding: 10px 15px 10px 10px;
    border-radius: 5px;
    position: relative;
    text-transform: none;
    transition: all 0.15s ease;
    letter-spacing: 0.025em;
    font-size: 0.875rem;
    transition: all 0.15s ease;
    display: flex;
    justify-content: center;
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
`;

export const ViewInput = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 40px;
  border-radius: 5px;
  width: 100%;
  margin: 0 15px 10px 0;
  justify-content: space-between;
  text-align: center;

  p {
    width: 100%;
    font-size: 12px;
    text-align: left;
    margin: 0 0 5px 5px;
  }
  .ant-select-selection {
    background-color: #000 !important;
  }
`;

export const ViewStructure = styled.div`
  width: 100%;
  min-width: 680px;
  max-width: 680px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  border-bottom-width: 2px;
  padding-bottom: 5px;
  border-bottom-style: solid;
  border-bottom-color: #000;
  padding: 15px 10px 5px 10px;
  justify-content: flex-start;
  text-align: center;

  div {
    display: flex;
    align-items: flex-start;
    justify-content: center;

    p {
      font-size: 12px;
    }
  }
`;

export const ContainerView = styled.div`
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-size: cover;
  background-repeat: repeat-y;
  background-image: url(${fundo});
  text-transform: uppercase;
  color: #fff;
  margin: 10px 0 20px;

  .timer {
    font-family: "BarlowSemiCondensed-Bold";
    color: #fff;
    -webkit-text-stroke: 3px #20d071;
    font-size: 8.6vw;
    line-height: 8.6vw;
    text-align: left;
    margin-bottom: 15px !important;
  }

  .interval {
    position: absolute;
    background: #000b;
    flex-direction: column;
    border-radius: 15px;
    align-items: center;
    padding: 20px 45px;

    font-family: "Barlow-Bold";
    color: #fff;
    font-size: 4.9vw;
    -webkit-text-stroke: 2px #fff;
    margin: 5px 0 10px 0 !important;
    text-align: center;
  }

  .paused {
    position: absolute;
    background: #000c;
    flex-direction: column;
    border-radius: 15px;
    align-items: center;
    padding: 50px 85px;

    font-family: "Barlow-Bold";
    color: #fff;
    font-size: 6.9vw;
    -webkit-text-stroke: 2px #fff;
    margin: 5px 0 10px 0 !important;
    text-align: center;
  }

  .row {
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 25px 0 15px 0;
  }

  .nivelatual {
    min-width: 58%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px;
    background: #b1b2b539;
    padding: 15px;
    color: #20d071;
    -webkit-text-stroke: 1px #20d071;
    border-radius: 15px;

    p {
      font-family: "BarlowCondensed-Bold";
      color: #fff;
      font-size: 1.2vw;
      -webkit-text-stroke: 1px #fff;
      text-align: center;
    }
    span {
      font-family: "BarlowCondensed-Bold";
      color: #20d071;
      -webkit-text-stroke: 1px #20d071;
      margin-top: 5px !important;
      text-align: center;
    }
  }
  .nivel {
    min-width: 42%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px;
    background: #b1b2b539;
    padding: 15px;
    color: #20d071;
    -webkit-text-stroke: 1px #20d071;
    border-radius: 15px;

    p {
      font-family: "BarlowCondensed-Bold";
      color: #fff;
      font-size: 1.2vw;
      -webkit-text-stroke: 1px #fff;
      text-align: center;
    }
    span {
      font-family: "BarlowCondensed-Bold";
      color: #20d071;
      -webkit-text-stroke: 1px #20d071;
      margin-top: 5px !important;
      text-align: center;
    }
  }

  .activeSong {
    position: absolute;
    top: 0;
    background: #20d071;
    color: #fff;
    padding: 8px;
    font-size: 16px;
    width: 140px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .left {
    display: flex;
    flex-direction: column;
    background: #b1b2b539;
    justify-content: space-between;
    height: 100%;
    width: 18%;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;

    div {
      h1 {
        font-family: "BarlowCondensed-Medium";
        font-size: 1.8vw;
        line-height: 1.8vw;
        text-align: left;
      }

      span {
        font-family: "BarlowCondensed-Bold";
        font-size: 3.15vw;
        line-height: 2.9vw;
        text-align: left;
      }

      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 15%;
    }
  }

  .animation {
    width: 75%;
    animation: slide 15s linear infinite;
    @-webkit-keyframes bgscroll {
      from {
        background-position: 0 0;
      }
      to {
        background-position: 0 -520px;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    background: #b1b2b539;
    align-items: flex-end;
    justify-content: space-between;
    min-height: 100%;
    max-height: 100%;
    width: 18%;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    overflow: auto;
  }

  .divPubli {
    width: 100%;
    height: 33vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1c2d47;

    img {
      width: 100%;
      height: 33vh;
    }

    video {
      width: 100%;
    }
  }

  .awardView {
    min-height: 33vh;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex: 1;
    padding: 0 15%;
    flex-direction: column;

    h1 {
      font-family: "BarlowCondensed-Medium";
      font-size: 1.8vw;
      line-height: 1.8vw;
      text-align: right;
    }

    span {
      font-family: "BarlowCondensed-Bold";
      font-size: 3.15vw;
      line-height: 2.9vw;
      text-align: left;
    }
  }

  .shadow {
    background: #b1b2b539;
    padding: 15px 25px;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    margin: 20px 0 0px 0;
  }

  .bottom {
    display: flex;
    padding: 5px 20px;
    flex-direction: column;
    width: 100%;
    background: #b1b2b539;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;

    span {
      width: 100%;
      font-family: "BarlowCondensed-Medium";
      font-size: 1.95vw;
      line-height: 1.82vw;
      text-align: center;
    }
  }

  .content {
    width: 64%;
    display: flex;
    padding-top: 40px;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
  }
`;
