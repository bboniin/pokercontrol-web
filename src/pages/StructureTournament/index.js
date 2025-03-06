import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import {
  Container,
  ContainerInputs,
  ContainerView,
  Title,
  ViewInput,
  ViewStructure,
} from "./styles";
import { toast } from "react-toastify";
import { Button, Input, Select } from "antd";
import { differenceInSeconds } from "date-fns";
import Loader from "../../components/Loader";
import { Textfit } from "react-textfit";

const StructureTournament = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nivel_max_buyin_free, setNivel_max_buyin_free] = useState(0);
  const [nivel_max_in, setNivel_max_in] = useState(0);
  const [nivel_max_timechip, setNivel_max_timechip] = useState(0);
  const [niveis, setNiveis] = useState([]);
  const [intervalView, setIntervalView] = useState(0);
  const [intervals, setIntervals] = useState([]);
  const [tournament, setTournament] = useState({});
  const [tournamentEnd, setTournamentEnd] = useState(false);
  const [typesIntervals, setTypesIntervals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [nivel, setNivel] = useState(0);
  const [timerNivel, setTimerNivel] = useState(0);
  const [nextInterval, setNextInterval] = useState(0);
  const [isInterval, setIsInterval] = useState(false);
  const [textNivel, setTextNivel] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    loadTournament();
  }, []);

  useEffect(() => {
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
            if (timer >= timerNivel || isInterval) {
              timerCount(tournament, "");
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
  }, [tournament, timerNivel, intervals]);

  function timerCount(tournament, intervals) {
    let timer =
      differenceInSeconds(new Date(), new Date(tournament.datetime_initial)) -
      tournament.seconds_paused;
    let timerC = 0;
    let intervalsC = 0;
    let nextInterval = 0;
    let timerNivel = 0;
    let search = true;
    let interval = false;
    let intervalsArray = [];
    let intervalsTypeArray = [];

    if (intervals) {
      intervals.map((item, idx) => {
        intervalsArray.push(typesIntervals[idx] + item);
      });
    } else {
      intervalsArray = tournament.intervals.split("-");
    }

    if (intervals) {
      intervalsTypeArray = typesIntervals;
    } else {
      intervalsTypeArray = tournament.intervals
        .split("-")
        .map((item) => item.replace(/[0-9]/g, ""));
    }

    intervalsArray.map((item, index) => {
      timerC += parseInt(item.substring(1)) * 60;
      if (intervalsTypeArray[index] == "I") {
        if (!search && !nextInterval) {
          nextInterval = timerC;
          setNextInterval(nextInterval - parseInt(item.substring(1)) * 60);
        }
      }
      if (intervalsTypeArray[index - 1] == "I") {
        intervalsC += 1;
      }
      if (timerC > timer && search) {
        if (intervalsTypeArray[index] == "I") {
          interval = true;
        }
        timerNivel = timerC;
        setTimerNivel(timerC);
        setNivel(index - intervalsC);
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

  useEffect(() => {
    loadTimer(tournament, intervals);
  }, [intervals, tournament]);

  async function loadTimer(tournament) {
    let timer =
      differenceInSeconds(new Date(), new Date(tournament.datetime_initial)) -
      tournament.seconds_paused;
    let timerC = 0;
    let search = true;
    intervals.map((item, index) => {
      timerC += parseInt(item) * 60;
      if (timerC > timer && search) {
        setIntervalView(index);
        search = false;
      }
    });
    timerCount(tournament, intervals);
  }

  async function loadTournament() {
    await api
      .get(`/tournament/${id}`)
      .then((response) => {
        let tournament = response.data;
        setNivel_max_buyin_free(tournament.max_buyin_free);
        setNivel_max_in(tournament.max_in);
        setNivel_max_timechip(tournament.max_timechip);
        let niveis = tournament.blinds.split("-");
        let intervals = tournament.intervals
          .split("-")
          .map((item) => item.replace(/[^0-9]/g, ""));
        let typesIntervals = tournament.intervals
          .split("-")
          .map((item) => (item = item[0]));
        let timer =
          differenceInSeconds(
            new Date(),
            new Date(tournament.datetime_initial)
          ) - tournament.seconds_paused;
        let timerC = 0;
        let search = true;
        intervals.map((item, index) => {
          timerC += parseInt(item) * 60;
          if (timerC > timer && search) {
            setIntervalView(index);
            search = false;
          }
        });
        setTournament(tournament);
        setNiveis(niveis);
        setIntervals(intervals);
        setTypesIntervals(typesIntervals);

        timerCount(tournament, "");
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
    setIsLoading(false);
  }

  async function editTournament() {
    setIsLoadingModal(true);
    if (
      intervals.some((item) => !item) ||
      typesIntervals.some((item) => !item) ||
      niveis
        .slice(0, typesIntervals.filter((item) => item == "N").length)
        .some((item) => !item)
    ) {
      toast.warning("Preencha todos os campos");
    } else {
      let niveisC = niveis.slice(
        0,
        typesIntervals.filter((item) => item == "N").length
      );
      let blinds = "";
      niveisC.map((item) => {
        blinds += item + "-";
      });
      let intervalsC = "";
      typesIntervals.map((item, index) => {
        intervalsC += item + intervals[index] + "-";
      });
      blinds = blinds.slice(0, -1);
      intervalsC = intervalsC.slice(0, -1);

      if (!nivel_max_in) {
        toast.warning("Preencha os niveis máximo de entrada");
        setIsLoadingModal(false);
        return "";
      }

      await api
        .put(`/structure-tournament/${id}`, {
          blinds: blinds,
          intervals: intervalsC,
          nivel_max_buyin_free: parseInt(nivel_max_buyin_free),
          nivel_max_in: parseInt(nivel_max_in),
          nivel_max_timechip: parseInt(nivel_max_timechip),
        })
        .then((response) => {
          toast.success("Estrutura do torneio alterada com sucesso");
          navigate(`/torneio/${response.data.id}`);
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
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente"
            );
          }
        });
    }
    setIsLoadingModal(false);
  }

  return (
    <Container>
      <Title>
        <h2>Estrutura Torneio</h2>
      </Title>
      {!isLoading && (
        <ContainerInputs>
          <div style={{ display: "flex", width: "100%" }}>
            <ViewInput style={{ width: "100%", maxWidth: 180 }}>
              <p>Nivel máximo buyin grátis</p>
              <Input
                placeholder="0"
                value={nivel_max_buyin_free || ""}
                type="number"
                onChange={(event) =>
                  setNivel_max_buyin_free(parseInt(event.target.value))
                }
              />
            </ViewInput>
            <ViewInput style={{ width: "100%", maxWidth: 180 }}>
              <p>Nivel máximo timechip</p>
              <Input
                placeholder="0"
                value={nivel_max_timechip || ""}
                type="number"
                onChange={(event) =>
                  setNivel_max_timechip(parseInt(event.target.value))
                }
              />
            </ViewInput>
            <ViewInput style={{ width: "100%", maxWidth: 180 }}>
              <p>Nivel máximo para inscrições</p>
              <Input
                placeholder="0"
                value={nivel_max_in || ""}
                type="number"
                onChange={(event) =>
                  setNivel_max_in(parseInt(event.target.value))
                }
              />
            </ViewInput>
          </div>
          <ContainerView>
            <Textfit
              mode="single"
              min={25}
              max={125}
              style={{
                width: "100%",
                fontFamily: "BarlowCondensed-Bold",
                textAlign: "center",
                color: " #ffffff",
                "-webkit-text-stroke": "3px #20d071",
              }}
            >
              {textNivel
                ? textNivel
                : !tournamentEnd
                ? "FIM"
                : secondsToDhms(timerNivel - timer)}
            </Textfit>
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
                    max={40}
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
                    max={30}
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
                      min={10}
                      max={40}
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
                      max={50}
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
          </ContainerView>

          {typesIntervals.map((item, index) => {
            return (
              <ViewStructure
                style={
                  intervalView == index
                    ? { background: "#20d071", color: "#FFF" }
                    : { color: "#000" }
                }
              >
                <button
                  onClick={() => {
                    let typesIntervalsC = [...typesIntervals];
                    typesIntervalsC.splice(index + 1, 0, "I");
                    setTypesIntervals(typesIntervalsC);
                    let intervalsC = [...intervals];
                    intervalsC.splice(index + 1, 0, 15);
                    setIntervals(intervalsC);
                    let niveisC = [...niveis];
                    niveisC.splice(index + 1, 0, "");
                    setNiveis(niveisC);
                  }}
                  style={{
                    background: intervalView == index ? "#FFF" : "#20d071",
                    color: intervalView == index ? "#20d071" : "#fff",
                    textAlign: "center",
                    height: 35,
                    fontSize: 12,
                    width: 70,
                    marginBottom: 10,
                    marginRight: 10,
                  }}
                >
                  Novo Nivel
                </button>
                <div
                  style={{
                    marginBottom: 10,
                    width: 70,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p>
                    Nível:{" "}
                    {index +
                      1 -
                      typesIntervals
                        .slice(0, index + 1)
                        .filter((item) => item != "N").length}
                  </p>
                  <p>Tempo: {index + 1}</p>
                </div>

                <ViewInput
                  style={{ width: "100%", maxWidth: 150, textAlign: "left" }}
                >
                  <p>Tipo</p>
                  <Select
                    defaultValue={item}
                    dropdownStyle={{ color: "#000" }}
                    style={{ width: "100%", fontSize: 14 }}
                    onChange={(text) => {
                      let typesIntervalsC = [...typesIntervals];
                      typesIntervalsC[index] = text;
                      setTypesIntervals(typesIntervalsC);
                    }}
                    options={[
                      {
                        value: "N",
                        label: "Nivel",
                      },
                      {
                        value: "I",
                        label: "Intervalo",
                      },
                    ]}
                  />
                </ViewInput>
                <ViewInput style={{ width: "100%", maxWidth: 80 }}>
                  <p>Tempo</p>
                  <Input
                    placeholder="tempo"
                    value={intervals[index]}
                    type="number"
                    onChange={(event) => {
                      let intervalsC = [...intervals];
                      intervalsC[index] = isNaN(parseInt(event.target.value))
                        ? 0
                        : parseInt(event.target.value);
                      setIntervals(intervalsC);
                    }}
                  />
                </ViewInput>
                {item == "N" && (
                  <ViewInput
                    style={{ width: "100%", maxWidth: 250, marginRight: 0 }}
                  >
                    <p>Blind</p>
                    <Input
                      placeholder="tempo"
                      value={
                        niveis[
                          index -
                            typesIntervals
                              .slice(0, index + 1)
                              .filter((item) => item != "N").length
                        ]
                      }
                      onChange={(event) => {
                        let niveisC = [...niveis];
                        niveisC[
                          index -
                            typesIntervals
                              .slice(0, index + 1)
                              .filter((item) => item != "N").length
                        ] = event.target.value;
                        setNiveis(niveisC);
                      }}
                    />
                  </ViewInput>
                )}
              </ViewStructure>
            );
          })}
          <Button
            type="primary"
            loading={isLoadingModal}
            onClick={() => {
              editTournament();
            }}
          >
            <span>Salvar Alteração</span>
          </Button>
        </ContainerInputs>
      )}

      {isLoading && <Loader />}
    </Container>
  );
};

export default StructureTournament;
