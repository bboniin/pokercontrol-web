import React, { useEffect, useState } from "react";
import {
  MdAccountCircle,
  MdAdd,
  MdOutlineMoreVert,
  MdAddCircle,
  MdAutorenew,
  MdExitToApp,
  MdMonetizationOn,
  MdTimer,
  MdRefresh,
  MdPause,
  MdCancel,
} from "react-icons/md";
import { BiSolidMinusCircle, BiSolidPlusCircle } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import {
  Container,
  Client,
  Chair,
  Title,
  ViewInput,
  Payments,
  ClientChair,
  InfosTournament,
  Amount,
  ViewAward,
  Table,
  Row,
} from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  Input,
  AutoComplete,
  Select,
  Switch,
  Tooltip,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { getValue } from "../../services/functions";
import { differenceInSeconds, format } from "date-fns";
import IntlCurrencyInput from "react-intl-currency-input";
import MethodsPayment from "../../components/MethodsPayment";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

const { confirm } = Modal;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  width: "50%",
  height: 36,
  background: isDragging ? "#fff" : "transparent",
  ...draggableStyle,
});

const Tournament = () => {
  const navigate = useNavigate();

  const { tournament_id } = useParams();

  const [clients, setClients] = useState([]);
  const [clientsTournament, setClientsTournament] = useState([]);
  const [clientsC, setClientsC] = useState([]);
  const [clientsTournamentC, setClientsTournamentC] = useState([]);
  const [client, setClient] = useState("");
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);
  const [nameClient, setNameClient] = useState("");
  const [chairs, setChairs] = useState([]);
  const [chairsN, setChairsN] = useState([]);
  const [tournament, setTournament] = useState("");
  const [chair, setChair] = useState("");
  const [positions, setPositions] = useState(0);
  const [value, setValue] = useState(0);
  const [visibleModalVacancy, setVisibleModalVacancy] = useState(false);
  const [vacancy, setVacancy] = useState({});
  const [vacancyClient, setVacancyClient] = useState("");
  const [getMethods, setGetMethods] = useState([]);
  const [position, setPosition] = useState("");
  const [positionAward, setPositionAward] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timechip, setTimechip] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [id, setId] = useState("");
  const [award, setAward] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [methods_transaction, setMethods_transaction] = useState([]);
  const [playresAward, setPlayresAward] = useState("");
  const [staff, setStaff] = useState("");
  const [observation, setObservation] = useState("");
  const [datePayment, setDatePayment] = useState(new Date());
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [timerTimechip, setTimerTimechip] = useState(false);
  const [isOpenFinishAdd, setIsOpenFinishAdd] = useState(false);
  const [isOpenClient, setIsOpenClient] = useState(false);
  const [isOpenAward, setIsOpenAward] = useState(false);

  const [tournamentEnd, setTournamentEnd] = useState(false);
  const [tournamentClients, setTournamentClients] = useState([]);
  const [tournamentClientsC, setTournamentClientsC] = useState([]);
  const [nivel, setNivel] = useState(0);
  const [timerNivel, setTimerNivel] = useState(0);
  const [isInterval, setIsInterval] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    loadMethods();
    loadChairs();
    loadClients();
    setIsLoading(false);
  }, []);

  async function loadMethods() {
    setIsLoading(true);
    await api
      .get("/methods?all=true")
      .then((response) => {
        let methods = response.data;
        methods.map((item) => {
          item.value = item.id;
          item.label = item.name;
        });
        setGetMethods(methods);
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

  useEffect(() => {
    setMethods_transaction([]);
    setPurchases([]);
    setDatePayment("");
    setObservation("");
    setNameClient("");
  }, [isOpenAward, isOpen]);

  useEffect(() => {
    if (tournament) {
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
          timerCount(tournament);
        }
      }, 250);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => {
        clearInterval(timerTournament);
      };
    }
  }, [tournament]);

  function timerCount(tournament) {
    let timer =
      differenceInSeconds(new Date(), new Date(tournament.datetime_initial)) -
      tournament.seconds_paused;
    let timerC = 0;
    let intervals = 0;
    let search = true;
    let interval = false;
    tournament.intervals.split("-").map((item, index) => {
      timerC += parseInt(item.substring(1)) * 60;
      if (
        String(tournament.intervals.split("-")[index - 1]).indexOf("I") == 0
      ) {
        intervals += 1;
      }
      if (timerC > timer && search) {
        if (item.slice(0, 1) == "I") {
          interval = true;
        }
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

  async function loadChairs() {
    let chairs = [];
    let chairsN = [];
    let tournament = {};
    await api
      .get(`/tournament/${tournament_id}`)
      .then((response) => {
        tournament = response.data;
        if (tournament.award) {
          setAward(
            tournament.award.split("-").map((item) => (item = parseFloat(item)))
          );
        }

        let clientC = tournament.clients;
        clientC.map((item) => {
          item.label = item.client.name;
          item.value = item.client.id;
        });
        setTournament(tournament);
        setTournamentClients(clientC);
        setTournamentClientsC(clientC);
        for (let c = 0; c < tournament.chairs; c++) {
          chairs[c] = { chairs: [] };
          chairsN.push({
            value: c + 1,
            label: `Mesa ${c + 1}`,
          });
          for (let p = 0; p < 10; p++) {
            chairs[c].chairs[p] = {
              label: `Posição ${p + 1}`,
              value: p + 1,
            };
          }
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
    setChairsN([...chairsN]);
    if (
      tournament.status == "aberto" ||
      tournament.status == "inscricao" ||
      tournament.status == "final"
    ) {
      await api
        .get(`/clients-tournament/${tournament.id}`)
        .then((response) => {
          let clientsTournament = [];
          response.data.map((item) => {
            if (item.chair) {
              clientsTournament.push(item);
              item.chair = item.chair.replace("T", "");
              let [i, p] = item.chair.split("-");
              item.value = item.id;
              item.label = `${item.name} (Mesa ${i} - Posição ${p})`;
              chairs[i - 1].chairs[p - 1] = item;
            }
          });
          setClientsTournament(clientsTournament);
          setClientsTournamentC(clientsTournament);
          setChairs([...chairs]);
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
  }

  async function loadClients() {
    await api
      .get(`/clients-chair?tournament_id=${tournament_id}`)
      .then((response) => {
        let clientC = response.data;
        clientC.map((item) => {
          item.label = item.name;
          item.value = item.id;
        });
        setClients(clientC);
        setClientsC(clientC);
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

  async function finishAdd() {
    setIsLoadingModal(true);
    if (award.length == 0 || award.some((item) => !item)) {
      toast.warning("Gere e preencha o modelo de recompensa");
    } else {
      let awardString = "";
      award.map((item) => {
        awardString = awardString + item + "-";
      });
      awardString = awardString.slice(0, -1);
      await api
        .put(`/end-register/${tournament.id}`, {
          award: awardString,
          staff: staff,
        })
        .then((response) => {
          setTournament(response.data);
          setIsOpenFinishAdd(false);
          toast.success("Inscrições do torneio finalizadas com sucesso");
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

  async function addBuyTournament() {
    setIsLoadingModal(true);
    if (id) {
      if (!purchases.length) {
        toast.warn("Adicione pelo menos uma compra");
        setIsLoadingModal(false);
        return "";
      }
    } else {
      if (!client || !chair || !position) {
        toast.warn(
          "Selecione o cliente, mesa e posição na mesa para adicionar ao Torneio"
        );
        setIsLoadingModal(false);
        return "";
      } else {
        if (!purchases.some((item) => item.type == "entrie")) {
          toast.warn("Entrada é obrigátoria");
          setIsLoadingModal(false);
          return "";
        }
      }
    }

    let methods_transactionC = methods_transaction.filter(
      (item) => item.id != "Crédito"
    );

    if (methods_transactionC.length) {
      if (
        methods_transaction.filter((item) => !item.id || !item.value).length
      ) {
        toast.warn("Selecione o método de pagamento e o valor");
        setIsLoadingModal(false);
        return "";
      }

      if (
        value <
        methods_transaction
          .map((method) => method["value"])
          .reduce((total, value) => total + value)
      ) {
        toast.warn("Valor restante não pode ser negativo");
        setIsLoadingModal(false);
        return "";
      } else {
        if (
          value !=
          methods_transaction
            .map((method) => method["value"])
            .reduce((total, value) => total + value)
        ) {
          methods_transactionC.push({
            id: "Crédito",
            name: "Crédito",
            percentage: 0,
            value:
              value -
              methods_transaction
                .map((method) => method["value"])
                .reduce((total, value) => total + value),
          });
          if (!datePayment) {
            toast.warn("Data de pevisão de pagamento é obrigátorio");
            setIsLoadingModal(false);
            return "";
          }
        }
      }
    } else {
      methods_transactionC.push({
        id: "Crédito",
        name: "Crédito",
        percentage: 0,
        value: value,
      });
      if (!datePayment) {
        toast.warn("Data de pevisão de pagamento é obrigátorio");
        setIsLoadingModal(false);
        return "";
      }
    }

    await api
      .post(`/${id ? "buy" : "add"}-tournament`, {
        id: client.id,
        client_id: client.id,
        chair: `${chair}-${position}`,
        tournament_id: tournament.id,
        methods_transaction: methods_transactionC,
        timechip: timechip,
        value: value,
        purchases: purchases,
        date_payment: datePayment,
        observation: observation,
      })
      .then((response) => {
        if (id) {
          toast.success("Transação cadastrada com sucesso");
        } else {
          toast.success("Cliente adicionado com sucesso");
        }
        loadClients();
        loadChairs();
        setIsOpen(false);
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

    setIsLoadingModal(false);
  }

  async function exitChair(client, i, p) {
    setIsLoadingModal(true);

    let methods_transactionC = methods_transaction.filter(
      (item) => item.id != "Crédito"
    );

    if (award[positionAward - 1] && tournament.status == "final") {
      if (methods_transactionC.length) {
        if (
          methods_transaction.filter((item) => !item.id || !item.value).length
        ) {
          toast.warn("Selecione o método de pagamento e o valor");
          setIsLoadingModal(false);
          return "";
        }

        if (
          value <
          methods_transaction
            .map((method) => method["value"])
            .reduce((total, value) => total + value)
        ) {
          toast.warn("Valor restante não pode ser negativo");
          setIsLoadingModal(false);
          return "";
        } else {
          if (
            value !=
            methods_transaction
              .map((method) => method["value"])
              .reduce((total, value) => total + value)
          ) {
            methods_transactionC.push({
              id: "Crédito",
              name: "Crédito",
              percentage: 0,
              value:
                value -
                methods_transaction
                  .map((method) => method["value"])
                  .reduce((total, value) => total + value),
            });
            if (!datePayment) {
              toast.warn("Data de pevisão de pagamento é obrigátorio");
              setIsLoadingModal(false);
              return "";
            }
          }
        }
      } else {
        methods_transactionC.push({
          id: "Crédito",
          name: "Crédito",
          percentage: 0,
          value: value,
        });
        if (!datePayment) {
          toast.warn("Data de pevisão de pagamento é obrigátorio");
          setIsLoadingModal(false);
          return "";
        }
      }
    }

    await api
      .put(`exit-tournament/${client.id}`, {
        tournament_id: tournament.id,
        methods_transaction: methods_transactionC,
        position: positionAward,
        sector_id: tournament.id,
        observation: observation,
      })
      .then((response) => {
        toast.success("Cliente removido do Torneio com sucesso");
        let chairC = [...chairs];
        chairC[i].chairs[p] = {
          label: `Posição ${p + 1}`,
          value: p + 1,
        };
        setTournament(response.data);
        setChairs(chairC);
        setIsOpenAward(false);
        loadClients();
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
    setIsLoadingModal(false);
  }

  async function canceledClient(client, i, p) {
    setIsLoadingModal(true);
    await api
      .put(`canceled-client/${client.id}`, {
        tournament_id: tournament.id,
      })
      .then((response) => {
        toast.success("Cliente removido e compras canceladas com sucesso");
        let chairC = [...chairs];
        chairC[i].chairs[p] = {
          label: `Posição ${p + 1}`,
          value: p + 1,
        };
        setTournament(response.data);
        setChairs(chairC);
        loadClients();
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
    setIsLoadingModal(false);
  }

  async function pausedTournament() {
    await api
      .put(`paused-tournament/${tournament.id}`)
      .then((response) => {
        setTournament(response.data);
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

  async function sendVacancy() {
    setIsLoadingModal(true);
    if (!vacancyClient?.client_id) {
      toast.warn("Selecione o cliente");
    } else {
      await api
        .put(`/send/vacancy/${vacancy.id}`, {
          client_id: vacancyClient.client_id,
        })
        .then((response) => {
          loadChairs();
          setVisibleModalVacancy(false);
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
        <h2>Torneio</h2>
        <div>
          <Button
            type="primary"
            style={{ paddingRight: 10 }}
            onClick={() => {
              loadChairs();
            }}
          >
            <MdRefresh size="20" color="#fff" />
          </Button>
          {tournament.status != "aberto" &&
            tournament.status != "encerrado" &&
            tournament.status != "criado" && (
              <Button
                type="primary"
                onClick={() => {
                  confirm({
                    title: `Deseja ${
                      tournament.paused ? "retomar" : "pausar"
                    } o Torneio?`,
                    icon: <ExclamationCircleFilled />,
                    content: `Após essa ação, o Torneio será ${
                      tournament.paused ? "retomado" : "pausado"
                    }.`,
                    onOk() {
                      pausedTournament();
                    },
                    onCancel() {},
                    cancelText: "Cancelar",
                  });
                }}
              >
                <MdPause size="20" color="#fff" />
                <span>{tournament.paused ? "Retomar" : "Pausar"} Torneio</span>
              </Button>
            )}
          {(tournament.status == "aberto" ||
            tournament.status == "inscricao" ||
            tournament.status == "final") && (
            <Button
              type="primary"
              onClick={() => {
                navigate(`/estrutura-torneio/${tournament_id}`);
              }}
            >
              <MdTimer size="20" color="#fff" />
              <span>Estrutura Torneio</span>
            </Button>
          )}
          {(tournament.status == "inscricao" ||
            tournament.status == "aberto") && (
            <Button
              type="primary"
              onClick={() => {
                if (
                  tournament.status == "inscricao" ||
                  tournament.status == "aberto"
                ) {
                  if (
                    differenceInSeconds(
                      new Date(),
                      new Date(tournament.datetime_max_in)
                    ) -
                      tournament.seconds_paused >
                      0 &&
                    tournament.status == "inscricao"
                  ) {
                    toast.warn("Inscrições finalizadas");
                  } else {
                    setId("");
                    setClient("");
                    setChair("");
                    setPosition("");
                    setTimechip(false);
                    setValue(0);
                    if (tournament.status == "aberto") {
                      setTimerTimechip(true);
                    } else {
                      if (
                        differenceInSeconds(
                          new Date(),
                          new Date(tournament.datetime_max_timechip)
                        ) -
                          tournament.seconds_paused >
                        0
                      ) {
                        setTimerTimechip(false);
                      } else {
                        setTimerTimechip(true);
                      }
                    }
                    setIsOpen(true);
                  }
                } else {
                  toast.warn("Inscrições finalizadas");
                }
              }}
            >
              <MdAdd size="20" color="#fff" />
              <span>Adicionar Cliente</span>
            </Button>
          )}
          {tournament.status == "final" && (
            <Button
              type="primary"
              onClick={() => {
                setIsOpenFinishAdd(true);
              }}
            >
              <MdMonetizationOn size="20" color="#fff" />
              <span>Editar Recompensa</span>
            </Button>
          )}
        </div>
      </Title>

      {!isLoading && tournament && (
        <>
          <InfosTournament>
            <h1>{tournament.name}</h1>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <div className="infos">
                <p>Fichas: {parseInt(tournament.total_tokens / 1000)}K</p>
                {tournament?.purchases.map((item) => {
                  if (item.type != "service") {
                    return (
                      <>
                        <p>
                          {item.name}: {getValue(item.value)} / {item.token}{" "}
                          Fichas
                        </p>
                        {item.is_staff && (
                          <p>
                            Staff: {getValue(item.value_staff)} /{" "}
                            {item.token_staff} Fichas
                          </p>
                        )}
                      </>
                    );
                  }
                })}
              </div>
              {(tournament.status == "inscricao" ||
                tournament.status == "final") && (
                <div className="infos">
                  <p>
                    Premiação Garantida:{" "}
                    {getValue(tournament.totalAward_guaranteed)}
                  </p>
                  <p>
                    Premiação Acumulada:{" "}
                    {getValue(tournament.totalAward_accumulated)}
                  </p>
                  <p>
                    Participantes:{" "}
                    {
                      tournament.clients?.filter((item) => item.exit == false)
                        .length
                    }
                    /{tournament.clients?.length}
                  </p>
                  <p>
                    Inicio do Torneio:{" "}
                    {format(
                      new Date(tournament.datetime_initial),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </p>
                  <p>
                    Rodada:{" "}
                    {tournamentEnd
                      ? "Encerradas"
                      : isInterval
                      ? "Intervalo"
                      : `Nivel ${nivel + 1}`}
                  </p>
                  <p>
                    Inscrições até{" "}
                    {format(
                      new Date(tournament.datetime_max_in),
                      "dd/MM/yyyy HH:mm:ss"
                    )}
                  </p>
                </div>
              )}

              {tournament.status == "encerrado" && (
                <div className="infos">
                  <p>
                    Premiação Garantida:{" "}
                    {getValue(tournament.totalAward_guaranteed)}
                  </p>
                  <p>
                    Premiação Acumulada:{" "}
                    {getValue(tournament.totalAward_accumulated)}
                  </p>
                  {!!tournament.vacancys.length && (
                    <p>
                      Premiação em Vagas{" "}
                      {getValue(
                        tournament.vacancys.reduce(
                          (acumulador, item) => acumulador + item.value,
                          0
                        )
                      )}
                    </p>
                  )}
                  {!!tournament.rankings.length && (
                    <p>
                      Premiação Ranking{" "}
                      {getValue(
                        tournament.rankings.reduce(
                          (acumulador, item) => acumulador + item.value,
                          0
                        )
                      )}
                    </p>
                  )}
                  <p>
                    Premiação Entregue:{" "}
                    {getValue(
                      tournament.totalAward_guaranteed >
                        tournament.totalAward_accumulated - tournament.staff
                        ? tournament.totalAward_guaranteed
                        : tournament.totalAward_accumulated - tournament.staff
                    )}
                  </p>
                  <p>Rake da casa: {getValue(tournament.staff)}</p>
                  <p>Participantes: {tournament.clients.length}</p>
                </div>
              )}
              {!!tournament?.vacancys.length && (
                <div className="infos">
                  <p>{tournament?.vacancys.length} vagas</p>
                  {tournament?.vacancys.map((item, idx) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <p style={{ width: "auto" }}>
                          {item.name}: {item.client && item.client.name}
                        </p>
                        {!item.client && (
                          <Button
                            type="primary"
                            onClick={() => {
                              setVacancy(item);
                              setVacancyClient("");
                              setTournamentClients(tournamentClientsC);
                              setNameClient("");
                              setVisibleModalVacancy(true);
                            }}
                            style={{
                              width: 100,
                              height: 20,
                              margin: 0,
                              fontSize: 10,
                              marginLeft: 10,
                            }}
                          >
                            <span>Enviar Vaga</span>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {(tournament.status == "aberto" ||
              tournament.status == "inscricao" ||
              tournament.status == "final") && (
              <a href={`/view-torneio/${tournament.id}`} target="_blank">
                <Button type="primary">
                  <span>Visualizar Tela</span>
                </Button>
              </a>
            )}
            {tournament.status == "aberto" && (
              <Button
                type="primary"
                onClick={async () => {
                  await api
                    .put(`/initial-tournament/${tournament.id}`)
                    .then((response) => {
                      loadChairs();
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
                }}
              >
                <span>Iniciar Torneio</span>
              </Button>
            )}
            {tournament.status == "criado" && (
              <Button
                type="primary"
                onClick={async () => {
                  await api
                    .put(`/open-tournament/${tournament.id}`)
                    .then((response) => {
                      loadChairs();
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
                }}
              >
                <span>Abrir Mesas</span>
              </Button>
            )}
            {tournament.status == "inscricao" && (
              <Button
                type="primary"
                onClick={async () => {
                  const playresAward =
                    tournament.clients.filter((item) => item.exit == false)
                      .length *
                    (tournament.percentage_players_award / 100);
                  let awardC = [];
                  for (let i = 0; i < playresAward; i++) {
                    awardC.push(0);
                  }
                  setAward(awardC);
                  setIsOpenFinishAdd(true);
                }}
              >
                <span>Finalizar Inscrições</span>
              </Button>
            )}
            {tournament.status == "final" && (
              <Button
                type="primary"
                onClick={async () => {
                  await api
                    .put(`/finish-tournament/${tournament.id}`)
                    .then((response) => {
                      setTournament(response.data);
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
                }}
              >
                <span>Finalizar Torneio</span>
              </Button>
            )}
          </InfosTournament>

          {tournament.status != "encerrado" &&
            tournament.status != "criado" && (
              <ViewInput style={{ maxWidth: 400, marginBottom: 25 }}>
                <p>Procurar Cliente</p>
                <AutoComplete
                  style={{
                    width: "100%",
                    fontSize: 14,
                    textAlign: "left",
                  }}
                  options={clientsTournament}
                  value={searchClient}
                  notFoundContent={<>Nenhum cliente encontrado</>}
                  onSelect={(text, chair) => {
                    setClient(chair);
                    chair.chair = chair.chair.replace("T", "");
                    let [i, p] = chair.chair.split("-");
                    setI(i);
                    setP(p);

                    setIsOpenClient(true);
                    setSearchClient("");
                    setClients(clientsTournamentC);
                  }}
                  onSearch={(text) => {
                    setNameClient(text);
                    setClientsTournament(
                      clientsTournamentC.filter((item) => {
                        return (
                          String(item.label)
                            .toUpperCase()
                            .indexOf(text.toUpperCase()) != -1
                        );
                      })
                    );
                  }}
                  placeholder="procurar por nome"
                />
              </ViewInput>
            )}
          {tournament.status == "encerrado" && (
            <>
              <h2>Jogadores</h2>

              {tournament.clients.length ? (
                <Table>
                  <tbody>
                    {tournament.clients.map((transaction, index) => (
                      <tr key={transaction.id}>
                        <td>{index + 1}°</td>
                        <td>{transaction.client.name}</td>
                        <td>
                          {transaction.award.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td>
                          {format(
                            new Date(transaction.date_out),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {tournament.clients.length != 0 && (
                    <thead>
                      <tr>
                        <td>Posição</td>
                        <td>Cliente</td>
                        <td>Recompensa</td>
                        <td>Elminação</td>
                      </tr>
                    </thead>
                  )}
                </Table>
              ) : (
                <div className="error">
                  <p>Nenhuma jogador cadastrado nesse torneio</p>
                </div>
              )}
            </>
          )}

          {tournament.status != "encerrado" && (
            <>
              <DragDropContext
                onDragEnd={async (result) => {
                  const { source, destination, draggableId } = result;
                  if (!destination) {
                    toast.warn("Posição inválida");
                    return;
                  }

                  const initialPosition = source.index;
                  const finalPosition = destination.index;

                  let chair_initial = 1,
                    position_initial = initialPosition;

                  for (let i = 0; position_initial >= 10; i++) {
                    position_initial -= 10;
                    chair_initial += 1;
                  }

                  let chair_final = 1,
                    position_final = finalPosition;

                  for (let i = 0; position_final >= 10; i++) {
                    position_final -= 10;
                    chair_final += 1;
                  }

                  await api
                    .post(`/move-tournament`, {
                      id: draggableId,
                      chair: `${chair_final}-${position_final + 1}`,
                      tournament_id: tournament.id,
                    })
                    .then(async (response) => {
                      toast.success("Cliente movido com sucesso");
                      loadChairs();
                      setIsOpen(false);
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
                }}
              >
                <div className="drop-container">
                  {chairs.map((item, i) => {
                    return (
                      <Chair>
                        <h2>Mesa {i + 1}</h2>

                        <div className="row">
                          <div className="column-drop">
                            <Droppable droppableId={"droppable-" + "1-" + i}>
                              {(provided, snapshot) => (
                                <div
                                  className="column"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  {item.chairs.map((chair, p) => {
                                    if (p < 5) {
                                      return (
                                        <Client
                                          style={{
                                            borderBottomWidth: p != 4 ? 1 : 0,
                                            borderLeftWidth: 0,
                                          }}
                                        >
                                          <h2>P{p + 1}:</h2>
                                          <div>
                                            {chair.name ? (
                                              <Draggable
                                                key={chair.id}
                                                draggableId={chair.id}
                                                index={p + i * 10}
                                              >
                                                {(provided, snapshot) => {
                                                  return (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.dragHandleProps}
                                                      {...provided.draggableProps}
                                                      style={{
                                                        ...{
                                                          borderBottomWidth:
                                                            p >= 8 ? 0 : 1,
                                                          borderLeftWidth:
                                                            p % 2 == 0 ? 0 : 1,
                                                        },
                                                        ...getItemStyle(
                                                          snapshot.isDragging,
                                                          snapshot.isDragging
                                                            ? provided
                                                                .draggableProps
                                                                .style
                                                            : {}
                                                        ),
                                                      }}
                                                    >
                                                      <p>{chair.name}</p>
                                                      <MdOutlineMoreVert
                                                        onClick={() => {
                                                          setClient(chair);
                                                          setI(i);
                                                          setP(p);

                                                          setIsOpenClient(true);
                                                        }}
                                                        color="#001B22"
                                                        size={22}
                                                        style={{
                                                          marginRight: -8,
                                                          cursor: "pointer",
                                                        }}
                                                      />
                                                    </div>
                                                  );
                                                }}
                                              </Draggable>
                                            ) : (
                                              <Draggable
                                                style={{ width: "100%" }}
                                                isDragDisabled={true}
                                                key={String(p + i * 10)}
                                                draggableId={String(p + i * 10)}
                                                index={p + i * 10}
                                              >
                                                {(provided, snapshot) => (
                                                  <button
                                                    ref={provided.innerRef}
                                                    onClick={() => {
                                                      if (
                                                        tournament.status ==
                                                          "inscricao" ||
                                                        tournament.status ==
                                                          "aberto"
                                                      ) {
                                                        if (
                                                          differenceInSeconds(
                                                            new Date(),
                                                            new Date(
                                                              tournament.datetime_max_in
                                                            )
                                                          ) -
                                                            tournament.seconds_paused >
                                                            0 &&
                                                          tournament.status ==
                                                            "inscricao"
                                                        ) {
                                                          toast.warn(
                                                            "Inscrições finalizadas"
                                                          );
                                                        } else {
                                                          setClient("");
                                                          setId("");
                                                          setChair(i + 1);
                                                          setPosition(p + 1);
                                                          setTimechip(false);

                                                          setValue(0);
                                                          if (
                                                            tournament.status ==
                                                            "aberto"
                                                          ) {
                                                            setTimerTimechip(
                                                              true
                                                            );
                                                          } else {
                                                            if (
                                                              differenceInSeconds(
                                                                new Date(),
                                                                new Date(
                                                                  tournament.datetime_max_timechip
                                                                )
                                                              ) -
                                                                tournament.seconds_paused >
                                                              0
                                                            ) {
                                                              setTimerTimechip(
                                                                false
                                                              );
                                                            } else {
                                                              setTimerTimechip(
                                                                true
                                                              );
                                                            }
                                                          }

                                                          setIsOpen(true);
                                                        }
                                                      } else {
                                                        toast.warn(
                                                          "Inscrições finalizadas"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <MdAddCircle
                                                      color="#777"
                                                      size={25}
                                                    />
                                                  </button>
                                                )}
                                              </Draggable>
                                            )}
                                          </div>
                                        </Client>
                                      );
                                    }
                                  })}
                                </div>
                              )}
                            </Droppable>
                          </div>
                          <div className="column-drop">
                            <Droppable droppableId={"droppable-" + "2-" + i}>
                              {(provided) => (
                                <div
                                  className="column"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  {item.chairs.map((chair, p) => {
                                    if (p >= 5) {
                                      return (
                                        <Client
                                          style={{
                                            borderBottomWidth: p != 9 ? 1 : 0,
                                            borderLeftWidth: 1,
                                          }}
                                        >
                                          <h2>P{p + 1}:</h2>
                                          <div>
                                            {chair.name ? (
                                              <Draggable
                                                key={chair.id}
                                                draggableId={chair.id}
                                                index={p + i * 10}
                                              >
                                                {(provided, snapshot) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    style={{
                                                      ...{
                                                        borderBottomWidth:
                                                          p >= 8 ? 0 : 1,
                                                        borderLeftWidth:
                                                          p % 2 == 0 ? 0 : 1,
                                                      },
                                                      ...getItemStyle(
                                                        snapshot.isDragging,
                                                        snapshot.isDragging
                                                          ? provided
                                                              .draggableProps
                                                              .style
                                                          : {}
                                                      ),
                                                    }}
                                                  >
                                                    <p>{chair.name}</p>
                                                    <MdOutlineMoreVert
                                                      onClick={() => {
                                                        setClient(chair);
                                                        setI(i);
                                                        setP(p);

                                                        setIsOpenClient(true);
                                                      }}
                                                      color="#001B22"
                                                      size={22}
                                                      style={{
                                                        marginRight: -8,
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                  </div>
                                                )}
                                              </Draggable>
                                            ) : (
                                              <Draggable
                                                style={{ width: "100%" }}
                                                isDragDisabled={true}
                                                key={String(p + i * 10)}
                                                draggableId={String(p + i * 10)}
                                                index={p + i * 10}
                                              >
                                                {(provided, snapshot) => (
                                                  <button
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    style={{
                                                      ...getItemStyle(),
                                                    }}
                                                    onClick={() => {
                                                      if (
                                                        tournament.status ==
                                                          "inscricao" ||
                                                        tournament.status ==
                                                          "aberto"
                                                      ) {
                                                        if (
                                                          differenceInSeconds(
                                                            new Date(),
                                                            new Date(
                                                              tournament.datetime_max_in
                                                            )
                                                          ) -
                                                            tournament.seconds_paused >
                                                            0 &&
                                                          tournament.status ==
                                                            "inscricao"
                                                        ) {
                                                          toast.warn(
                                                            "Inscrições finalizadas"
                                                          );
                                                        } else {
                                                          setClient("");
                                                          setId("");
                                                          setChair(i + 1);
                                                          setPosition(p + 1);
                                                          setTimechip(false);

                                                          setValue(0);

                                                          if (
                                                            tournament.status ==
                                                            "aberto"
                                                          ) {
                                                            setTimerTimechip(
                                                              true
                                                            );
                                                          } else {
                                                            if (
                                                              differenceInSeconds(
                                                                new Date(),
                                                                new Date(
                                                                  tournament.datetime_max_timechip
                                                                )
                                                              ) -
                                                                tournament.seconds_paused >
                                                              0
                                                            ) {
                                                              setTimerTimechip(
                                                                false
                                                              );
                                                            } else {
                                                              setTimerTimechip(
                                                                true
                                                              );
                                                            }
                                                          }

                                                          setIsOpen(true);
                                                        }
                                                      } else {
                                                        toast.warn(
                                                          "Inscrições finalizadas"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <MdAddCircle
                                                      color="#777"
                                                      size={25}
                                                    />
                                                  </button>
                                                )}
                                              </Draggable>
                                            )}
                                          </div>
                                        </Client>
                                      );
                                    }
                                  })}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        </div>
                      </Chair>
                    );
                  })}
                </div>
              </DragDropContext>
            </>
          )}
          <Modal
            title={id ? "Compra Cliente" : "Adicionar Cliente"}
            width={500}
            confirmLoading={isLoadingModal}
            open={isOpen}
            okText={`${id ? "COMPRAR" : "ADICIONAR"}`}
            cancelText="FECHAR"
            onOk={() => {
              addBuyTournament();
            }}
            onCancel={() => {
              setIsOpen(false);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginBottom: 25,
              }}
            >
              {!id && (
                <>
                  <ViewInput>
                    <p>Cliente</p>
                    <AutoComplete
                      style={{ width: "100%", fontSize: 14, textAlign: "left" }}
                      options={
                        id
                          ? []
                          : clients.filter((item) => {
                              return !item.chair;
                            })
                      }
                      value={client ? client.name : nameClient}
                      notFoundContent={<>Nenhum cliente encontrado</>}
                      onSelect={(text, client) => setClient(client)}
                      onSearch={(text) => {
                        if (client) {
                          if (text.toUpperCase() != client.name.toUpperCase()) {
                            setClient("");
                          }
                        }

                        setNameClient(text);
                        setClients(
                          clientsC.filter((item) => {
                            return (
                              String(item.name)
                                .toUpperCase()
                                .indexOf(text.toUpperCase()) != -1
                            );
                          })
                        );
                      }}
                      placeholder="procurar por nome"
                    />
                  </ViewInput>
                  <ViewInput>
                    <p>Mesa</p>
                    <Select
                      placeholder={"Selecione a mesa"}
                      value={chair || null}
                      style={{ width: "100%", fontSize: 14, textAlign: "left" }}
                      onChange={(text, chair) => {
                        setChair(chair.value);
                        setPositions(
                          chairs[chair.value - 1].chairs.filter((item) => {
                            return !item.name;
                          })
                        );
                      }}
                      options={chairsN}
                      notFoundContent={<>Nenhuma mesa encontrada</>}
                    />
                  </ViewInput>
                  <ViewInput>
                    <p>Posição</p>
                    <Select
                      disabled={!chair}
                      placeholder={"Selecione a posição"}
                      value={position || null}
                      style={{ width: "100%", fontSize: 14, textAlign: "left" }}
                      onChange={(text, position) => {
                        setPosition(position.value);
                      }}
                      options={positions}
                      notFoundContent={<>Nenhuma mesa encontrada</>}
                    />
                  </ViewInput>
                  <ViewInput style={{ textAlign: "left" }}>
                    <p>Timechip?</p>
                    <Switch
                      checked={timechip}
                      onChange={() => {
                        if (!timerTimechip) {
                          toast.warn("Rodada máxima do timechip ultrapassada");
                        } else {
                          setTimechip((timechip) => !timechip);
                        }
                      }}
                    />
                  </ViewInput>
                </>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  marginBottom: 25,
                }}
              >
                {tournament.purchases.some((item) => item.type == "entrie") &&
                  !id && (
                    <Payments>
                      <h4>Entrada</h4>
                      {tournament.purchases.map((purchase) => {
                        if (purchase.type == "entrie") {
                          return (
                            <Row>
                              <Button
                                onClick={() => {
                                  let isPurchase = purchases.some(
                                    (item) => item.id == purchase.id
                                  );
                                  if (isPurchase) {
                                    setPurchases(
                                      purchases.filter(
                                        (item) => item.id != purchase.id
                                      )
                                    );
                                    setValue(value - purchase.value);
                                  } else {
                                    setPurchases([
                                      ...purchases,
                                      {
                                        id: purchase.id,
                                        name: purchase.name,
                                        value: purchase.value,
                                        type: purchase.type,
                                        buy_staff: false,
                                        amount: 1,
                                      },
                                    ]);
                                    setValue(value + purchase.value);
                                  }
                                }}
                                type={
                                  purchases.some(
                                    (item) => item.id == purchase.id
                                  )
                                    ? "primary"
                                    : "default"
                                }
                                style={{ width: "100%" }}
                              >
                                {purchase.name}
                                {" " + getValue(purchase.value)}
                              </Button>
                              {purchase.is_staff && (
                                <div className="select" style={{ width: 160 }}>
                                  <p>
                                    Staff{" "}
                                    <strong>
                                      {getValue(purchase.value_staff)}
                                    </strong>
                                  </p>
                                  <Switch
                                    style={{
                                      width: 20,
                                      padding: 0,
                                      borderRadius: 15,
                                      marginBottom: 0,
                                      marginLeft: 5,
                                    }}
                                    disabled={
                                      !purchases.some(
                                        (item) => item.id == purchase.id
                                      )
                                    }
                                    checked={purchases.some(
                                      (item) =>
                                        item.id == purchase.id && item.buy_staff
                                    )}
                                    onChange={() => {
                                      const index = purchases.findIndex(
                                        (item) => item.id == purchase.id
                                      );
                                      let purchasesC = [...purchases];
                                      if (purchasesC[index].buy_staff) {
                                        purchasesC[index].buy_staff = false;
                                        setValue(value - purchase.value_staff);
                                      } else {
                                        purchasesC[index].buy_staff = true;
                                        setValue(value + purchase.value_staff);
                                      }
                                      setPurchases([...purchasesC]);
                                    }}
                                  />
                                </div>
                              )}
                            </Row>
                          );
                        }
                      })}
                    </Payments>
                  )}
                {tournament.purchases.some(
                  (item) => item.type == "purchase"
                ) && (
                  <Payments>
                    <h4>Compras</h4>
                    {tournament.purchases.map((purchase) => {
                      if (purchase.type == "purchase") {
                        return (
                          <Row>
                            <Button
                              onClick={() => {
                                let isPurchase = purchases.some(
                                  (item) => item.id == purchase.id
                                );
                                if (isPurchase) {
                                  setPurchases(
                                    purchases.filter(
                                      (item) => item.id != purchase.id
                                    )
                                  );
                                  setValue(value - purchase.value);
                                } else {
                                  setPurchases([
                                    ...purchases,
                                    {
                                      id: purchase.id,
                                      name: purchase.name,
                                      value: purchase.value,
                                      amount: 1,
                                    },
                                  ]);
                                  setValue(value + purchase.value);
                                }
                              }}
                              type={
                                purchases.some((item) => item.id == purchase.id)
                                  ? "primary"
                                  : "default"
                              }
                              style={{ width: "100%" }}
                            >
                              {purchase.name}
                              {" " + getValue(purchase.value)}
                            </Button>
                            {purchase.is_staff && (
                              <div className="select" style={{ width: 160 }}>
                                <p>
                                  Staff{"\n"}
                                  <strong>
                                    {getValue(purchase.value_staff)}
                                  </strong>
                                </p>
                                <Switch
                                  style={{
                                    width: 20,
                                    padding: 0,
                                    borderRadius: 15,
                                    height: 20,
                                    marginLeft: 5,
                                  }}
                                  disabled={
                                    !purchases.some(
                                      (item) => item.id == purchase.id
                                    )
                                  }
                                  checked={purchases.some(
                                    (item) =>
                                      item.id == purchase.id && item.buy_staff
                                  )}
                                  onChange={() => {
                                    const index = purchases.findIndex(
                                      (item) => item.id == purchase.id
                                    );
                                    let purchasesC = [...purchases];
                                    if (purchasesC[index].buy_staff) {
                                      purchasesC[index].buy_staff = false;
                                      setValue(value - purchase.value_staff);
                                    } else {
                                      purchasesC[index].buy_staff = true;
                                      setValue(value + purchase.value_staff);
                                    }
                                    setPurchases(purchasesC);
                                  }}
                                />
                              </div>
                            )}
                          </Row>
                        );
                      }
                    })}
                  </Payments>
                )}
                {tournament.purchases.some(
                  (item) => item.type == "service"
                ) && (
                  <Payments>
                    <h4>Serviços</h4>
                    {tournament.purchases.map((purchase) => {
                      if (purchase.type == "service") {
                        return (
                          <Row>
                            <Button
                              onClick={() => {
                                let isPurchase = purchases.some(
                                  (item) => item.id == purchase.id
                                );
                                if (isPurchase) {
                                  setPurchases(
                                    purchases.filter(
                                      (item) => item.id != purchase.id
                                    )
                                  );
                                  setValue(value - purchase.value);
                                } else {
                                  setPurchases([
                                    ...purchases,
                                    {
                                      id: purchase.id,
                                      name: purchase.name,
                                      value: purchase.value,
                                      amount: 1,
                                    },
                                  ]);
                                  setValue(value + purchase.value);
                                }
                              }}
                              type={
                                purchases.some((item) => item.id == purchase.id)
                                  ? "primary"
                                  : "default"
                              }
                              style={{ width: "100%" }}
                            >
                              {purchase.name}
                              {" " + getValue(purchase.value)}
                            </Button>
                          </Row>
                        );
                      }
                    })}
                  </Payments>
                )}

                <h3 style={{ marginTop: 12 }}>
                  Valor Total: {getValue(value)}
                </h3>
                <ViewInput style={{ textAlign: "left" }}>
                  <p>Métodos de pagamento</p>
                  <MethodsPayment
                    getMethods={getMethods}
                    operation="entrada"
                    receive={client.receive || 0}
                    methodsPayment={methods_transaction}
                    value={value}
                    onType={(index, item) => {
                      let methods_transactionC = [...methods_transaction];
                      if (
                        methods_transactionC.filter((data) => {
                          return data.id == item.id;
                        }).length
                      ) {
                        toast.warn("Método de pagamento já selecionado");
                      } else {
                        item.value = methods_transactionC[index].value;
                        methods_transactionC[index] = item;
                        setMethods_transaction(methods_transactionC);
                      }
                    }}
                    onValue={(index, value) => {
                      let methods_transactionC = [...methods_transaction];
                      methods_transactionC[index].value = value;
                      setMethods_transaction(methods_transactionC);
                    }}
                    addMethod={() => {
                      let methods_transactionC = [...methods_transaction];
                      methods_transactionC.push({
                        name: "",
                        value: 0,
                        percentage: 0,
                      });
                      setMethods_transaction(methods_transactionC);
                    }}
                    observation={observation}
                    onObservation={(text) => {
                      setObservation(text);
                    }}
                    datePayment={datePayment}
                    onDate={(date) => {
                      setDatePayment(date);
                    }}
                    removeMethod={(index) => {
                      setMethods_transaction(
                        methods_transaction.filter((data, i) => {
                          return i != index;
                        })
                      );
                    }}
                  />
                </ViewInput>
              </div>
            </div>
          </Modal>
          <Modal
            title={""}
            width={400}
            confirmLoading={isLoadingModal}
            open={isOpenClient}
            cancelButtonProps={{
              style: {
                display: "none",
              },
            }}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            onCancel={() => {
              setIsOpenClient(false);
            }}
          >
            <ClientChair>
              {client.chair && (
                <>
                  <div className="infos">
                    <span>Nome:</span>
                    <p>{client.name}</p>
                  </div>
                  <div className="infos">
                    <span>Crédito:</span>
                    <p>
                      {client.credit.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div className="infos">
                    <span>Valor à receber:</span>
                    <p style={{ color: "#1eb019" }}>
                      {client.receive.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div className="infos">
                    <span>Valor à pagar:</span>
                    <p style={{ color: "#d63211" }}>
                      {client.debt.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div className="infos">
                    <span>Saldo:</span>
                    <p
                      style={{
                        color:
                          client.debt == client.receive
                            ? "#000"
                            : client.debt > client.receive
                            ? "#d63211"
                            : "#1eb019",
                      }}
                    >
                      {(client.receive - client.debt).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div className="infos">
                    <span>Entrada:</span>
                    <p
                      style={{
                        color: client.client_tournaments[0].purchases.some(
                          (item) => item.type == "entrie"
                        )
                          ? "#1eb019"
                          : "#d63211",
                      }}
                    >
                      {client.client_tournaments[0].purchases.some(
                        (item) => item.type == "entrie"
                      )
                        ? client.client_tournaments[0].purchases
                            .filter((item) => item.type == "entrie")
                            .map((item, idx) =>
                              idx ? ", " + item.name : item.name
                            )
                        : "Nenhuma compra"}
                    </p>
                  </div>
                  <div className="infos">
                    <span>Compras:</span>
                    <p
                      style={{
                        color: client.client_tournaments[0].purchases.some(
                          (item) => item.type == "purchase"
                        )
                          ? "#1eb019"
                          : "#d63211",
                      }}
                    >
                      {client.client_tournaments[0].purchases.some(
                        (item) => item.type == "purchase"
                      )
                        ? client.client_tournaments[0].purchases
                            .filter((item) => item.type == "purchase")
                            .map((item, idx) =>
                              idx ? ", " + item.name : item.name
                            )
                        : "Nenhuma compra"}
                    </p>
                  </div>
                  <div className="infos">
                    <span>Serviços:</span>
                    <p
                      style={{
                        color: client.client_tournaments[0].purchases.some(
                          (item) => item.type == "service"
                        )
                          ? "#1eb019"
                          : "#d63211",
                      }}
                    >
                      {client.client_tournaments[0].purchases.some(
                        (item) => item.type == "service"
                      )
                        ? client.client_tournaments[0].purchases
                            .filter((item) => item.type == "service")
                            .map((item, idx) =>
                              idx ? ", " + item.name : item.name
                            )
                        : "Nenhuma compra"}
                    </p>
                  </div>
                </>
              )}

              <div className="actions">
                <button
                  onClick={() => {
                    navigate(`/client/${client.id}`);
                  }}
                >
                  <Tooltip title="Visualizar Cliente">
                    <MdAccountCircle
                      className="my-anchor-element"
                      color="#001B22"
                      size={22}
                    />
                  </Tooltip>
                </button>
                {(tournament.status == "inscricao" ||
                  tournament.status == "aberto") && (
                    <button
                      onClick={() => {
                        setValue(0);
                        setClient(client);
                        setId(client.id);
                        setChair(i + 1);
                        setPosition(p + 1);
                        setIsOpenClient(false);
                        setIsOpen(true);
                      }}
                    >
                      <Tooltip title="Compra Torneio">
                        <MdMonetizationOn color="#001B22" size={22} />
                      </Tooltip>
                    </button>
                  )}

                <button
                  onClick={() => {
                    setId(client.id);
                    setClient(client);
                    setChair("");
                    setPosition("");
                    setIsOpenClient(false);
                    setIsOpen(true);
                  }}
                >
                  <Tooltip title="Trocar de Posição">
                    <MdAutorenew color="#001B22" size={22} />
                  </Tooltip>
                </button>
                {(tournament.status == "aberto" ||
                  tournament.status == "inscricao") && (
                  <button
                    onClick={() => {
                      setIsOpenClient(false);
                      confirm({
                        title: "Deseja cancelar compras do jogador no Torneio?",
                        icon: <ExclamationCircleFilled />,
                        content: `Após essa ação, o jogador ${client.name} sairá do Torneio e todas as compras serão canceladas e estornadas.`,
                        onOk() {
                          canceledClient(client, i, p);
                        },
                        onCancel() {},
                        cancelText: "Cancelar",
                      });
                    }}
                    style={{
                      position: "absolute",
                      right: 35,
                      marginRight: 0,
                    }}
                  >
                    <Tooltip title="Cancelar Compras">
                      <MdCancel color="#001B22" size={22} />
                    </Tooltip>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsOpenClient(false);
                    const position = tournament.clients.filter(
                      (item) => item.exit == false
                    ).length;
                    if (award.length >= position) {
                      setPositionAward(position);
                      setValue(parseFloat(award[position - 1]));
                      setIsOpenAward(true);
                    } else {
                      confirm({
                        title: "Deseja eliminar o jogador do Torneio?",
                        icon: <ExclamationCircleFilled />,
                        content: `Após essa ação, o jogador ${client.name} sairá do Torneio.`,
                        onOk() {
                          exitChair(client, i, p);
                        },
                        onCancel() {},
                        cancelText: "Cancelar",
                      });
                    }
                  }}
                  style={{ position: "absolute", right: 0, marginRight: 0 }}
                >
                  <Tooltip title="Eliminar do Torneio">
                    <MdExitToApp color="#001B22" size={22} />
                  </Tooltip>
                </button>
              </div>
            </ClientChair>
          </Modal>
          <Modal
            title="Finalizar Inscrições"
            width={500}
            confirmLoading={isLoadingModal}
            open={isOpenFinishAdd}
            okText="FINALIZAR"
            cancelText="FECHAR"
            onOk={() => {
              finishAdd();
            }}
            onCancel={() => {
              setIsOpenFinishAdd(false);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginBottom: 25,
              }}
            >
              <span>
                Premiação Garantida {getValue(tournament.totalAward_guaranteed)}
              </span>
              <span>
                Premiação Acumulada{" "}
                {getValue(tournament.totalAward_accumulated)}
              </span>
              {!!tournament.vacancys.length && (
                <span>
                  Premiação em Vagas{" "}
                  {getValue(
                    tournament.vacancys.reduce(
                      (acumulador, item) => acumulador + item.value,
                      0
                    )
                  )}
                </span>
              )}
              {!!tournament.rankings.length && (
                <span>
                  Premiação Ranking{" "}
                  {getValue(
                    tournament.rankings.reduce(
                      (acumulador, item) => acumulador + item.value,
                      0
                    )
                  )}
                </span>
              )}
              <ViewInput style={{ marginTop: 10 }}>
                <p>Rake da casa</p>
                <IntlCurrencyInput
                  style={{
                    width: "100%",
                    backgroundColor: "#FFF",
                    borderWidth: 0,
                    color: "#001B22",
                    padding: "8px",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderStyle: "solid",
                    borderRadius: 2,
                    fontWeight: "400",
                    paddingLeft: 12,
                  }}
                  currency="BRL"
                  config={currencyConfig}
                  value={staff}
                  onChange={(event, value) => setStaff(value)}
                />
              </ViewInput>
              <span>
                Premiação Final{" "}
                {getValue(
                  tournament.totalAward_accumulated >
                    tournament.totalAward_guaranteed
                    ? tournament.totalAward_accumulated -
                        staff -
                        tournament.vacancys.reduce(
                          (acumulador, item) => acumulador + item.value,
                          0
                        ) -
                        tournament.rankings.reduce(
                          (acumulador, item) => acumulador + item.value,
                          0
                        )
                    : tournament.totalAward_guaranteed -
                        staff -
                        tournament.vacancys.reduce(
                          (acumulador, item) => acumulador + item.value,
                          0
                        ) -
                        tournament.rankings.reduce(
                          (acumulador, item) => acumulador + item.value,
                          0
                        )
                )}{" "}
                {award.length
                  ? `(Resta ${getValue(
                      tournament.totalAward_accumulated >
                        tournament.totalAward_guaranteed
                        ? tournament.totalAward_accumulated -
                            staff -
                            award.reduce((soma, i) => {
                              return soma + i;
                            }) -
                            tournament.vacancys.reduce(
                              (acumulador, item) => acumulador + item.value,
                              0
                            ) -
                            tournament.rankings.reduce(
                              (acumulador, item) => acumulador + item.value,
                              0
                            )
                        : tournament.totalAward_guaranteed -
                            staff -
                            award.reduce((soma, i) => {
                              return soma + i;
                            }) -
                            tournament.vacancys.reduce(
                              (acumulador, item) => acumulador + item.value,
                              0
                            ) -
                            tournament.rankings.reduce(
                              (acumulador, item) => acumulador + item.value,
                              0
                            )
                    )})`
                  : ""}
              </span>

              {award.length == 0 ? (
                <>
                  <ViewInput style={{ marginTop: 10 }}>
                    <p>Qt de Jogadores premiados</p>
                    <Input
                      placeholder="quantidade"
                      value={playresAward || ""}
                      type="number"
                      onChange={(event) =>
                        setPlayresAward(parseInt(event.target.value))
                      }
                    />
                  </ViewInput>
                  <Button
                    onClick={() => {
                      let awardC = [];
                      for (let i = 0; i < playresAward; i++) {
                        awardC.push(0);
                      }
                      setAward(awardC);
                    }}
                  >
                    Gerar
                  </Button>
                </>
              ) : (
                <>
                  <ViewAward>
                    {award.map((item, index) => {
                      return (
                        <div style={{ width: "45%" }}>
                          <span>{index + 1}</span>
                          <IntlCurrencyInput
                            style={{
                              width: "100%",
                              backgroundColor: "#FFF",
                              borderWidth: 0,
                              color: "#001B22",
                              padding: "6px 5px",
                              fontSize: 14,
                              borderWidth: 1,
                              borderColor: "#ccc",
                              borderStyle: "solid",
                              borderRadius: 2,
                              fontWeight: "400",
                              paddingLeft: 12,
                            }}
                            currency="BRL"
                            config={currencyConfig}
                            value={award[index]}
                            onChange={(event, value) => {
                              let awardC = [...award];
                              awardC[index] = value;
                              setAward(awardC);
                            }}
                          />
                        </div>
                      );
                    })}
                  </ViewAward>
                  <Button
                    onClick={() => {
                      setAward([]);
                    }}
                  >
                    Limpar
                  </Button>
                </>
              )}
            </div>
          </Modal>
          <Modal
            title="Confirmar Recompensa"
            width={500}
            confirmLoading={isLoadingModal}
            open={isOpenAward}
            okText="CONFIRMAR PAGAMENTO"
            cancelText="FECHAR"
            onOk={() => {
              exitChair(client, i, p);
            }}
            onCancel={() => {
              setIsOpenAward(false);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginBottom: 25,
              }}
            >
              <ViewInput>
                <h3>{`Deseja eliminar o jogador do Torneio na ${positionAward}° posição?`}</h3>
                <span>{`Após essa ação, o jogador ${
                  client.name
                } sairá do Torneio e receberá ${
                  positionAward != 0 && getValue(award[positionAward - 1])
                }`}</span>
                <p>Valor da Transação</p>
                <IntlCurrencyInput
                  disabled={true}
                  style={{
                    width: "100%",
                    backgroundColor: "#FFF",
                    borderWidth: 0,
                    color: "#001B22",
                    padding: "8px",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderStyle: "solid",
                    borderRadius: 2,
                    fontWeight: "400",
                    paddingLeft: 12,
                  }}
                  currency="BRL"
                  config={currencyConfig}
                  value={award[positionAward - 1]}
                />
              </ViewInput>
              <ViewInput style={{ textAlign: "left" }}>
                <p>Métodos de pagamento</p>
                <MethodsPayment
                  getMethods={getMethods}
                  operation="saida"
                  debt={client.debt || 0}
                  methodsPayment={methods_transaction}
                  value={value}
                  onType={(index, item) => {
                    let methods_transactionC = [...methods_transaction];
                    if (
                      methods_transactionC.filter((data) => {
                        return data.id == item.id;
                      }).length
                    ) {
                      toast.warn("Método de pagamento já selecionado");
                    } else {
                      item.value = methods_transactionC[index].value;
                      methods_transactionC[index] = item;
                      setMethods_transaction(methods_transactionC);
                    }
                  }}
                  onValue={(index, value) => {
                    let methods_transactionC = [...methods_transaction];
                    methods_transactionC[index].value = value;
                    setMethods_transaction(methods_transactionC);
                  }}
                  addMethod={() => {
                    let methods_transactionC = [...methods_transaction];
                    methods_transactionC.push({
                      name: "",
                      value: 0,
                      percentage: 0,
                    });
                    setMethods_transaction(methods_transactionC);
                  }}
                  observation={observation}
                  onObservation={(text) => {
                    setObservation(text);
                  }}
                  datePayment={datePayment}
                  onDate={(date) => {
                    setDatePayment(date);
                  }}
                  removeMethod={(index) => {
                    setMethods_transaction(
                      methods_transaction.filter((data, i) => {
                        return i != index;
                      })
                    );
                  }}
                />
              </ViewInput>
            </div>
          </Modal>
          <Modal
            title={"Enviar Vaga"}
            width={500}
            confirmLoading={isLoadingModal}
            open={visibleModalVacancy}
            okText={"CONFIRMAR"}
            cancelText="FECHAR"
            onOk={() => {
              sendVacancy();
            }}
            onCancel={() => {
              setVisibleModalVacancy(false);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginBottom: 25,
              }}
            >
              <ViewInput>
                <h3>{`Vaga no valor de ${getValue(vacancy.value || 0)}`}</h3>
                <span>{`Selecione o jogador para receber está vaga`}</span>
                <p>Cliente</p>
                <AutoComplete
                  style={{ width: "100%", fontSize: 14, textAlign: "left" }}
                  options={tournamentClients}
                  value={vacancyClient ? vacancyClient.label : nameClient}
                  notFoundContent={<>Nenhum cliente encontrado</>}
                  onSelect={(text, client) => setVacancyClient(client)}
                  onSearch={(text) => {
                    if (vacancyClient) {
                      if (
                        text.toUpperCase() != vacancyClient.label.toUpperCase()
                      ) {
                        setVacancyClient("");
                      }
                    }

                    setNameClient(text);
                    setTournamentClients(
                      tournamentClientsC.filter((item) => {
                        return (
                          String(item.label)
                            .toUpperCase()
                            .indexOf(text.toUpperCase()) != -1
                        );
                      })
                    );
                  }}
                  placeholder="procurar por nome"
                />
              </ViewInput>
            </div>
          </Modal>
        </>
      )}
      {isLoading && <Loader />}
      {/*
        
        
                          {tournament.is_rebuy ? (
                            <>
                              { tournament.enable_rebuy && (
                                <div className='amount'>
                                  <p>Rebuy</p>
                                  <span>{getValue(0)}</span>
                                  <div className='row' style={{opacity: rebuy + (rebuyDuplo * 2) + (rebuyTriplo * 3) >= tournament.max_rebuy ?  0.5 : 1}}>
                                    <button onClick={() => {
                                        if(rebuy + (rebuyDuplo * 2) + (rebuyTriplo * 3) + 1 <= tournament.max_rebuy){
                                          setRebuy(rebuy + 1)
                                          setValue(value +(tournament.rebuy_value + (rebuy_staff ? tournament.rebuy_value_staff : 0)))
                                        } else {
                                          toast.warn("Máximo de rebuys atingido")
                                        }
                                    }}><BiSolidPlusCircle /></button>
                                    <span>{rebuy}</span>
                                    <button onClick={() => {
                                      if(rebuy > 0){
                                        setRebuy(rebuy-1)
                                        setValue(value - (tournament.rebuy_value + (rebuy_staff ? tournament.rebuy_value_staff : 0)))
                                      }
                                    }}><BiSolidMinusCircle /></button>
                                  </div>
                                  { tournament.enable_rebuy_staff && (
                                    <div className='select' style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                      <span>Staff {getValue(0)}</span>
                                      <Switch style={{width: 15, padding: 0, borderRadius: 15, marginBottom: 0}} disabled={!rebuy} checked={rebuy_staff} onChange={() => {
                                          if(rebuy_staff){
                                            setValue(value-(tournament.rebuy_value_staff*rebuy))
                                          } else {
                                            setValue(value+(tournament.rebuy_value_staff*rebuy))
                                          }
                                          setRebuy_staff(!rebuy_staff)
                                        }} 
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                              { tournament.enable_rebuyDuplo && (
                                <div className='amount'>
                                  <p>Rebuy Duplo</p>
                                  <span>{getValue(0)}</span>
                                  <div className='row' style={{opacity: rebuy + (rebuyDuplo * 2) + (rebuyTriplo * 3) + 1 >= tournament.max_rebuy ?  0.5 : 1}}>
                                  <button onClick={() => {
                                    if(rebuy + (rebuyDuplo * 2) + (rebuyTriplo * 3) +2 <= tournament.max_rebuy){
                                          setRebuyDuplo(rebuyDuplo+1)
                                          setValue(value+(tournament.rebuyDuplo_value + (rebuyDuplo_staff ? tournament.rebuyDuplo_value_staff : 0)))
                                        }else {
                                          toast.warn("Máximo de rebuys atingido")
                                        }
                                    }}><BiSolidPlusCircle /></button>
                                    <span>{rebuyDuplo}</span>
                                  <button onClick={() => {
                                    if(rebuyDuplo > 0){
                                      setRebuyDuplo(rebuyDuplo-1)
                                      setValue(value-(tournament.rebuyDuplo_value + (rebuyDuplo_staff ? tournament.rebuyDuplo_value_staff : 0)))
                                    }
                                  }}><BiSolidMinusCircle /></button>
                                  </div>
                                  { tournament.enable_rebuyDuplo_staff && (
                                    <div className='select' style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                      <span>Staff {getValue(0)}</span>
                                      <Switch style={{width: 15, padding: 0, borderRadius: 15, marginBottom: 0}} disabled={!rebuyDuplo} checked={rebuyDuplo_staff} onChange={() => {
                                          if(rebuyDuplo_staff){
                                            setValue(value-(tournament.rebuyDuplo_value_staff*rebuyDuplo))
                                          } else {
                                            setValue(value+(tournament.rebuyDuplo_value_staff*rebuyDuplo))
                                          }
                                          setRebuyDuplo_staff(!rebuyDuplo_staff)
                                        }} 
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                              { tournament.enable_rebuyTriplo && (
                                <div className='amount' style={{opacity: rebuy + (rebuyDuplo * 2) + (rebuyTriplo * 3) + 2 >= tournament.max_rebuy ?  0.5 : 1}}>
                                  <p>Rebuy Triplo</p>
                                  <span>{getValue(0)}</span>
                                  <div className='row' >
                                  <button onClick={() => {
                                    if(rebuy + (rebuyDuplo * 2) + (rebuyTriplo * 3) + 3 <= tournament.max_rebuy){
                                          setRebuyTriplo(rebuyTriplo+1)
                                          setValue(value+(tournament.rebuyTriplo_value + (rebuyTriplo_staff ? tournament.rebuyTriplo_value_staff : 0)))
                                        }else {
                                          toast.warn("Máximo de rebuys atingido")
                                        }
                                    }}><BiSolidPlusCircle /></button>
                                    <span>{rebuyTriplo}</span>
                                  <button onClick={() => {
                                    if(rebuyTriplo > 0){
                                      setRebuyTriplo(rebuyTriplo-1)
                                      setValue(value-(tournament.rebuyTriplo_value + (rebuyTriplo_staff ? tournament.rebuyTriplo_value_staff : 0)))
                                    }
                                  }}><BiSolidMinusCircle /></button>
                                  </div>
                                  { tournament.enable_rebuyTriplo_staff && (
                                    <div className='select' style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                      <span>Staff {getValue(0)}</span>
                                      <Switch style={{width: 15, padding: 0, borderRadius: 15, marginBottom: 0}} disabled={!rebuyTriplo} checked={rebuyTriplo_staff} onChange={() => {
                                          if(rebuyTriplo_staff){
                                            setValue(value-(tournament.rebuyTriplo_value_staff*rebuyTriplo))
                                          } else {
                                            setValue(value+(tournament.rebuyTriplo_value_staff*rebuyTriplo))
                                          }
                                          setRebuyTriplo_staff(!rebuyTriplo_staff)
                                        }} 
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                              {(tournament.enable_rebuyDuplo || tournament.enable_rebuy || tournament.enable_rebuyTriplo) && (<p style={{ width: "100%", textAlign: "center" }}>{rebuy + (rebuyDuplo * 2) +  (rebuyTriplo * 3)}/{tournament.max_rebuy} máx rebuys</p>)}
                            </>
                            ): (
                                <>
                                  {tournament.enable_rebuy && (
                                    <Row>
                                      <Button style={{ width: "100%" }} onClick={() => {
                                          let valueUpdate = rebuy ?  value-tournament.rebuy_value :  value+tournament.rebuy_value
                                          valueUpdate =  rebuy ? valueUpdate - (rebuy_staff ? tournament.rebuy_value_staff : 0) : valueUpdate + (rebuy_staff ? tournament.rebuy_value_staff : 0)
                                          setValue(valueUpdate)
                                          setRebuy(rebuy ?  0 : 1)
                                          setRebuy_staff(false)
                                        }} type={rebuy == 1 ? 'primary' : "default"}>
                                        Reentrada{" " + getValue(0)}</Button>
                                        {tournament.enable_rebuy_staff && (
                                          <div className='select'>
                                            <p>Staff {getValue(0)}</p>
                                            <Switch style={{width: 20, padding: 0, borderRadius: 15, marginBottom: 0, marginLeft: 5}} disabled={!rebuy} checked={rebuy_staff} onChange={() => {
                                                if(rebuy_staff){
                                                  setValue(value-tournament.rebuy_value_staff)
                                                } else {
                                                  setValue(value+tournament.rebuy_value_staff)
                                                }
                                                setRebuy_staff(!rebuy_staff)
                                              }} 
                                          />
                                        </div>
                                      )}
                                    </Row>
                                  )}
                                  {tournament.enable_rebuyDuplo && (
                                    <Row>
                                      <Button style={{ width: "100%" }} onClick={() => {
                                            let valueUpdate = rebuyDuplo ?  value-tournament.rebuyDuplo_value :  value+tournament.rebuyDuplo_value
                                            valueUpdate =  rebuyDuplo ? valueUpdate - (rebuyDuplo_staff ? tournament.rebuyDuplo_value_staff : 0) : valueUpdate + (rebuyDuplo_staff ? tournament.rebuyDuplo_value_staff : 0)
                                            setValue(valueUpdate)
                                        setRebuyDuplo(rebuyDuplo ? 0 : 1)
                                        setRebuyDuplo_staff(false)
                                      }} type={rebuyDuplo == 1 ? 'primary' : "default"}>
                                      Reentrada Dupla{" " + getValue(tournament.rebuyDuplo_value)}</Button>
                                        {tournament.enable_rebuyDuplo_staff && (
                                          <div className='select'>
                                            <p>Staff {getValue(0)}</p>
                                            <Switch style={{width: 20, padding: 0, borderRadius: 15, marginBottom: 0, marginLeft: 5}} disabled={!rebuyDuplo} checked={rebuyDuplo_staff} onChange={() => {
                                                if(rebuyDuplo_staff){
                                                  setValue(value-tournament.rebuyDuplo_value_staff)
                                                } else {
                                                  setValue(value+tournament.rebuyDuplo_value_staff)
                                                }
                                                setRebuyDuplo_staff(!rebuyDuplo_staff)
                                              }} 
                                          />
                                        </div>
                                      )}
                                    </Row>
                                  )}
                                  {tournament.enable_rebuyTriplo && (
                                    <Row>
                                      <Button style={{ width: "100%" }} onClick={() => {
                                            let valueUpdate = rebuyTriplo ?  value-tournament.rebuyTriplo_value :  value+tournament.rebuyTriplo_value
                                            valueUpdate =  rebuyTriplo ? valueUpdate - (rebuyTriplo_staff ? tournament.rebuyTriplo_value_staff : 0) : valueUpdate + (rebuyTriplo_staff ? tournament.rebuyTriplo_value_staff : 0)
                                            setValue(valueUpdate)
                                        setRebuyTriplo(rebuyTriplo ? 0 : 1)
                                        setRebuyTriplo_staff(false)
                                      }} type={rebuyTriplo == 1 ? 'primary' : "default"}>
                                      Reentrada Tripla{" " + getValue(0)}</Button>
                                        {tournament.enable_rebuyTriplo_staff && (
                                          <div className='select'>
                                            <p>Staff {getValue(0)}</p>
                                            <Switch style={{width: 20, padding: 0, borderRadius: 15, marginBottom: 0, marginLeft: 5}} disabled={!rebuyTriplo} checked={rebuyTriplo_staff} onChange={() => {
                                                if(rebuyTriplo_staff){
                                                  setValue(value-tournament.rebuyTriplo_value_staff)
                                                } else {
                                                  setValue(value+tournament.rebuyTriplo_value_staff)
                                                }
                                                setRebuyTriplo_staff(!rebuyTriplo_staff)
                                              }} 
                                          />
                                        </div>
                                      )}
                                    </Row>
                                  )}
                                </>
                              )}
                        */}
    </Container>
  );
};

export default Tournament;
