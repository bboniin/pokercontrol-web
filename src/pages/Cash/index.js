import React, { useEffect, useRef, useState } from "react";
import {
  MdAccountCircle,
  MdAdd,
  MdAddCircle,
  MdOutlineMoreVert,
  MdAutorenew,
  MdCardGiftcard,
  MdExitToApp,
  MdMonetizationOn,
  MdRefresh,
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
import {
  Button,
  Modal,
  AutoComplete,
  Select,
  Tooltip,
  Input,
  InputNumber,
} from "antd";
import IntlCurrencyInput from "react-intl-currency-input";
import { ExclamationCircleFilled } from "@ant-design/icons";
import MethodsPayment from "../../components/MethodsPayment";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getValue } from "../../services/functions";

const { confirm } = Modal;

const chairsN = [
  {
    value: 1,
    label: "Mesa 1",
  },
  {
    value: 2,
    label: "Mesa 2",
  },
  {
    value: 3,
    label: "Mesa 3",
  },
  {
    value: 4,
    label: "Mesa 4",
  },
  {
    value: 5,
    label: "Mesa 5",
  },
  {
    value: 6,
    label: "Mesa 6",
  },
  {
    value: 7,
    label: "Mesa 7",
  },
  {
    value: 8,
    label: "Mesa 8",
  },
  {
    value: 9,
    label: "Mesa 9",
  },
  {
    value: 10,
    label: "Mesa 10",
  },
  {
    value: 11,
    label: "Mesa 11",
  },
  {
    value: 12,
    label: "Mesa 12",
  },
  {
    value: 13,
    label: "Mesa 13",
  },
  {
    value: 14,
    label: "Mesa 14",
  },
  {
    value: 15,
    label: "Mesa 15",
  },
];

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

  const [clients, setClients] = useState([]);
  const [clientsC, setClientsC] = useState([]);
  const [methods_transaction, setMethods_transaction] = useState([]);
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
  const [isOpen, setIsOpen] = useState(false);
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
  }, [isOpenExit, isOpenTransaction, isOpenCash, isOpen]);

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

  async function loadChairs(cash) {
    await api
      .get("/clients-cash")
      .then((response) => {
        let chairs = [];
        for (let c = 0; c < cash.chairs; c++) {
          chairs[c] = { chairs: [] };
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

  async function moveClient() {
    setIsLoadingModal(true);
    if (!client || !chair || !position) {
      toast.warn(
        "Selecione o cliente, mesa e posição na mesa para adicionar ao cash"
      );
    } else {
      if (!client.chair_cash) {
        if (!value) {
          toast.warn("Insira o valor da transação");
          setIsLoadingModal(false);
          return "";
        } else {
          let methods_transactionC = methods_transaction.filter(
            (item) => item.id != "Crédito"
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
              loadCash();
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
    setIsLoadingModal(false);
  }

  async function createTransaction() {
    setIsLoadingModal(true);
    if (!client || !chair || !position) {
      toast.warn(
        "Selecione o cliente, mesa e posição na mesa para adicionar ao cash"
      );
    } else {
      if (!value) {
        toast.warn("Insira o valor da transação");
        setIsOpenTransaction(true);
        setIsLoadingModal(false);
        return "";
      } else {
        let methods_transactionC = methods_transaction.filter(
          (item) => item.id != "Crédito"
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
            .then(() => {
              loadCash();
              toast.success("Transação cadastrada com sucesso");
              setIsOpenTransaction(false);
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
            .then(() => {
              let chairC = [...chairs];
              chairC[chair - 1].chairs[position - 1].balance += value;
              setChairs(chairC);
              toast.success("Transação cadastrada com sucesso");
              setIsOpenTransaction(false);
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
    }
    setIsLoadingModal(false);
  }

  async function exitChair() {
    let methods_transactionC = methods_transaction.filter(
      (item) => item.id != "Crédito"
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

    await api
      .post(`exit-cash/${client.id}`, {
        methods_transaction: methods_transactionC,
        sector_id: cash.id,
        value: value,
        date_payment: datePayment,
        observation: observation,
        client_id: client.id,
      })
      .then(() => {
        setIsOpenExit(false);
        toast.success("Cliente removido do cash com sucesso");
        let chairC = [...chairs];
        chairC[i].chairs[p] = {
          label: `Posição ${p + 1}`,
          value: p + 1,
        };
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
  }

  async function createCash() {
    setIsLoadingModal(true);
    if (!name || !numberChairs) {
      toast.warning("Preencha os campos obrigatórios");
    } else {
      await api
        .post(`/cash`, { name: name, chairs: numberChairs })
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
                <MdAdd size="20" color="#fff" />
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
              <DataCash>
                <h4>Sessão {cash.name}</h4>
                <br />
                <h4>Total entradas: {getValue(cash.entrada)}</h4>
                <h4>Total cashouts: {getValue(cash.saida)}</h4>
                <h4>Rake do clube: {getValue(cash.entrada - cash.saida)}</h4>
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
                    })
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
                      })
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
                  })
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
                      })
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
                  })
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
        <ViewInput style={{ margin: "10px 0 20px 0" }}>
          <p>Mesas*</p>
          <Input
            style={{ width: "100%" }}
            placeholder="quantidade de mesas"
            value={numberChairs}
            onChange={(event) =>
              setNumberChairs(
                parseInt(event.target.value.replace(/\D/g, "")) || ""
              )
            }
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
                  })
                );
              }}
            />
          </ViewInput>
        </div>
      </Modal>
    </Container>
  );
};

export default Cash;
