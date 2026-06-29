import React, { useEffect, useRef, useState } from "react";
import {
  MdAccountCircle,
  MdAdd,
  MdAddCircle,
  MdOutlineMoreVert,
  MdCardGiftcard,
  MdExitToApp,
  MdMonetizationOn,
  MdRefresh,
  MdFolder,
  MdClose,
  MdEdit,
  MdPrint,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import {
  Container,
  ClientChair,
  Chair,
  Title,
  ViewInput,
  DataCash,
  Client,
} from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Button, Modal, AutoComplete, Select, Tooltip, Input } from "antd";
import IntlCurrencyInput from "react-intl-currency-input";
import { ExclamationCircleFilled } from "@ant-design/icons";
import MethodsPayment from "../../components/MethodsPayment";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getValue } from "../../services/functions";
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/logo.png";
import logoPablo from "../../assets/logoPablo.png";
import { TablePrint } from "../ViewComanda/styles";
import { format } from "date-fns";
import { useAuth } from "../../hooks/AuthContext";

const { confirm } = Modal;

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

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  width: "50%",
  height: 36,
  background: isDragging ? "#fff" : "transparent",
  ...draggableStyle,
});

const Cash = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [clients, setClients] = useState([]);
  const [clientsC, setClientsC] = useState([]);
  const [methods_transaction, setMethods_transaction] = useState([]);
  const [typePrint, setTypePrint] = useState([]);
  const [methods_transactionPrint, setMethods_transactionPrint] = useState([]);
  const [datePayment, setDatePayment] = useState("");
  const [getMethods, setGetMethods] = useState([]);
  const [client, setClient] = useState("");
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);
  const [name, setName] = useState("");
  const [nameClient, setNameClient] = useState("");
  const [chairs, setChairs] = useState([[]]);
  const [numberChairs, setNumberChairs] = useState("");
  const [chair, setChair] = useState("");
  const [cash, setCash] = useState("");
  const [positions, setPositions] = useState(0);
  const [value, setValue] = useState(0);
  const [position, setPosition] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [operation, setOperation] = useState("");
  const [id, setId] = useState("");
  const [observation, setObservation] = useState("");
  const [transaction, setTransaction] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRake, setIsOpenRake] = useState(false);
  const [isOpenBriefcase, setIsOpenBriefcase] = useState(false);
  const [isOpenRakeOperation, setIsOpenRakeOperation] = useState(false);
  const [isOpenCommand, setIsOpenCommand] = useState(false);
  const [isOpenChair, setIsOpenChair] = useState(false);
  const [isOpenCash, setIsOpenCash] = useState(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState(false);
  const [isOpenClient, setIsOpenClient] = useState(false);
  const [isOpenExit, setIsOpenExit] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  useEffect(() => {
    loadMethods();
    loadCash();
  }, []);

  useEffect(() => {
    setMethods_transaction([]);
    setDatePayment("");
    setObservation("");
    setNameClient("");
  }, [isOpenExit, isOpenTransaction, isOpenCash, isOpen, isOpenChair]);

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

  async function loadCash() {
    setIsLoading(true);
    await api
      .get("/cash")
      .then((response) => {
        let cash = response.data;
        if (cash) {
          cash.entrada = 0;
          cash.saida = 0;
          loadChairs(cash);
          loadClients();
          cash.transactions.map((item) => {
            if (item.operation == "entrada") {
              cash.entrada += item.value;
            } else {
              cash.saida += item.value;
            }
          });
        }
        setCash(cash);
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
    setIsLoading(false);
  }

  async function loadChairs(cash) {
    await api
      .get(`/clients-cash?cash_id=${cash.id}`)
      .then((response) => {
        let chairs = [];
        for (let c = 0; c < cash.chairs; c++) {
          chairs[c] = { chairs: [], value: c + 1, label: `Mesa ${c + 1}` };
          for (let p = 0; p < 10; p++) {
            chairs[c].chairs[p] = {
              label: `Posição ${p + 1}`,
              value: p + 1,
            };
          }
        }
        response.data.map((item) => {
          item.chair_cash = item.chair_cash.replace("C", "");
          let [i, p] = item.chair_cash.split("-");
          chairs[i - 1].chairs[p - 1] = item;
        });

        if (client) {
          console.log(client);
          console.log(
            response.data?.find((item) => item.id == client.id) || client,
          );
          setClient(
            response.data?.find((item) => item.id == client.id) || client,
          );
        }
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
          toast.error("Erro Interno. verifique sua conexão e tente novamente");
        }
      });
  }

  async function loadClients() {
    await api
      .get("/clients-chair")
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

  async function moveClient() {
    setIsLoadingModal(true);
    if (!client || !chair || !position) {
      toast.warn(
        "Selecione o cliente, mesa e posição na mesa para adicionar ao cash",
      );
    } else {
      if (!client.chair_cash) {
        if (!value) {
          toast.warn("Insira o valor da transação");
          setIsLoadingModal(false);
          return "";
        } else {
          let methods_transactionC = methods_transaction.filter(
            (item) => item.id != "Crédito",
          );

          if (methods_transactionC.length) {
            if (
              methods_transaction.filter((item) => !item.id || !item.value)
                .length
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

          setMethods_transactionPrint(methods_transactionC);
          setTypePrint("Entrada");

          await api
            .post(`/add-cash`, {
              id: client.id,
              chair: `${chair}-${position}`,
              sector_id: cash.id,
              value: value,
              observation: observation,
              methods_transaction: methods_transactionC,
            })
            .then(async (response) => {
              setTransaction(response.data);
              await loadCash();
              setIsOpen(false);
              setIsOpenChair(false);
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
                toast.error(
                  "Erro Interno. verifique sua conexão e tente novamente",
                );
              }
            });
        }
      } else {
        await api
          .post(`/move-cash`, { id: client.id, chair: `${chair}-${position}` })
          .then(async (response) => {
            toast.success("Cliente movido com sucesso");
            loadChairs(cash);
            setIsOpen(false);
            setIsOpenChair(false);
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
    setIsLoadingModal(false);
  }

  async function createTransaction() {
    setIsLoadingModal(true);
    if (!client || !chair || !position) {
      toast.warn(
        "Selecione o cliente, mesa e posição na mesa para adicionar ao cash",
      );
    } else {
      if (!value) {
        toast.warn("Insira o valor da transação");
        setIsOpenTransaction(true);
        setIsLoadingModal(false);
        return "";
      } else {
        let methods_transactionC = methods_transaction.filter(
          (item) => item.id != "Crédito",
        );

        if (methods_transactionC.length) {
          if (
            methods_transaction.filter((item) => !item.id || !item.value).length
          ) {
            toast.warn("Selecione o método de pagamento e o valor");
            setIsOpenTransaction(true);
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
            setIsOpenTransaction(true);
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
                setIsOpenTransaction(true);
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
            setIsOpenTransaction(true);
            setIsLoadingModal(false);
            return "";
          }
        }

        setMethods_transactionPrint(methods_transactionC);

        if (operation == "entrada") {
          await api
            .post("/buy-cash", {
              methods_transaction: methods_transactionC,
              sector_id: cash.id,
              value: value,
              date_payment: datePayment,
              observation: observation,
              client_id: client.id,
            })
            .then(async (response) => {
              setTransaction(response.data);
              await loadCash();
              setTypePrint("Entrada");
              toast.success("Transação cadastrada com sucesso");
              setIsOpenTransaction(false);
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
                toast.error(
                  "Erro Interno. verifique sua conexão e tente novamente",
                );
              }
              setIsOpenTransaction(true);
            });
        } else {
          await api
            .post("/reward-cash", {
              methods_transaction: methods_transactionC,
              sector_id: cash.id,
              value: value,
              date_payment: datePayment,
              observation: observation,
              client_id: client.id,
            })
            .then(async (response) => {
              setTransaction(response.data);
              await loadCash();
              toast.success("Transação cadastrada com sucesso");
              setIsOpenTransaction(false);
              setTypePrint("Saida");
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
                toast.error(
                  "Erro Interno. verifique sua conexão e tente novamente",
                );
              }
            });
        }
      }
    }
    setIsLoadingModal(false);
  }

  async function exitChair() {
    let methods_transactionC = methods_transaction.filter(
      (item) => item.id != "Crédito",
    );

    if (value) {
      if (methods_transactionC.length) {
        if (
          methods_transaction.filter((item) => !item.id || !item.value).length
        ) {
          toast.warn("Selecione o método de pagamento e o valor");
          setIsOpenExit(true);
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
          setIsOpenExit(true);
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
              setIsOpenExit(true);
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
          setIsOpenExit(true);
          setIsLoadingModal(false);
          return "";
        }
      }
    }

    setMethods_transactionPrint(methods_transactionC);

    await api
      .post(`exit-cash/${client.id}`, {
        methods_transaction: methods_transactionC,
        sector_id: cash.id,
        value: value,
        date_payment: datePayment,
        observation: observation,
        client_id: client.id,
      })
      .then(async (response) => {
        console.log(response.data);
        let clientEdit = { ...client };
        clientEdit.transactions.push(response.data);
        console.log(clientEdit);
        setClient(clientEdit);
        await loadCash();
        setTransaction(response.data);
        setIsOpenExit(false);
        toast.success("Cliente removido do cash com sucesso");
        setTypePrint("Saida");
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
  }

  async function createCash() {
    setIsLoadingModal(true);
    if (!name || !numberChairs || !value) {
      toast.warning("Preencha os campos obrigatórios");
    } else {
      await api
        .post(`/cash`, { name: name, chairs: numberChairs, briefcase: value })
        .then((response) => {
          toast.success("Sessão cash criada com sucesso");
          loadCash();
          setIsOpenCash(false);
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

  async function endCash() {
    await api
      .put(`/cash/${cash.id}`)
      .then((response) => {
        toast.success("Sessão cash finalizada com sucesso");
        loadCash();
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

  async function createAndEditRake() {
    setIsLoadingModal(true);
    if (!value) {
      toast.warning("Preencha o valor do rake");
    } else {
      if (id) {
        await api
          .put(`/rake/${id}`, {
            value: value,
          })
          .then((response) => {
            let cashgame = { ...cash };
            cashgame.rakes = cashgame.rakes.map((item) => {
              if (item.id === id) {
                return response.data;
              }
              return item;
            });
            cashgame.rake = cashgame.rakes.reduce(
              (acc, item) => acc + item.value,
              0,
            );
            setCash(cashgame);
            toast.success("Rake editado com sucesso");
            setIsOpenRakeOperation(false);
            setIsOpenRake(true);
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
      } else {
        await api
          .post(`/rake/${cash.id}`, {
            value: value,
          })
          .then((response) => {
            let cashgame = { ...cash };
            cashgame.rakes.push(response.data);
            cashgame.rake += value;
            setCash({ ...cashgame });
            toast.success("Rake criado com sucesso");
            setIsOpenRakeOperation(false);
            setIsOpenRake(true);
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
    setIsLoadingModal(false);
  }

  async function editBriefcase() {
    setIsLoadingModal(true);
    if (!value) {
      toast.warning("Preencha o valor da maleta");
    } else {
      await api
        .put(`/briefcase/${cash.id}`, {
          value: value,
        })
        .then((response) => {
          let cashgame = { ...cash };
          cashgame.historic_briefcase = response.data.historic_briefcase;
          cashgame.briefcase = value;
          setCash({ ...cashgame });
          toast.success("Maleta editada com sucesso");
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
        <h2>Cash</h2>
        <div>
          {cash ? (
            <>
              <Button
                type="primary"
                onClick={() => {
                  setIsOpenBriefcase(true);
                  setValue(cash.briefcase);
                }}
              >
                <MdFolder size="20" color="#fff" />
                <span>Maleta</span>
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setIsOpenRake(true);
                }}
              >
                <MdMonetizationOn size="20" color="#fff" />
                <span>Rake</span>
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  confirm({
                    title: "Deseja finalizar a sessão cash?",
                    icon: <ExclamationCircleFilled />,
                    content: `Remova todos os jogadores para finalizar.`,
                    onOk() {
                      endCash();
                    },
                    onCancel() {},
                    cancelText: "Cancelar",
                  });
                }}
              >
                <MdClose size="20" color="#fff" />
                <span>Finalizar Sessão Cash</span>
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setId("");
                  setClient("");
                  setChair("");
                  setPosition("");
                  setValue(0);
                  setOperation("entrada");
                  setIsOpen(true);
                }}
              >
                <MdAdd size="20" color="#fff" />
                <span>Adicionar Cliente</span>
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setName("");
                setNumberChairs("");
                setValue(0);
                setIsOpenCash(true);
              }}
            >
              <MdAdd size="20" color="#fff" />
              <span>Criar Sessão Cash</span>
            </Button>
          )}
        </div>
      </Title>

      {!isLoading && cash && (
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
                .post(`/move-cash`, {
                  id: draggableId,
                  chair: `${chair_final}-${position_final + 1}`,
                  chair_initial: `${chair_initial}-${position_initial + 1}`,
                })
                .then(async (response) => {
                  toast.success("Cliente movido com sucesso");
                  loadChairs(cash);
                  setIsOpen(false);
                  setIsOpenChair(false);
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
              <DataCash>
                <h4>Sessão {cash.name}</h4>
                <br />
                <h4>Maleta Inicial: {getValue(cash.briefcase)}</h4>
                <h4>
                  Maleta Atual:{" "}
                  {getValue(
                    cash.briefcase -
                      cash.total_entrie +
                      cash.rake +
                      cash.total_out,
                  )}
                </h4>
                <h4>Total entradas: {getValue(cash.total_entrie)}</h4>
                <h4>Total cashouts: {getValue(cash.total_out)}</h4>
                <h4>Rake do clube: {getValue(cash.rake)}</h4>
                <br />
                <Button
                  type="primary"
                  onClick={() => {
                    loadCash();
                  }}
                >
                  <MdRefresh size="20" color="#fff" />
                  <span>Atualizar</span>
                </Button>
              </DataCash>
              {chairs.map((item, i) => {
                if (item.chairs) {
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
                                                        setValue(0);
                                                        setOperation("entrada");
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
                                                    setClient("");
                                                    setId("");
                                                    setChair(i + 1);
                                                    setPosition(p + 1);
                                                    setValue(0);
                                                    setOperation("entrada");
                                                    setIsOpenChair(true);
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
                                                      setValue(0);

                                                      setOperation("entrada");
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
                                                  style={{ ...getItemStyle() }}
                                                  onClick={() => {
                                                    setClient("");
                                                    setId("");
                                                    setChair(i + 1);
                                                    setPosition(p + 1);
                                                    setValue(0);
                                                    setOperation("entrada");
                                                    setIsOpenChair(true);
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
                }
              })}
            </div>
          </DragDropContext>
        </>
      )}
      {!isLoading && !cash && (
        <>
          <div className="error">
            <p>Crie uma sessão cash para continuar</p>
          </div>
        </>
      )}

      {isLoading && <Loader />}
      <Modal
        title={`Rake do Cashgame`}
        width={500}
        open={isOpenRake}
        okText={`CONFIRMAR`}
        cancelText="FECHAR"
        onOk={() => {
          setIsOpenRake(false);
        }}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        onCancel={() => {
          setIsOpenRake(false);
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            margin: "25px 0",
          }}
        >
          {cash?.rakes?.map((rake, index) => {
            return (
              <div
                style={{
                  padding: "10px 15px",
                  background: "#F0f0f0",
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <h3
                  style={{
                    fontWeight: "bold",
                    marginBottom: 0,
                    alignItems: "center",
                  }}
                >
                  Rake {index + 1} - {getValue(rake.value)}
                  <MdEdit
                    style={{
                      marginLeft: 10,
                    }}
                    onClick={() => {
                      setIsOpenRake(false);
                      setId(rake.id);
                      setValue(rake.value);
                      setIsOpenRakeOperation(true);
                    }}
                  />
                </h3>
                <p
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {rake.historic}
                </p>
              </div>
            );
          })}
          <Button
            type="primary"
            style={{
              marginTop: 15,
            }}
            onClick={() => {
              setIsOpenRake(false);
              setId("");
              setValue(0);
              setIsOpenRakeOperation(true);
            }}
          >
            Adicionar Rake
          </Button>
        </div>
      </Modal>
      <Modal
        title={`Maleta Cashgame`}
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenBriefcase}
        okText={`ATUALIZAR MALETA`}
        cancelText="FECHAR"
        onOk={() => {
          editBriefcase();
        }}
        onCancel={() => {
          setIsOpenBriefcase(false);
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
          <div
            style={{
              padding: "10px 15px",
              background: "#F0f0f0",
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <h4>Sessão {cash?.name}</h4>
            <br />
            <h4>Valor da Maleta: {getValue(value)}</h4>
            <h4>
              Maleta Atual:{" "}
              {getValue(
                value -
                  (cash?.total_entrie || 0) +
                  (cash?.rake || 0) +
                  (cash?.total_out || 0),
              )}
            </h4>
            <h4>Total entradas: {getValue(cash?.total_entrie || 0)}</h4>
            <h4>Total cashouts: {getValue(cash?.total_out || 0)}</h4>
            <h4>Rake do clube: {getValue(cash?.rake || 0)}</h4>
            <p
              style={{
                textAlign: "right",
                fontSize: 12,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {cash?.historic_briefcase}
            </p>
          </div>
          <ViewInput>
            <p>Valor da Maleta</p>
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
              value={value}
              onChange={(event, value) => setValue(value)}
            />
          </ViewInput>
        </div>
      </Modal>
      <Modal
        title={id ? "Editar Rake" : `Adicionar Rake`}
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenRakeOperation}
        okText={`CONFIRMAR`}
        cancelText="FECHAR"
        onOk={() => {
          createAndEditRake();
        }}
        onCancel={() => {
          setIsOpenRakeOperation(false);
          setIsOpenRake(true);
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
            <p>Valor do Rake</p>
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
              value={value}
              onChange={(event, value) => setValue(value)}
            />
          </ViewInput>
        </div>
      </Modal>
      <Modal
        title={`${id ? "Mover" : "Adicionar"} Cliente`}
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpen}
        okText={`${id ? "MOVER" : "ADICIONAR"}`}
        cancelText="FECHAR"
        onOk={() => {
          moveClient();
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
          )}
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
                  }),
                );
              }}
              options={chairs}
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

          {!id && client && (
            <>
              <ViewInput>
                <p>Valor da Transação</p>
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
                  value={value}
                  onChange={(event, value) => setValue(value)}
                />
              </ViewInput>

              <ViewInput style={{ textAlign: "left" }}>
                <p>Métodos de pagamento</p>
                <MethodsPayment
                  getMethods={getMethods}
                  operation={operation}
                  debt={operation == "saida" ? client.debt : 0}
                  receive={operation == "entrada" ? client.receive : 0}
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
            </>
          )}
        </div>
      </Modal>
      <Modal
        title="Adicionar Cliente"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenChair}
        okText="ADICIONAR"
        cancelText="FECHAR"
        onOk={() => {
          moveClient();
        }}
        onCancel={() => {
          setIsOpenChair(false);
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
            <p>Cliente</p>
            <AutoComplete
              disabled={id ? true : false}
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
          {!id && client && (
            <>
              <ViewInput>
                <p>Valor da Transação</p>
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
                  value={value}
                  onChange={(event, value) => setValue(value)}
                />
              </ViewInput>

              <ViewInput style={{ textAlign: "left" }}>
                <p>Métodos de pagamento</p>
                <MethodsPayment
                  getMethods={getMethods}
                  operation={operation}
                  debt={operation == "saida" ? client.debt : 0}
                  receive={operation == "entrada" ? client.receive : 0}
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
            </>
          )}
        </div>
      </Modal>
      <Modal
        title={`${operation == "entrada" ? "Compra" : "Recompensa"} Cash`}
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenTransaction}
        okText="CONFIRMAR"
        cancelText="FECHAR"
        onOk={() => {
          createTransaction();
        }}
        onCancel={() => {
          setIsOpenTransaction(false);
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
            <p>Valor da Transação</p>
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
              value={value}
              onChange={(event, value) => setValue(value)}
            />
          </ViewInput>

          <ViewInput style={{ textAlign: "left" }}>
            <p>Métodos de pagamento</p>
            <MethodsPayment
              getMethods={getMethods}
              operation={operation}
              debt={operation == "saida" ? client.debt : 0}
              receive={operation == "entrada" ? client.receive : 0}
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
          {client && (
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
            </>
          )}
          <div className="actions" style={{ marginTop: 10 }}>
            <button
              title="Visualizar cliente"
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
            <button
              onClick={() => {
                setOperation("entrada");
                setValue(0);
                setClient(client);
                setChair(i + 1);
                setPosition(p + 1);
                setIsOpenClient(false);
                setIsOpenTransaction(true);
              }}
            >
              <Tooltip title="Comprar Fichas">
                <MdMonetizationOn color="#001B22" size={22} />
              </Tooltip>
            </button>
            <button
              onClick={() => {
                setOperation("saida");
                setValue(0);
                setClient(client);
                setChair(i + 1);
                setPosition(p + 1);
                setIsOpenClient(false);
                setIsOpenTransaction(true);
              }}
            >
              <Tooltip title="Resgate de Fichas">
                <MdCardGiftcard color="#001B22" size={22} />
              </Tooltip>
            </button>

            <button
              onClick={() => {
                setTypePrint("");
                setClient(client);
                setChair(i + 1);
                setPosition(p + 1);
                setIsOpenClient(false);
                setIsOpenCommand(true);
              }}
            >
              <Tooltip title="Imprimir Comanda">
                <MdPrint color="#001B22" size={22} />
              </Tooltip>
            </button>
            <button
              onClick={() => {
                setIsOpenClient(false);
                setClient(client);
                setValue(0);
                setI(i);
                setP(p);
                setIsOpenExit(true);
              }}
              style={{ position: "absolute", right: -5, marginRight: 0 }}
            >
              <Tooltip title="Retirar da Mesa">
                <MdExitToApp color="#001B22" size={22} />
              </Tooltip>
            </button>
          </div>
        </ClientChair>
      </Modal>
      <Modal
        title="Nova Sessão"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenCash}
        okText="CRIAR SESSÃO CASH"
        cancelText="FECHAR"
        onOk={() => {
          createCash();
        }}
        onCancel={() => {
          setIsOpenCash(false);
        }}
      >
        <ViewInput style={{ marginTop: "10px" }}>
          <p>Nome*</p>
          <Input
            placeholder="nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </ViewInput>
        <ViewInput>
          <p>Mesas*</p>
          <Input
            style={{ width: "100%" }}
            placeholder="quantidade de mesas"
            value={numberChairs}
            onChange={(event) =>
              setNumberChairs(
                parseInt(event.target.value.replace(/\D/g, "")) || "",
              )
            }
          />
        </ViewInput>
        <ViewInput style={{ marginBottom: 20 }}>
          <p>Valor da Maleta*</p>
          <IntlCurrencyInput
            style={{
              width: "100%",
              backgroundColor: "#FFF",
              borderWidth: 0,
              color: "#001B22",
              padding: "6px 8px",
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
            value={value}
            onChange={(event, value) => setValue(value)}
          />
        </ViewInput>
      </Modal>
      <Modal
        title={`Saida Cash`}
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenExit}
        okText="CONFIRMAR SAIDA"
        cancelText="FECHAR"
        onOk={() => {
          exitChair();
        }}
        onCancel={() => {
          setIsOpenExit(false);
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
            <p>Quanto o cliente {client.name} saiu?</p>
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
              value={value}
              onChange={(event, value) => setValue(value)}
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
        title="Imprimir Comanda"
        width={400}
        open={isOpenCommand}
        cancelText="FECHAR"
        okText="IMPRIMIR"
        maskClosable={false}
        onOk={() => {
          handlePrint();
        }}
        onCancel={() => {
          setIsOpenCommand(false);
          setTransaction(null);
          if (!typePrint) {
            setIsOpenClient(true);
          }
        }}
      >
        <div
          ref={componentRef}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            marginBottom: 0,
            fontWeight: "bold",
            padding: "20px 15px",
          }}
        >
          {user.name == "pablospoker" && (
            <img
              src={logoPablo}
              alt=""
              style={{ width: 180, marginBottom: 10 }}
            />
          )}

          {user.name != "pablospoker" && (
            <img
              src={logo}
              alt=""
              style={{
                width: 220,
                position: "absolute",
                top: "15%",
                opacity: 0.28,
              }}
            />
          )}
          <p style={{ width: "100%" }}>Cliente: {client?.name}</p>
          <p style={{ width: "100%", lineHeight: 2 }}>{client?.chair}</p>
          <p style={{ width: "100%", lineHeight: 2 }}>
            {format(new Date(), "dd/MM/yyyy HH:mm:ss")}
          </p>
          {typePrint && (
            <>
              <TablePrint>
                <thead>
                  <tr>
                    <td>Compra</td>
                    <td style={{ textAlign: "center", width: 125 }}>Valor</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{typePrint}</td>
                    <td style={{ textAlign: "center", width: 125 }}>
                      {(value || 0).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                </tbody>
              </TablePrint>

              <p
                style={{
                  textAlign: "start",
                  width: "100%",
                  fontSize: 12,
                  marginTop: 25,
                }}
              >
                Métodos de pagamento:
              </p>
              {methods_transactionPrint.map((item) => {
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
              <h3 style={{ width: "100%", margin: "10px 0" }}>
                Total:{" "}
                {(value || 0).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </>
          )}

          {client.transactions?.length && (
            <>
              <p
                style={{
                  textAlign: "start",
                  width: "100%",
                  fontSize: 12,
                  marginTop: 25,
                }}
              >
                Compras/Saidas Anteriores
              </p>
            </>
          )}
          <TablePrint style={{ marginTop: 0 }}>
            <thead>
              <tr>
                <td>Compra</td>
                <td style={{ textAlign: "center", width: 125 }}>Valor</td>
                <td style={{ textAlign: "center", width: 125 }}>Método</td>
                {<td style={{ textAlign: "center", width: 125 }}>Data</td>}
              </tr>
            </thead>
            <tbody>
              {client.transactions?.map((item) => {
                if (transaction?.id != item.id) {
                  return (
                    <tr>
                      <td>{item.operation == "saida" ? "Saida" : "Entrada"}</td>
                      <td
                        style={{
                          textAlign: "center",
                          width: 100,
                        }}
                      >
                        <p>
                          {(item.value || 0).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          width: 150,
                          fontSize: 11,
                        }}
                      >
                        {item.value != item.value_paid &&
                          `Crédito${!!item.methods_transaction?.length ? ", " : ""}`}
                        {item.methods_transaction
                          ?.map((item) => item.name)
                          .join(", ")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          width: 100,
                          fontSize: 11,
                        }}
                      >
                        <p>{format(new Date(item.create_at), "dd/MM/yy")}</p>
                        <p>{format(new Date(item.create_at), "HH:mm")}</p>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </TablePrint>
          <h3
            style={{
              width: "100%",
              margin: "10px 0 5px",
              fontWeight: "bolder",
              paddingBottom: 40,
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              borderBottomColor: "#000",
            }}
          >
            Saldo:{" "}
            {(
              client.transactions?.reduce((acc, item) => {
                return (
                  acc +
                  (item.operation == "entrada"
                    ? -1 * (item.value - item.value_paid)
                    : item.value - item.value_paid)
                );
              }, 0) || 0
            ).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <p style={{ width: "100%", textAlign: "center", marginBottom: 15 }}>
            {client?.name}
          </p>
          <p
            style={{
              width: "100%",
              textAlign: "center",
              paddingTop: 45,
              opacity: 0.28,
            }}
          >
            -
          </p>
        </div>
      </Modal>
    </Container>
  );
};

export default Cash;
