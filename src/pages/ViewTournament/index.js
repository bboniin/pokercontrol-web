import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import api from "../../services/api";
import { Container, Line } from "./styles";
import Loader from "../../components/Loader";
import { getValue } from "../../services/functions";
import { differenceInSeconds } from "date-fns";
import { toast } from "react-toastify";
import qrcode from "../../assets/qrcode.png";
import video from "../../assets/video.mp4";
import { Textfit } from "react-textfit";

const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
  speed: 5000,
  vertical: true,
  autoplaySpeed: 1000,
  cssEase: "linear",
};

const ViewTournament = () => {
  const { tournament_id } = useParams();

  const [tournament, setTournament] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSong, setActiveSong] = useState(false);
  const [tournamentEnd, setTournamentEnd] = useState(false);
  const [nivel, setNivel] = useState(0);
  const [niveis, setNiveis] = useState([]);
  const [timerNivel, setTimerNivel] = useState(0);
  const [nextInterval, setNextInterval] = useState(0);
  const [isInterval, setIsInterval] = useState(false);
  const [textNivel, setTextNivel] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    loadTournament();
    const intervalTournament = setInterval(() => {
      loadTournament();
    }, 15000);
    return () => {
      clearInterval(intervalTournament);
    };
  }, []);

  useEffect(() => {
    let nivelC = nivel;
    if (tournament) {
      if (tournament.status == "encerrado") {
        setTextNivel("ENCERRADO");
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        setTimer(0);
      } else {
        if (tournament.status == "aberto" || tournament.status == "criado") {
          setTextNivel("EM BREVE");
          setTimer(0);
          setNivel(0);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        } else {
          const timerTournament = setInterval(() => {
            let timer = tournament.paused
              ? differenceInSeconds(
                  new Date(tournament.time_paused),
                  new Date(tournament.datetime_initial)
                )
              : differenceInSeconds(
                  new Date(),
                  new Date(tournament.datetime_initial)
                );
            timer -= tournament.seconds_paused;
            if (timerNivel - timer == 5 && nivelC == nivel && activeSong) {
              var audio = new Audio();
              audio.src = "/song.mp3";
              audio.play();
              nivelC += 1;
            }
            if (timer >= timerNivel || isInterval) {
              timerCount(tournament);
            }
            setTimer(timer);
          }, 250);

          setTimeout(() => {
            setIsLoading(false);
          }, 2000);

          return () => {
            clearInterval(timerTournament);
          };
        }
      }
    }
  }, [tournament, activeSong, timerNivel]);

  async function loadTournament() {
    await api
      .get(`/tournament/${tournament_id}`)
      .then((response) => {
        let tournament = response.data;
        setNiveis(tournament.niveis);
        setTournament(tournament);

        if (tournament.status == "aberto" || tournament.status == "criado") {
          setTextNivel("EM BREVE");
          setTimer(0);
          setNivel(0);
        } else {
          timerCount(tournament);
        }
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data) {
            if (response.data.message) {
              toast.warn(response.data.message);
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente"
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente"
            );
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente");
        }
      });
  }

  function timerCount(tournament) {
    let timer =
      differenceInSeconds(new Date(), new Date(tournament.datetime_initial)) -
      tournament.seconds_paused;
    let timerC = 0;
    let intervals = 0;
    let nextInterval = 0;
    let timerNivel = 0;
    let search = true;
    let interval = false;

    tournament.intervals.split("-").map((item, index) => {
      timerC += parseInt(item.substring(1)) * 60;
      if (String(tournament.intervals.split("-")[index]).indexOf("I") == 0) {
        if (!search && !nextInterval) {
          nextInterval = timerC;
          setNextInterval(nextInterval - parseInt(item.substring(1)) * 60);
        }
      }
      if (
        String(tournament.intervals.split("-")[index - 1]).indexOf("I") == 0
      ) {
        intervals += 1;
      }
      if (timerC > timer && search) {
        if (item.slice(0, 1) == "I") {
          interval = true;
        }
        timerNivel = timerC;
        setTimerNivel(timerC);
        setNivel(index - intervals);
        search = false;
      }
    });

    setIsInterval(interval);
    if (search) {
      setTournamentEnd(true);
    }
  }

  function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " DIA " : " DIAS ") : "";
    var hDisplay = h ? ("00" + h).slice(-2) + ":" : "";
    var mDisplay = ("00" + m).slice(-2) + ":";
    var sDisplay = ("00" + s).slice(-2);
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  return (
    <Container>
      {!isLoading ? (
        <>
          <div className="left">
            <div>
              <h1>TEMPO DE JOGO</h1>
              <span>{secondsToDhms(timer)}</span>
            </div>
            <Line />
            <div>
              <h1>INTERVALO EM</h1>
              <span>
                {tournamentEnd || !nextInterval
                  ? secondsToDhms(0)
                  : secondsToDhms(nextInterval - timer)}
              </span>
            </div>
            <Line />
            <div>
              <h1>JOGADORES</h1>
              <span>
                {tournament.clients.filter((item) => item.exit == false).length}
                /{tournament.clients.length}
              </span>
            </div>
          </div>
          <div className="content">
            {!activeSong && (
              <button
                className="activeSong"
                onClick={() => {
                  setActiveSong(true);
                }}
              >
                ATIVAR SOM
              </button>
            )}
            <p className="award" onClick={() => {}}>
              {tournament.name}
            </p>
            <div
              style={{
                position: "relative",
                width: "90%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "BarlowCondensed-Bold",
                textAlign: "center",
                maxHeight: "28vh",
                color: " #ffffff",
                "-webkit-text-stroke": "3px #20d071",
              }}
            >
              <Textfit
                mode="single"
                min={25}
                max={250}
                style={{
                  width: "100%",
                }}
              >
                {textNivel
                  ? textNivel
                  : tournamentEnd
                  ? "FIM"
                  : secondsToDhms(timerNivel - timer)}
              </Textfit>
              {tournament.paused && (
                <div className="paused">
                  <Textfit
                    mode="single"
                    min={10}
                    max={250}
                    style={{
                      width: "100%",
                    }}
                  >
                    TORNEIO PAUSADO
                  </Textfit>
                </div>
              )}
            </div>
            <div className="row">
              {isInterval && <div className="interval">INTERVALO</div>}
              <div
                className="row"
                style={{ margin: 0, width: "95%", alignItems: "flex-end" }}
              >
                <div className="nivelatual">
                  <p>NÍVEL ATUAL - {nivel + 1} </p>
                  <Textfit
                    mode="single"
                    min={25}
                    max={170}
                    style={{
                      width: "100%",
                      fontFamily: "BarlowCondensed-Bold",
                      textAlign: "center",
                    }}
                  >
                    {niveis[nivel]}
                  </Textfit>
                  <Textfit
                    mode="single"
                    min={10}
                    max={60}
                    style={{
                      width: "100%",
                      fontFamily: "BarlowCondensed-Bold",
                      textAlign: "center",
                    }}
                  >
                    (+{niveis[nivel]?.split("/")[1]})
                  </Textfit>
                </div>
                {nivel + 1 < niveis.length && (
                  <div className="nivel">
                    <p>PRÓX. NÍVEL - {nivel + 2}</p>
                    <Textfit
                      mode="single"
                      min={20}
                      max={150}
                      style={{
                        width: "100%",
                        fontFamily: "BarlowCondensed-Bold",
                        textAlign: "center",
                      }}
                    >
                      {niveis[nivel + 1]}
                    </Textfit>
                    <Textfit
                      mode="single"
                      min={10}
                      max={45}
                      style={{
                        width: "100%",
                        fontFamily: "BarlowCondensed-Bold",
                        textAlign: "center",
                      }}
                    ></Textfit>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                width: "90%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="shadow">
                <p className="media">
                  MÉDIA{" "}
                  {tournament.clients.filter((item) => item.exit == false)
                    .length
                    ? (
                        tournament.total_tokens /
                        1000 /
                        tournament.clients.filter((item) => item.exit == false)
                          .length
                      )
                        .toFixed(1)
                        .replace(".0", "K")
                    : "-"}
                  / CHIPCOUNT{" "}
                  {(tournament.total_tokens / 1000)
                    .toFixed(1)
                    .replace(".0", "")}
                  K
                </p>
              </div>
              <div className="bottom">
                <span>
                  {tournament.purchases.map((item, idx) => {
                    return `${idx ? " | " : ""}${item.name}: ${
                      tournament.clients_purchases.filter(
                        (data) => data.purchase_id == item.id
                      ).length
                    }`;
                  })}
                </span>
              </div>
            </div>
          </div>
          {tournament.award ? (
            <>
              {tournament.award.split("-").length <= 2 ? (
                <>
                  <div className="right">
                    {tournament.award.split("-")[0] && (
                      <div className="awardView">
                        <h1>1º LUGAR</h1>
                        <span>
                          {getValue(parseFloat(tournament.award.split("-")[0]))}
                        </span>
                      </div>
                    )}
                    {tournament.award.split("-")[1] && (
                      <>
                        <Line />
                        <div className="awardView">
                          <h1>2º LUGAR</h1>
                          <span>
                            {getValue(
                              parseFloat(tournament.award.split("-")[1])
                            )}
                          </span>
                        </div>
                      </>
                    )}
                    {tournament.award.split("-")[2] && (
                      <>
                        <Line />
                        <div className="awardView">
                          <h1>3º LUGAR</h1>
                          <span>
                            {getValue(
                              parseFloat(tournament.award.split("-")[2])
                            )}
                          </span>
                        </div>
                      </>
                    )}
                    {tournament.vacancys.map((item) => {
                      return (
                        <>
                          <Line />
                          <div className="awardView">
                            <h1 style={{ marginBottom: 5 }}>{item.name}</h1>
                            <p style={{ fontSize: 17 }}>{item.description}</p>
                            <span style={{ marginTop: 10 }}>
                              {getValue(parseFloat(item.value))}
                            </span>
                          </div>
                        </>
                      );
                    })}
                    {/*
                    <div className="divPubli">
                     
                        // <img src={qrcode} />
                      
                      <video
                        src={video}
                        loop
                        muted
                        autoPlay
                        controls=""
                      ></video>
                    </div>*/}
                  </div>
                </>
              ) : (
                <>
                  <Slider
                    {...settings}
                    className="right"
                    style={{ height: "100vh" }}
                  >
                    {tournament.award.split("-").map((item, index) => {
                      return (
                        <>
                          <Line style={{ marginLeft: "25%", marginTop: -2 }} />
                          <div className="awardView">
                            <h1>{index + 1}º LUGAR</h1>
                            <span>{getValue(parseFloat(item))}</span>
                          </div>
                        </>
                      );
                    })}
                    {tournament.vacancys.map((item) => {
                      return (
                        <>
                          <Line />
                          <div className="awardView">
                            <h1 style={{ marginBottom: 5 }}>{item.name}</h1>
                            <p style={{ fontSize: 17 }}>{item.description}</p>
                            <span style={{ marginTop: 10 }}>
                              {getValue(parseFloat(item.value))}
                            </span>
                          </div>
                        </>
                      );
                    })}
                  </Slider>
                  {/*
                    <div
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                      width: "18%",
                      height: "33vh",
                      background: "#FFF",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img src={qrcode} style={{ height: "33vh" }} />
                  </div>
                     */}
                </>
              )}
            </>
          ) : (
            <div className="right" style={{ background: "transparent" }}></div>
          )}
        </>
      ) : (
        <Loader white size={130} />
      )}
    </Container>
  );
};

export default ViewTournament;
