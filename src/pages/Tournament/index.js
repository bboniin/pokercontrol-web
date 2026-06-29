import React, { useEffect, useRef, useState } from "react";
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
  MdVisibility,
  MdKeyboardReturn,
} from "react-icons/md";
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
  ViewAward,
  Table,
  Row,
  Transaction,
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
  Checkbox,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { getValue } from "../../services/functions";
import { differenceInSeconds, format } from "date-fns";
import IntlCurrencyInput from "react-intl-currency-input";
import MethodsPayment from "../../components/MethodsPayment";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import logo from "../../assets/logo.png";
import { useReactToPrint } from "react-to-print";
import { TablePrint } from "../ViewComanda/styles";

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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { tournament_id } = useParams();
  const [clients, setClients] = useState([]);
  const [clientsTournament, setClientsTournament] = useState([]);
  const [clientsTournamentWait, setClientsTournamentWait] = useState([]);
  const [clientsTournamentExit, setClientsTournamentExit] = useState([]);
  const [clientsC, setClientsC] = useState([]);
  const [clientsTournamentC, setClientsTournamentC] = useState([]);
  const [clientsAll, setClientsAll] = useState([]);
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
  const [awardEdit, setAwardEdit] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsCanceled, setTransactionsCanceled] = useState([]);
  const [command, setCommand] = useState({});
  const [methods_transaction, setMethods_transaction] = useState([]);
  const [playresAward, setPlayresAward] = useState("");
  const [staff, setStaff] = useState("");
  const [typeChair, setTypeChair] = useState("");
  const [observation, setObservation] = useState("");
  const [datePayment, setDatePayment] = useState(new Date());
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [timerTimechip, setTimerTimechip] = useState(false);
  const [isOpenFinishAdd, setIsOpenFinishAdd] = useState(false);
  const [isOpenClient, setIsOpenClient] = useState(false);
  const [visibleWait, setVisibleWait] = useState(false);
  const [visibleExit, setVisibleExit] = useState(false);
  const [isOpenPurchases, setIsOpenPurchases] = useState(false);
  const [purchasesModal, setPurchasesModal] = useState([]);
  const [isOpenNewPurchase, setIsOpenNewPurchase] = useState(false);
  const [namePurchase, setNamePurchase] = useState("");
  const [tokenPurchase, setTokenPurchase] = useState("");
  const [typePurchase, setTypePurchase] = useState("");
  const [valuePurchase, setValuePurchase] = useState(0);
  const [isStaff, setIsStaff] = useState(false);
  const [cashierPurchase, setCashierPurchase] = useState("");
  const [staffValue, setStaffValue] = useState(0);
  const [staffToken, setStaffToken] = useState(0);
  const [errorModal, setErrorModal] = useState(false);
  const [isOpenCanceled, setIsOpenCanceled] = useState(false);
  const [isOpenCommand, setIsOpenCommand] = useState(false);
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
    const interval = setInterval(() => {
      loadChairs();
      loadClients();
      setIsLoading(false);
    }, 30000);

    return () => clearInterval(interval);
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
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
              new Date(tournament.datetime_initial),
            )
          : differenceInSeconds(
              new Date(),
              new Date(tournament.datetime_initial),
            );
        timer -= tournament.seconds_paused + tournament.seconds_ajusted;
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
      (tournament.seconds_paused + tournament.seconds_ajusted);
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
            tournament.award
              .split("-")
              .map((item) => (item = parseFloat(item))),
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
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
          let clientsTournamentWait = [];
          let clientsTournamentExit = [];
          response.data.map((item) => {
            if (item.chair) {
              clientsTournament.push(item);
              item.chair = item.chair.replace("T", "");
              let [i, p] = item.chair.split("-");
              item.value = item.id;
              item.label = `${item.name} (Mesa ${i} - Posição ${p})`;
              chairs[i - 1].chairs[p - 1] = item;
            } else {
              if (!item.client_tournaments[0].exit) {
                clientsTournamentWait.push(item);
              } else {
                clientsTournamentExit.push(item);
              }
            }
          });
          setClientsTournament(clientsTournament);
          setClientsTournamentC(clientsTournament);
          setClientsTournamentWait(clientsTournamentWait);
          setClientsTournamentExit(clientsTournamentExit);
          setChairs([...chairs]);
        })
        .catch(({ response }) => {
          if (response) {
            if (response.data) {
              if (response.data.message) {
                toast.warn(response.data.message);
              } else {
                toast.error(
                  "Erro Interno. verifique sua conexão e tente novamente",
                );
              }
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
            );
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente");
        }
      });
  }

  async function loadTransactions() {
    await api
      .get(`/transactions/tournament/${tournament_id}?client_id=${client.id}`)
      .then((response) => {
        setTransactions(response.data);
        setTransactionsCanceled([]);
        setIsOpenCanceled(true);
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data) {
            if (response.data.message) {
              toast.warn(response.data.message);
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
            );
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente");
        }
      });
  }

  async function finishAdd() {
    setIsLoadingModal(true);
    if (awardEdit.length == 0 || awardEdit.some((item) => !item)) {
      toast.warning("Gere e preencha o modelo de recompensa");
    } else {
      let awardString = "";
      awardEdit.map((item) => {
        awardString = awardString + item + "-";
      });
      awardString = awardString.slice(0, -1);
      await api
        .put(`/end-register/${tournament.id}`, {
          award: awardString,
          staff: staff,
        })
        .then((response) => {
          loadChairs();
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
                  "Erro Interno. verifique sua conexão e tente novamente",
                );
              }
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
      if (!purchases.length) {
        toast.warn("Adicione pelo menos uma compra");
        setIsLoadingModal(false);
        return "";
      }
      if (!client || (typeChair == "mesa" && (!chair || !position))) {
        toast.warn(
          "Selecione o cliente, mesa e posição na mesa para adicionar ao Torneio",
        );
        setIsLoadingModal(false);
        return "";
      } else {
        if (
          client?.client_tournaments?.length == 0 &&
          !purchases.some((item) => item.type == "entrie")
        ) {
          toast.warn("Entrada é obrigátoria");
          setIsLoadingModal(false);
          return "";
        }
      }
    }

    let methods_transactionC = methods_transaction.filter(
      (item) => item.id != "Crédito",
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
        chair: chair && position ? `${chair}-${position}` : "",
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

        setCommand({
          purchases,
          staff: {
            value:
              purchases
                .filter((item) => item.buy_staff)
                .reduce((sum, item) => {
                  return sum + item.value_staff;
                }, 0) || 0,
            token:
              purchases
                .filter((item) => item.buy_staff)
                .reduce((sum, item) => {
                  return sum + item.token_staff;
                }, 0) || 0,
          },
          methods_transaction: methods_transactionC,
          client,
          chair:
            !chair || !position
              ? "Lista de espera"
              : `Mesa ${chair} Posição ${position}`,
        });
        loadClients();
        loadChairs();
        setIsOpen(false);
        setIsOpenCommand(true);
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data) {
            if (response.data.message) {
              toast.warn(response.data.message);
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
      (item) => item.id != "Crédito",
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
        setTournament(response.data);
        loadChairs();
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
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
            );
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente");
        }
      });
    setIsLoadingModal(false);
  }

  async function returnClient(client) {
    setIsLoadingModal(true);

    await api
      .put(`return-client`, {
        tournament_id: tournament.id,
        client_id: client.id,
      })
      .then((response) => {
        if (clientsTournamentExit.length == 1) {
          setVisibleExit(false);
        }
        toast.success(
          "Cliente retornou para lista de espera do Torneio com sucesso",
        );
        loadChairs();
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data) {
            if (response.data.message) {
              toast.warn(response.data.message);
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
            );
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente");
        }
      });
    setIsLoadingModal(false);
  }

  async function addPurchase() {
    if (
      !namePurchase ||
      !cashierPurchase ||
      (typePurchase != "service" && !tokenPurchase) ||
      (isStaff && !staffToken)
    ) {
      setErrorModal(true);
      toast.warn("Preencha todos os campos para salvar");
    } else {
      setIsLoadingModal(true);
      await api
        .post(`new-purchase/${tournament.id}`, {
          name: namePurchase,
          cashier: cashierPurchase,
          value: valuePurchase,
          type: typePurchase,
          token: parseInt(tokenPurchase),
          is_staff: isStaff,
          token_staff: staffToken,
          value_staff: staffValue,
        })
        .then((response) => {
          loadChairs();
          toast.success("Nova compra adicionada ao torneio com sucesso");
          setIsOpenNewPurchase(false);
        })
        .catch(({ response }) => {
          if (response) {
            if (response.data) {
              if (response.data.message) {
                toast.warn(response.data.message);
              } else {
                toast.error(
                  "Erro Interno. verifique sua conexão e tente novamente",
                );
              }
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
            );
          }
        });
      setIsLoadingModal(false);
    }
  }

  async function canceledClient(client, i, p) {
    setIsLoadingModal(true);
    let transactionsSend = transactionsCanceled.map((item) => item.id);
    await api
      .put(`canceled-client/${client.id}`, {
        tournament_id: tournament.id,
        transactions: transactionsSend,
      })
      .then((response) => {
        if (transactions.length == transactionsCanceled.length) {
          toast.success(
            "Cliente removido e todas compras canceladas com sucesso",
          );
        } else {
          toast.success(
            "Compras selecionadas foram canceladas excluidas com sucesso",
          );
        }
        loadChairs();
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data) {
            if (response.data.message) {
              toast.warn(response.data.message);
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
                  "Erro Interno. verifique sua conexão e tente novamente",
                );
              }
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
                      new Date(tournament.datetime_max_in),
                    ) -
                      (tournament.seconds_paused + tournament.seconds_ajusted) >
                      0 &&
                    tournament.status == "inscricao"
                  ) {
                    toast.warn("Inscrições finalizadas");
                  } else {
                    setId("");
                    setClient("");
                    setChair("");
                    setPosition("");
                    setTypeChair("");
                    setTimechip(false);
                    setValue(0);
                    setClients(clientsC);
                    if (tournament.status == "aberto") {
                      setTimerTimechip(true);
                    } else {
                      if (
                        differenceInSeconds(
                          new Date(),
                          new Date(tournament.datetime_max_timechip),
                        ) -
                          (tournament.seconds_paused +
                            tournament.seconds_ajusted) >
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
                if (tournament.award) {
                  setAwardEdit(
                    tournament.award
                      .split("-")
                      .map((item) => (item = parseFloat(item))),
                  );
                }
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
                  return (
                    <>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.name}: {getValue(item.value)} /{" "}
                        {item.type == "service"
                          ? "Serviço / "
                          : `${item.token} Fichas / `}
                        {
                          tournament?.clients_purchases.filter(
                            (data) =>
                              data.purchase_id == item.id &&
                              data.type != "staff",
                          ).length
                        }
                        x{"  "}
                        {!!tournament?.clients_purchases.filter(
                          (data) =>
                            data.purchase_id == item.id && data.type != "staff",
                        ).length && (
                          <MdVisibility
                            size={20}
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              setNamePurchase(item.name);
                              setValuePurchase(item.value);
                              setTokenPurchase(item.token);
                              setTypePurchase(item.type);
                              setClientsAll([
                                ...clientsTournamentC,
                                ...clientsTournamentWait,
                              ]);
                              setPurchasesModal(
                                tournament?.clients_purchases.filter(
                                  (data) =>
                                    data.purchase_id == item.id &&
                                    data.type != "staff",
                                ),
                              );
                              setIsOpenPurchases(true);
                            }}
                          />
                        )}
                      </p>
                      {item.is_staff && (
                        <p
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          Staff: {getValue(item.value_staff)} /{" "}
                          {item.token_staff} Fichas{" / "}
                          {
                            tournament?.clients_purchases.filter(
                              (data) =>
                                data.purchase_id == item.id &&
                                data.type == "staff",
                            ).length
                          }
                          x{"  "}
                          {!!tournament?.clients_purchases.filter(
                            (data) =>
                              data.purchase_id == item.id &&
                              data.type == "staff",
                          ).length && (
                            <MdVisibility
                              size={20}
                              style={{ marginLeft: 8 }}
                              onClick={() => {
                                setNamePurchase(item.name);
                                setValuePurchase(item.value);
                                setTokenPurchase(item.token);
                                setTypePurchase(item.type);
                                setClientsAll([
                                  ...clientsTournamentC,
                                  ...clientsTournamentWait,
                                ]);
                                setPurchasesModal(
                                  tournament?.clients_purchases.filter(
                                    (data) =>
                                      data.purchase_id == item.id &&
                                      data.type == "staff",
                                  ),
                                );
                                setIsOpenPurchases(true);
                              }}
                            />
                          )}
                        </p>
                      )}
                    </>
                  );
                })}
                {
                  <Button
                    type="primary"
                    onClick={() => {
                      setNamePurchase("");
                      setCashierPurchase("clube");
                      setValuePurchase("");
                      setTokenPurchase("");
                      setIsStaff(false);
                      setPosition(0);
                      setTypePurchase("");
                      setErrorModal(false);
                      setIsOpenNewPurchase(true);
                    }}
                    style={{
                      fontSize: 12,
                      height: 25,
                      justifySelf: "center",
                    }}
                  >
                    <span>Nova Compra</span>
                  </Button>
                }
              </div>
              {(tournament.status == "inscricao" ||
                tournament.status == "final") && (
                <div className="infos">
                  {!!tournament.totalAward_guaranteed && (
                    <p>
                      Premiação Garantida:{" "}
                      {getValue(tournament.totalAward_guaranteed)}
                    </p>
                  )}
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
                      "dd/MM/yyyy HH:mm",
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
                      "dd/MM/yyyy HH:mm:ss",
                    )}
                  </p>
                </div>
              )}

              {tournament.status == "encerrado" && (
                <div className="infos">
                  {!!tournament.totalAward_guaranteed && (
                    <p>
                      Premiação Garantida:{" "}
                      {getValue(tournament.totalAward_guaranteed)}
                    </p>
                  )}
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
                          0,
                        ),
                      )}
                    </p>
                  )}
                  {!!tournament.rankings.length && (
                    <p>
                      Premiação Ranking{" "}
                      {getValue(
                        tournament.rankings.reduce((acumulador, item) => {
                          if (item.type == "value") {
                            return acumulador + item.value;
                          } else {
                            return (
                              acumulador +
                              tournament.totalAward_accumulated *
                                (item.percentage / 100)
                            );
                          }
                        }, 0),
                      )}
                    </p>
                  )}
                  <p>
                    Premiação Entregue:{" "}
                    {getValue(
                      tournament.totalAward_guaranteed >
                        tournament.totalAward_accumulated - tournament.staff
                        ? tournament.totalAward_guaranteed
                        : tournament.totalAward_accumulated - tournament.staff,
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
                              "Erro Interno. verifique sua conexão e tente novamente",
                            );
                          }
                        } else {
                          toast.error(
                            "Erro Interno. verifique sua conexão e tente novamente",
                          );
                        }
                      } else {
                        toast.error(
                          "Erro Interno. verifique sua conexão e tente novamente",
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
                              "Erro Interno. verifique sua conexão e tente novamente",
                            );
                          }
                        } else {
                          toast.error(
                            "Erro Interno. verifique sua conexão e tente novamente",
                          );
                        }
                      } else {
                        toast.error(
                          "Erro Interno. verifique sua conexão e tente novamente",
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
                  setAwardEdit(awardC);

                  setStaff(0);
                  setPlayresAward(0);
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
                              "Erro Interno. verifique sua conexão e tente novamente",
                            );
                          }
                        } else {
                          toast.error(
                            "Erro Interno. verifique sua conexão e tente novamente",
                          );
                        }
                      } else {
                        toast.error(
                          "Erro Interno. verifique sua conexão e tente novamente",
                        );
                      }
                    });
                }}
              >
                <span>Finalizar Torneio</span>
              </Button>
            )}
          </InfosTournament>
          <div
            style={{
              display: "flex",
              marginBottom: 25,
              alignItems: "flex-end",
            }}
          >
            {tournament.status != "encerrado" &&
              tournament.status != "criado" && (
                <ViewInput
                  style={{ maxWidth: 400, marginRight: 25, marginBottom: 0 }}
                >
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
                      setSearchClient(text);
                      setClientsTournament(
                        clientsTournamentC.filter((item) => {
                          return (
                            String(item.label)
                              .toUpperCase()
                              .indexOf(text.toUpperCase()) != -1
                          );
                        }),
                      );
                    }}
                    placeholder="procurar por nome"
                  />
                </ViewInput>
              )}

            {!!clientsTournamentWait.length && (
              <Button
                type={visibleWait && "primary"}
                onClick={() => {
                  setVisibleWait(!visibleWait);
                }}
              >
                Visualizar Lista de Espera ({clientsTournamentWait.length})
              </Button>
            )}
            {!!clientsTournamentExit.length && (
              <Button
                type={"primary"}
                onClick={() => {
                  setVisibleExit(true);
                }}
              >
                Jogadores Eliminados
              </Button>
            )}
          </div>
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
                            "dd/MM/yyyy HH:mm:ss",
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
                        <td>Eliminação</td>
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

                  if (finalPosition == 9999) {
                    toast.warn("Não é possivel mover para fila de espera");
                    return;
                  }

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
                              "Erro Interno. verifique sua conexão e tente novamente",
                            );
                          }
                        } else {
                          toast.error(
                            "Erro Interno. verifique sua conexão e tente novamente",
                          );
                        }
                      } else {
                        toast.error(
                          "Erro Interno. verifique sua conexão e tente novamente",
                        );
                      }
                    });
                }}
              >
                <div className="drop-container">
                  {visibleWait && !!clientsTournamentWait.length && (
                    <Chair
                      style={{
                        maxHeight: "auto",
                        minHeight: "80px",
                        height: "auto",
                      }}
                    >
                      <h2>Lista de Espera</h2>

                      <div className="row">
                        <div className="column-drop" style={{ width: "100%" }}>
                          <Droppable droppableId={"droppable-" + "1-" + 999}>
                            {(provided, snapshot) => (
                              <div
                                className="column"
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  justifyContent: "flex-start",
                                  width: "100%",
                                }}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                {clientsTournamentWait.map((chair, p) => {
                                  return (
                                    <Client
                                      style={{
                                        borderBottomWidth:
                                          p <
                                          clientsTournamentWait.length -
                                            (clientsTournamentWait.length %
                                              2 ===
                                            0
                                              ? 2
                                              : 1)
                                            ? 1
                                            : 0,
                                        borderLeftWidth: p % 2 == 1 ? 1 : 0,
                                        minWidth: "50%",
                                        flex: 1,
                                      }}
                                    >
                                      <h2>P{p + 1}:</h2>
                                      <div>
                                        <Draggable
                                          key={chair.id}
                                          draggableId={chair.id}
                                          index={9999}
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
                                                      ? provided.draggableProps
                                                          .style
                                                      : {},
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
                                      </div>
                                    </Client>
                                  );
                                })}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    </Chair>
                  )}
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
                                                            : {},
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
                                                              tournament.datetime_max_in,
                                                            ),
                                                          ) -
                                                            (tournament.seconds_paused +
                                                              tournament.seconds_ajusted) >
                                                            0 &&
                                                          tournament.status ==
                                                            "inscricao"
                                                        ) {
                                                          toast.warn(
                                                            "Inscrições finalizadas",
                                                          );
                                                        } else {
                                                          setClient("");
                                                          setId("");
                                                          setChair(i + 1);
                                                          setPosition(p + 1);
                                                          setTimechip(false);
                                                          setClients(clientsC);
                                                          setTypeChair("mesa");
                                                          setValue(0);
                                                          if (
                                                            tournament.status ==
                                                            "aberto"
                                                          ) {
                                                            setTimerTimechip(
                                                              true,
                                                            );
                                                          } else {
                                                            if (
                                                              differenceInSeconds(
                                                                new Date(),
                                                                new Date(
                                                                  tournament.datetime_max_timechip,
                                                                ),
                                                              ) -
                                                                (tournament.seconds_paused +
                                                                  tournament.seconds_ajusted) >
                                                              0
                                                            ) {
                                                              setTimerTimechip(
                                                                false,
                                                              );
                                                            } else {
                                                              setTimerTimechip(
                                                                true,
                                                              );
                                                            }
                                                          }

                                                          setIsOpen(true);
                                                        }
                                                      } else {
                                                        toast.warn(
                                                          "Inscrições finalizadas",
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
                                                          : {},
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
                                                              tournament.datetime_max_in,
                                                            ),
                                                          ) -
                                                            (tournament.seconds_paused +
                                                              tournament.seconds_ajusted) >
                                                            0 &&
                                                          tournament.status ==
                                                            "inscricao"
                                                        ) {
                                                          toast.warn(
                                                            "Inscrições finalizadas",
                                                          );
                                                        } else {
                                                          setClient("");
                                                          setId("");
                                                          setChair(i + 1);
                                                          setPosition(p + 1);
                                                          setTimechip(false);
                                                          setClients(clientsC);
                                                          setValue(0);

                                                          if (
                                                            tournament.status ==
                                                            "aberto"
                                                          ) {
                                                            setTimerTimechip(
                                                              true,
                                                            );
                                                          } else {
                                                            if (
                                                              differenceInSeconds(
                                                                new Date(),
                                                                new Date(
                                                                  tournament.datetime_max_timechip,
                                                                ),
                                                              ) -
                                                                (tournament.seconds_paused +
                                                                  tournament.seconds_ajusted) >
                                                              0
                                                            ) {
                                                              setTimerTimechip(
                                                                false,
                                                              );
                                                            } else {
                                                              setTimerTimechip(
                                                                true,
                                                              );
                                                            }
                                                          }

                                                          setIsOpen(true);
                                                        }
                                                      } else {
                                                        toast.warn(
                                                          "Inscrições finalizadas",
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
                          }),
                        );
                      }}
                      placeholder="procurar por nome"
                    />
                  </ViewInput>
                  <ViewInput>
                    <p>Em mesa ou Lista de Espera?*</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        style={{
                          width: "49%",
                        }}
                        type={typeChair == "mesa" && "primary"}
                        onClick={() => {
                          setTypeChair("mesa");

                          const mesaDisponivel = chairs.findIndex((mesa) => {
                            const ocupadas = mesa.chairs.filter(
                              (pos) => !!pos.name,
                            ).length;
                            return ocupadas < 7;
                          });
                          setChair(mesaDisponivel + 1);
                          let positions = chairs[mesaDisponivel].chairs.filter(
                            (item) => {
                              return !item.name;
                            },
                          );

                          setPositions(positions);
                          setPosition(positions[0].value || "");
                        }}
                      >
                        Em Mesa
                      </Button>
                      <Button
                        style={{
                          width: "49%",
                        }}
                        type={typeChair == "espera" && "primary"}
                        onClick={() => {
                          setTypeChair("espera");
                        }}
                      >
                        Lista de Espera
                      </Button>
                    </div>
                  </ViewInput>
                  {typeChair == "mesa" && (
                    <>
                      <ViewInput>
                        <p>Mesa</p>
                        <Select
                          placeholder={"Selecione a mesa"}
                          value={chair || null}
                          style={{
                            width: "100%",
                            fontSize: 14,
                            textAlign: "left",
                          }}
                          onChange={(text, chair) => {
                            setChair(chair.value);
                            setPositions(
                              chairs[chair.value - 1].chairs.filter((item) => {
                                return !item.name;
                              }),
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
                          style={{
                            width: "100%",
                            fontSize: 14,
                            textAlign: "left",
                          }}
                          onChange={(text, position) => {
                            setPosition(position.value);
                          }}
                          options={positions}
                          notFoundContent={<>Nenhuma mesa encontrada</>}
                        />
                      </ViewInput>
                    </>
                  )}
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
                                    (item) => item.id == purchase.id,
                                  );
                                  if (isPurchase) {
                                    setPurchases(
                                      purchases.filter(
                                        (item) => item.id != purchase.id,
                                      ),
                                    );
                                    setValue(value - purchase.value);
                                  } else {
                                    setPurchases([
                                      ...purchases,
                                      {
                                        id: purchase.id,
                                        name: purchase.name,
                                        value: purchase.value,
                                        value_staff: purchase.value_staff,
                                        token_staff: purchase.token_staff,
                                        token: purchase.token,
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
                                    (item) => item.id == purchase.id,
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
                                        (item) => item.id == purchase.id,
                                      )
                                    }
                                    checked={purchases.some(
                                      (item) =>
                                        item.id == purchase.id &&
                                        item.buy_staff,
                                    )}
                                    onChange={() => {
                                      const index = purchases.findIndex(
                                        (item) => item.id == purchase.id,
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
                  (item) => item.type == "purchase",
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
                                  (item) => item.id == purchase.id,
                                );
                                if (isPurchase) {
                                  setPurchases(
                                    purchases.filter(
                                      (item) => item.id != purchase.id,
                                    ),
                                  );
                                  setValue(value - purchase.value);
                                } else {
                                  setPurchases([
                                    ...purchases,
                                    {
                                      id: purchase.id,
                                      name: purchase.name,
                                      value: purchase.value,
                                      value_staff: purchase.value_staff,
                                      token_staff: purchase.token_staff,
                                      token: purchase.token,
                                      type: purchase.type,
                                      buy_staff: false,
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
                                      (item) => item.id == purchase.id,
                                    )
                                  }
                                  checked={purchases.some(
                                    (item) =>
                                      item.id == purchase.id && item.buy_staff,
                                  )}
                                  onChange={() => {
                                    const index = purchases.findIndex(
                                      (item) => item.id == purchase.id,
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
                  (item) => item.type == "service",
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
                                  (item) => item.id == purchase.id,
                                );
                                if (isPurchase) {
                                  setPurchases(
                                    purchases.filter(
                                      (item) => item.id != purchase.id,
                                    ),
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
                        }),
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
              {!!client && (
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
                        color: client.client_tournaments[0]?.purchases.some(
                          (item) => item.type == "entrie",
                        )
                          ? "#1eb019"
                          : "#d63211",
                      }}
                    >
                      {client.client_tournaments[0]?.purchases.some(
                        (item) => item.type === "entrie",
                      )
                        ? Object.entries(
                            client.client_tournaments[0]?.purchases
                              .filter((item) => item.type === "entrie")
                              .reduce((acc, item) => {
                                acc[item.name] = (acc[item.name] || 0) + 1;
                                return acc;
                              }, {}),
                          ).map(
                            ([name, count], idx) =>
                              `${idx ? ", " : ""}${name} x${count}`,
                          )
                        : "Nenhuma compra"}
                    </p>
                  </div>
                  <div className="infos">
                    <span>Compras:</span>
                    <p
                      style={{
                        color: client.client_tournaments[0]?.purchases.some(
                          (item) => item.type == "purchase",
                        )
                          ? "#1eb019"
                          : "#d63211",
                      }}
                    >
                      {client.client_tournaments[0]?.purchases.some(
                        (item) => item.type === "purchase",
                      )
                        ? Object.entries(
                            client.client_tournaments[0]?.purchases
                              .filter((item) => item.type === "purchase")
                              .reduce((acc, item) => {
                                acc[item.name] = (acc[item.name] || 0) + 1;
                                return acc;
                              }, {}),
                          ).map(
                            ([name, count], idx) =>
                              `${idx ? ", " : ""}${name} x${count}`,
                          )
                        : "Nenhuma compra"}
                    </p>
                  </div>
                  <div className="infos">
                    <span>Serviços:</span>
                    <p
                      style={{
                        color: client.client_tournaments[0]?.purchases.some(
                          (item) => item.type == "service",
                        )
                          ? "#1eb019"
                          : "#d63211",
                      }}
                    >
                      {client.client_tournaments[0]?.purchases.some(
                        (item) => item.type === "service",
                      )
                        ? Object.entries(
                            client.client_tournaments[0]?.purchases
                              .filter((item) => item.type === "service")
                              .reduce((acc, item) => {
                                acc[item.name] = (acc[item.name] || 0) + 1;
                                return acc;
                              }, {}),
                          ).map(
                            ([name, count], idx) =>
                              `${idx ? ", " : ""}${name} x${count}`,
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
                {(tournament.status == "aberto" ||
                  tournament.status == "inscricao") && (
                  <button
                    onClick={() => {
                      setIsOpenClient(false);
                      loadTransactions();
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
                      (item) => item.exit == false,
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
              {!!tournament.totalAward_guaranteed && (
                <span>
                  Premiação Garantida{" "}
                  {getValue(tournament.totalAward_guaranteed)}
                </span>
              )}
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
                      0,
                    ),
                  )}
                </span>
              )}
              {!!tournament.rankings.length && (
                <span>
                  Premiação Ranking{" "}
                  {getValue(
                    tournament.rankings.reduce((acumulador, item) => {
                      if (item.type == "value") {
                        return acumulador + item.value;
                      } else {
                        return (
                          acumulador +
                          tournament.totalAward_accumulated *
                            (item.percentage / 100)
                        );
                      }
                    }, 0),
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
                          0,
                        ) -
                        tournament.rankings.reduce((acumulador, item) => {
                          if (item.type == "value") {
                            return acumulador + item.value;
                          } else {
                            return (
                              acumulador +
                              tournament.totalAward_accumulated *
                                (item.percentage / 100)
                            );
                          }
                        }, 0)
                    : tournament.totalAward_guaranteed -
                        staff -
                        tournament.vacancys.reduce(
                          (acumulador, item) => acumulador + item.value,
                          0,
                        ) -
                        tournament.rankings.reduce((acumulador, item) => {
                          if (item.type == "value") {
                            return acumulador + item.value;
                          } else {
                            return (
                              acumulador +
                              tournament.totalAward_accumulated *
                                (item.percentage / 100)
                            );
                          }
                        }, 0),
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
                              0,
                            ) -
                            tournament.rankings.reduce((acumulador, item) => {
                              if (item.type == "value") {
                                return acumulador + item.value;
                              } else {
                                return (
                                  acumulador +
                                  tournament.totalAward_accumulated *
                                    (item.percentage / 100)
                                );
                              }
                            }, 0)
                        : tournament.totalAward_guaranteed -
                            staff -
                            award.reduce((soma, i) => {
                              return soma + i;
                            }) -
                            tournament.vacancys.reduce(
                              (acumulador, item) => acumulador + item.value,
                              0,
                            ) -
                            tournament.rankings.reduce((acumulador, item) => {
                              if (item.type == "value") {
                                return acumulador + item.value;
                              } else {
                                return (
                                  acumulador +
                                  tournament.totalAward_accumulated *
                                    (item.percentage / 100)
                                );
                              }
                            }, 0),
                    )})`
                  : ""}
              </span>

              {awardEdit.length == 0 ? (
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
                      setAwardEdit(awardC);
                    }}
                  >
                    Gerar
                  </Button>
                </>
              ) : (
                <>
                  <ViewAward>
                    {awardEdit.map((item, index) => {
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
                            value={awardEdit[index]}
                            onChange={(event, value) => {
                              let awardC = [...awardEdit];
                              awardC[index] = value;
                              setAwardEdit(awardC);
                            }}
                          />
                        </div>
                      );
                    })}
                  </ViewAward>
                  <Button
                    onClick={() => {
                      setAwardEdit([]);
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
                      }),
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
                      }),
                    );
                  }}
                  placeholder="procurar por nome"
                />
              </ViewInput>
            </div>
          </Modal>
          <Modal
            title="Nova Compra"
            width={500}
            open={isOpenNewPurchase}
            okText={"ADICIONAR"}
            cancelText="FECHAR"
            onOk={() => {
              addPurchase();
            }}
            onCancel={() => {
              setIsOpenNewPurchase(false);
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
                <p>Nome</p>
                <Input
                  placeholder="nome"
                  status={errorModal && !namePurchase && "error"}
                  value={namePurchase}
                  onChange={(event) => setNamePurchase(event.target.value)}
                />
              </ViewInput>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <ViewInput style={{ width: "49%" }}>
                  <p>Tipo de Compra</p>
                  <Select
                    value={typePurchase || null}
                    placeholder="tipo"
                    status={errorModal && !typePurchase && "error"}
                    dropdownStyle={{ color: "#000" }}
                    style={{
                      width: "100%",
                      fontSize: 14,
                    }}
                    onChange={(text) => {
                      setTypePurchase(text);
                      if (text != "service") {
                        setCashierPurchase("clube");
                      }
                    }}
                    options={[
                      {
                        value: "purchase",
                        label: "Compra",
                      },
                      {
                        value: "entrie",
                        label: "Entrada",
                      },
                      {
                        value: "service",
                        label: "Serviço",
                      },
                    ]}
                  />
                </ViewInput>
                <ViewInput style={{ width: "49%" }}>
                  <p>Caixa</p>
                  <Select
                    value={cashierPurchase || null}
                    placeholder="caixa"
                    status={errorModal && !cashierPurchase && "error"}
                    dropdownStyle={{ color: "#000" }}
                    style={{
                      width: "100%",
                      fontSize: 14,
                    }}
                    onChange={(text) => {
                      setCashierPurchase(text);
                    }}
                    disabled={typePurchase != "service"}
                    options={
                      typePurchase == "service"
                        ? [
                            {
                              value: "dealer",
                              label: "Dealer",
                            },
                            {
                              value: "passport",
                              label: "Passaporte",
                            },
                            {
                              value: "jackpot",
                              label: "Jackpot",
                            },
                            {
                              value: "clube",
                              label: "Clube",
                            },
                          ]
                        : [
                            {
                              value: "clube",
                              label: "Clube",
                            },
                          ]
                    }
                  />
                </ViewInput>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                {typePurchase != "service" && (
                  <ViewInput style={{ width: "49%" }}>
                    <p>Fichas</p>
                    <Input
                      placeholder="quantidade"
                      status={errorModal && !tokenPurchase && "error"}
                      value={tokenPurchase || ""}
                      type="number"
                      onChange={(event) =>
                        setTokenPurchase(parseInt(event.target.value))
                      }
                    />
                  </ViewInput>
                )}
                <ViewInput
                  style={{ width: typePurchase != "service" ? "49%" : "100%" }}
                >
                  <p>Valor</p>
                  <IntlCurrencyInput
                    style={{
                      width: "100%",
                      backgroundColor: "#FFF",
                      borderWidth: 0,
                      color: "#001B22",
                      padding: "8px",
                      fontSize: 14,
                      height: 32,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderStyle: "solid",
                      borderRadius: 2,
                      fontWeight: "400",
                      paddingLeft: 12,
                    }}
                    currency="BRL"
                    config={currencyConfig}
                    value={valuePurchase}
                    onChange={(event, value) => setValuePurchase(value)}
                  />
                </ViewInput>
              </div>
              {typePurchase != "service" && (
                <ViewInput style={{ width: "100%", maxWidth: 60 }}>
                  <p>Staff?</p>
                  <Switch
                    style={{
                      minWidth: 20,
                      padding: 0,
                      borderRadius: 15,
                      marginTop: 5,
                    }}
                    checked={isStaff}
                    onChange={() => {
                      setIsStaff(!isStaff);
                      setStaffToken("");
                      setStaffValue("");
                    }}
                  />
                </ViewInput>
              )}
              {typePurchase != "service" && isStaff && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <ViewInput style={{ width: "49%" }}>
                      <p>Staff Fichas</p>
                      <Input
                        placeholder="quantidade"
                        status={errorModal && !staffToken && "error"}
                        value={staffToken || ""}
                        type="number"
                        onChange={(event) =>
                          setStaffToken(parseInt(event.target.value))
                        }
                      />
                    </ViewInput>
                    <ViewInput style={{ width: "49%" }}>
                      <p>Staff Valor</p>
                      <IntlCurrencyInput
                        style={{
                          width: "100%",
                          backgroundColor: "#FFF",
                          borderWidth: 0,
                          color: "#001B22",
                          padding: "8px",
                          fontSize: 14,
                          height: 32,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderStyle: "solid",
                          borderRadius: 2,
                          fontWeight: "400",
                          paddingLeft: 12,
                        }}
                        currency="BRL"
                        config={currencyConfig}
                        value={staffValue}
                        onChange={(event, value) => setStaffValue(value)}
                      />
                    </ViewInput>
                  </div>
                </>
              )}
            </div>
          </Modal>
          <Modal
            title="Imprimir Comanda"
            width={320}
            open={isOpenCommand}
            cancelText="FECHAR"
            okText="IMPRIMIR"
            maskClosable={false}
            onOk={() => {
              handlePrint();
            }}
            onCancel={() => {
              setIsOpenCommand(false);
            }}
          >
            <div
              ref={componentRef}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "center",
                marginBottom: 25,
                fontWeight: "bold",
                padding: "20px 15px",
              }}
            >
              <h3 style={{ width: "100%", textAlign: "center", fontSize: 18 }}>
                {tournament.name}
              </h3>
              <img src={logo} alt="" style={{ width: 150, marginBottom: 25 }} />
              <p style={{ width: "100%" }}>Cliente: {command?.client?.name}</p>
              <p style={{ width: "100%", lineHeight: 2 }}>{command?.chair}</p>
              <TablePrint>
                <thead>
                  <tr>
                    <td style={{ flex: 1 }}>Compra</td>
                    <td style={{ textAlign: "center", width: 80 }}>Fichas</td>
                    <td style={{ textAlign: "center", width: 80 }}>Valor</td>
                  </tr>
                </thead>
                <tbody>
                  {command?.purchases?.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td style={{ textAlign: "center" }}>
                        {product.token
                          ? (product.token / 1000)
                              .toFixed(1)
                              .replace(".0", "") + "K"
                          : "--"}
                      </td>
                      <td style={{ textAlign: "center", width: 80 }}>
                        {product.value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  ))}
                  {!!command?.staff?.value && (
                    <tr key={"staff"}>
                      <td>Staff</td>
                      <td style={{ textAlign: "center", width: 80 }}>
                        {command?.staff?.token
                          ? (command?.staff?.token / 1000)
                              .toFixed(1)
                              .replace(".0", "") + "K"
                          : "--"}
                      </td>
                      <td style={{ textAlign: "center", width: 80 }}>
                        {command?.staff?.value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  )}
                </tbody>
              </TablePrint>

              {command?.methods_transaction?.map((item) => {
                return (
                  <p style={{ width: "100%", marginTop: 10 }}>
                    {item.name}:{" "}
                    {(item.value || 0).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                );
              })}
              <h3 style={{ width: "100%", marginTop: 10 }}>
                Total:{" "}
                {(
                  command?.purchases?.reduce((sum, item) => {
                    return sum + item.value * item.amount;
                  }, 0) ||
                  0 + command?.staff ||
                  0
                ).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </div>
          </Modal>
          <Modal
            title="Cancelar Compras"
            width={500}
            confirmLoading={isLoadingModal}
            open={isOpenCanceled}
            okText="CONFIRMAR"
            cancelText="FECHAR"
            onOk={() => {
              setIsOpenCanceled(false);
              confirm({
                title:
                  "Deseja cancelar compras selecionadas do jogador no Torneio?",
                icon: <ExclamationCircleFilled />,
                content: `Após essa ação, o jogador ${client.name} todas as compras selecionadas serão canceladas e estornadas.`,
                onOk() {
                  canceledClient(client, i, p);
                },
                onCancel() {},
                cancelText: "Cancelar",
              });
            }}
            onCancel={() => {
              setIsOpenCanceled(false);
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
              <p>
                Total de {transactions.length} compras realizadas, selecione
                quais deseja cancelar
              </p>
              {transactions?.length != 0 && (
                <Transaction style={{ marginTop: 10 }}>
                  <p>Tipo</p>
                  <p>Valor</p>
                  <p>Status</p>
                  <p>Data</p>
                  <p style={{ maxWidth: 50, fontSize: 10 }}>Cancelar?</p>
                </Transaction>
              )}
              {transactions.map((transaction) => (
                <Transaction key={transaction.id}>
                  <p>
                    {transaction.items_transaction.map((item, index) => {
                      return index == 0
                        ? item.name || ""
                        : item.name
                          ? " , " + item.name
                          : "";
                    })}
                  </p>
                  <p
                    style={{
                      color:
                        transaction.operation != "entrada"
                          ? "#d63211"
                          : "#1eb019",
                    }}
                  >
                    {transaction.value.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    {transaction.paid
                      ? "Pago"
                      : transaction.value_paid
                        ? `Falta pagar ${getValue(
                            transaction.value - transaction.value_paid,
                          )}`
                        : "Não Pago"}
                  </p>
                  <p style={{ fontSize: 10 }}>
                    {format(
                      new Date(transaction.create_at),
                      "dd/MM/yyyy HH:mm",
                    )}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Checkbox
                      checked={transactionsCanceled.some(
                        (item) => item.id === transaction.id,
                      )}
                      onChange={() => {
                        let transactionsCanceledC = [...transactionsCanceled];
                        if (
                          transactionsCanceled.some(
                            (item) => item.id === transaction.id,
                          )
                        ) {
                          transactionsCanceledC = transactionsCanceledC.filter(
                            (item) => item.id !== transaction.id,
                          );
                          setTransactionsCanceled(transactionsCanceledC);
                        } else {
                          transactionsCanceledC.push(transaction);
                          setTransactionsCanceled(transactionsCanceledC);
                        }
                      }}
                    />
                  </div>
                </Transaction>
              ))}
              <Transaction key={"canceled"}>
                <p>Cancelar todas</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Checkbox
                    checked={transactionsCanceled.length == transactions.length}
                    onChange={() => {
                      if (transactionsCanceled.length == transactions.length) {
                        setTransactionsCanceled([]);
                      } else {
                        setTransactionsCanceled(transactions);
                      }
                    }}
                  />
                </div>
              </Transaction>
            </div>
          </Modal>
          <Modal
            title="Visualizar Compras"
            width={500}
            confirmLoading={isLoadingModal}
            open={isOpenPurchases}
            okText="FECHAR"
            cancelButtonProps={{
              style: {
                display: "none",
              },
            }}
            onCancel={() => {
              setIsOpenPurchases(false);
            }}
            onOk={() => {
              setIsOpenPurchases(false);
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
              <p>
                Total de{" "}
                {
                  [...new Set(purchasesModal.map((compra) => compra.client_id))]
                    .length
                }{" "}
                clientes que compraram
              </p>
              <p>
                {namePurchase} / {getValue(valuePurchase || 0)} /{" "}
                {typePurchase == "service"
                  ? "Serviço"
                  : `${tokenPurchase} Tokens`}
              </p>
              {purchasesModal?.length != 0 && (
                <Transaction style={{ marginTop: 10 }}>
                  <p>Cliente</p>
                  <p style={{ maxWidth: 80, textAlign: "center" }}>
                    Quantitade
                  </p>
                </Transaction>
              )}
              {clientsAll.map((client) => {
                let purchases = purchasesModal.filter((item) => {
                  return item.client_id == client.client_tournaments[0].id;
                }).length;
                if (purchases) {
                  return (
                    <Transaction key={client.id}>
                      <p>{client.name}</p>
                      <p style={{ maxWidth: 80, textAlign: "center" }}>
                        {purchases}x
                      </p>
                    </Transaction>
                  );
                }
              })}
            </div>
          </Modal>
          <Modal
            title="Jogadores Eliminados"
            width={500}
            confirmLoading={isLoadingModal}
            open={visibleExit}
            okText="FECHAR"
            cancelButtonProps={{
              style: {
                display: "none",
              },
            }}
            onCancel={() => {
              setVisibleExit(false);
            }}
            onOk={() => {
              setVisibleExit(false);
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
              {clientsTournamentExit.map((client) => {
                return (
                  <Transaction key={client.id}>
                    <div
                      style={{
                        flex: 1,
                        marginBottom: 5,
                      }}
                    >
                      <p>{client.name}</p>
                      <p
                        style={{
                          fontSize: 11,
                        }}
                      >
                        Eliminado em{" "}
                        {format(new Date(client.update_at), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                    <Tooltip title="Retornar jogador para o torneio">
                      <MdKeyboardReturn
                        onClick={() => {
                          confirm({
                            title: `Deseja retornar jogador no Torneio?`,
                            icon: <ExclamationCircleFilled />,
                            content: `Após essa ação, o jogador ${client.name} retorna para o torneio na lista de espera.`,
                            onOk() {
                              returnClient(client);
                            },
                            onCancel() {},
                            cancelText: "Cancelar",
                          });
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </Transaction>
                );
              })}
            </div>
          </Modal>
        </>
      )}
      {isLoading && <Loader />}
    </Container>
  );
};

export default Tournament;
