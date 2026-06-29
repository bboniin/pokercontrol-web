import styled, { css } from "styled-components";
import fundo from "./../../assets/fundo.png";

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-size: cover;
  background-repeat: repeat-y;
  background-image: url(${fundo});
  text-transform: uppercase;
  color: #fff;

  .award {
    font-family: "Barlow-Bold";
    color: #20d071;
    -webkit-text-stroke: 2px #20d071;
    font-size: 4.35vw;
    line-height: 4.35vw;
    text-align: left;
  }

  .timer {
    font-family: "BarlowSemiCondensed-Bold";
    color: #fff;
    -webkit-text-stroke: 3px #20d071;
    font-size: 13.6vw;
    line-height: 13.6vw;
    text-align: left;
    margin-bottom: 15px !important;
  }

  .media {
    font-family: "BarlowSemiCondensed-Bold";
    color: #20d071;
    -webkit-text-stroke: 2px #20d071;
    font-size: 3.15vw;
    line-height: 3.2vw;
    text-align: left;
  }

  .chipcount {
    font-family: "BarlowSemiCondensed-Bold";
    color: #fff;
    font-size: 2.8vw;
    line-height: 3.2vw;
    -webkit-text-stroke: 2px #fff;
    margin: 5px 0 5px 0 !important;
    text-align: left;
  }

  .name {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0 10px 0;

    p {
      font-family: "Barlow-Bold";
      color: #20d071;
      font-size: 3.4vw;
      -webkit-text-stroke: 2px #20d071;
      margin: 5px 0 10px 0 !important;
      text-align: left;
    }
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
    display: flex;
    border-radius: 15px;
    align-items: center;
    justify-content: center;
    height: 90%;
    top: 10%;
    width: 100%;
    padding: 50px 85px;

    font-family: "Barlow-Bold";
    color: #fff;
    -webkit-text-stroke: 2px #fff;
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
    min-width: 62%;
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
      font-size: 2.1vw;
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
    min-width: 38%;
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
      font-size: 2.1vw;
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

export const Line = styled.div`
  width: 75%;
  min-height: 2px;
  max-height: 2px;
  flex: 1;
  background: #20d071;
`;
