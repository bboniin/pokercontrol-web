import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Card,
  Statistic,
  Select,
  Input,
  AutoComplete,
} from "antd";
import { ExclamationCircleFilled, PoweroffOutlined } from "@ant-design/icons";
import IntlCurrencyInput from "react-intl-currency-input";
import {
  Container,
  Content,
  CardsContainer,
  ViewInput,
  PaymentsHeader,
  Table,
  Title,
} from "./styles";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  MdAccountBalance,
  MdAdd,
  MdEdit,
  MdMonetizationOn,
  MdVisibility,
} from "react-icons/md";
import { getValue } from "../../services/functions";
import { format } from "date-fns";
import MethodsPayment from "../../components/MethodsPayment";
import { useQuery } from "../../hooks/Location";
import { useAuth } from "../../hooks/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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

const types = {
  cash: "Cash",
  bar: "Bar",
  dealer: "Dealer",
  jackpot: "Jackpot",
  passport: "Passport",
  torneio: "Torneio",
  "torneio-buyin": "Torneio (Buyin)",
  "torneio-rebuy": "Torneio (Rebuy)",
  "torneio-rebuy-duplo": "Torneio (Rebuy Duplo)",
  "torneio-rebuy-triplo": "Torneio (Rebuy Triplo)",
  "torneio-add-on": "Torneio (ADD ON)",
  "torneio-super-add-on": "Torneio (Super ADD ON)",
  "torneio-buyin-staff": "Torneio (Buyin) Staff",
  "torneio-rebuy-staff": "Torneio (Rebuy) Staff",
  "torneio-rebuy-duplo-staff": "Torneio (Rebuy Duplo) Staff",
  "torneio-rebuy-triplo-staff": "Torneio (Rebuy Triplo) Staff",
  "torneio-add-on-staff": "Torneio (ADD ON) Staff",
  "torneio-super-add-on-staff": "Torneio (Super ADD ON) Staff",
};

const Caixa = () => {
  const { user } = useAuth();
  const query = useQuery();
  const navigate = useNavigate();
  const ids = query.get("ids");

  const [selectBox, setSelectBox] = useState(ids);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [valorInicial, setValorInicial] = useState(0);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [box, setBox] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [name, setName] = useState(false);
  const [value, setValue] = useState(0);
  const [observation, setObservation] = useState("");
  const [clients, setClients] = useState([]);
  const [clientsBox, setClientsBox] = useState([]);
  const [clientsC, setClientsC] = useState([]);
  const [typeNew, setTypeNew] = useState("clube");
  const [typeNewOut, setTypeNewOut] = useState("clube");
  const [methodsFilter, setMethodsFilter] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [operation, setOperation] = useState("entrada");
  const [clientsTransaction, setClientsTransaction] = useState([]);
  const [clientTransaction, setClientTransaction] = useState("");
  const [nameClientTransaction, setNameClientTransaction] = useState("");
  const [isOpenTransaction, setIsOpenTransaction] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [methods_transaction, setMethods_transaction] = useState([]);
  const [datePayment, setDatePayment] = useState("");
  const [getMethods, setGetMethods] = useState([]);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    loadMethods();
    loadClients();
    loadBanks();
  }, []);

  useEffect(() => {
    if (user.type == "admin" && ids) {
      loadFinancialBoxAdmin();
    } else {
      loadFinancialBox();
    }
    setMethodsFilter([]);
  }, [selectBox]);

  async function loadFinancialBoxAdmin() {
    setIsLoading(true);
    await api
      .get(`/club/financial-box/${selectBox}`)
      .then((response) => {
        setBox(response.data);
        setTransactions(response.data.transactions);
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

  async function loadFinancialBox() {
    setIsLoading(true);
    let getBox = ids ? `?box_id=${ids}` : "";
    await api
      .get(`/financial-box${getBox}`)
      .then((response) => {
        setBox(response.data);
        setTransactions(response.data.transactions);
        setClientsBox(response.data.clients);
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
  async function loadClients() {
    await api
      .get("/clients?all=true")
      .then((response) => {
        let clientC = response.data.clients;
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

  async function loadMethods() {
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

  async function loadBanks() {
    setIsLoading(true);
    await api
      .get("/banks")
      .then((response) => {
        let banks = response.data;
        banks.map((item) => {
          item.label = item.name;
          item.value = item.id;
        });
        setBanks(banks);
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

  async function confirmTransaction() {
    setIsLoadingModal(true);

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
        transaction.value - transaction.value_paid <
        methods_transaction
          .map((method) => method["value"])
          .reduce((total, value) => total + value)
      ) {
        toast.warn("Valor restante não pode ser negativo");
        setIsLoadingModal(false);
        return "";
      } else {
        if (
          transaction.value - transaction.value_paid !=
          methods_transaction
            .map((method) => method["value"])
            .reduce((total, value) => total + value)
        ) {
          methods_transactionC.push({
            id: "Crédito",
            name: "Crédito",
            percentage: 0,
            value:
              transaction.value -
              transaction.value_paid -
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
      toast.warn("Efetue pelo menos o pagamento parcial para avançar");
      setIsLoadingModal(false);
      return "";
    }

    await api
      .put(`/confirmed-transaction/${transaction.id}`, {
        methods_transaction: methods_transactionC,
        date_payment: datePayment,
        observation: observation,
      })
      .then(() => {
        if (user.type == "admin" && ids) {
          loadFinancialBoxAdmin();
        } else {
          loadFinancialBox();
        }
        toast.success("Transação confirmada com sucesso");
        setIsOpenConfirm(false);
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

  async function createTransaction() {
    setIsLoadingModal(true);
    if (!name || !operation) {
      toast.warn("Preencha todos os campos");
    } else {
      if (!value) {
        toast.warn("Insira o valor da transação");
        setIsLoadingModal(false);
        return "";
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
        .post("/transaction-club", {
          value: value,
          name: name,
          type: typeNew,
          operation: operation,
          methods_transaction: methods_transactionC,
          date_payment: datePayment,
          observation: observation,
          client_id: clientTransaction ? clientTransaction.id : "",
        })
        .then(() => {
          if (user.type == "admin" && ids) {
            loadFinancialBoxAdmin();
          } else {
            loadFinancialBox();
          }
          toast.success("Transação cadastrada com sucesso");
          setIsOpenNew(false);
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

  async function editTransaction() {
    setIsLoadingModal(true);
    if (!value) {
      toast.warning("Preencha o valor da transação");
    } else {
      await api
        .put(`/transaction/${transaction.id}`, {
          value: value,
          observation: observation,
        })
        .then((response) => {
          toast.success("Transação editada com sucesso");
          setIsOpenEdit(false);
          if (user.type == "admin" && ids) {
            loadFinancialBoxAdmin();
          } else {
            loadFinancialBox();
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
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
            );
          }
        });
    }
    setIsLoadingModal(false);
  }

  async function startCaixa() {
    setIsLoadingModal(true);
    await api
      .post(`/financial-box`, { value_initial: valorInicial })
      .then((response) => {
        toast.success("Caixa aberto com sucesso");
        if (user.type == "admin" && ids) {
          loadFinancialBoxAdmin();
        } else {
          loadFinancialBox();
        }
        setIsModalVisible(false);
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

  async function endCaixa(id) {
    setIsLoadingModal(true);
    await api
      .put(`/financial-box/${id}`)
      .then((response) => {
        toast.success("Caixa encerrado com sucesso");
        setBox(null);
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

  useEffect(() => {
    if (box) {
      let transactionsFilter = [...box.transactions];
      if (methodsFilter.length) {
        transactionsFilter = transactionsFilter.filter((data) => {
          return (
            data.methods_transaction.find((method) => {
              return methodsFilter.includes(method.name);
            }) ||
            (methodsFilter.includes("Pagamento Pendente") && !data.paid)
          );
        });
        let clientsFilter = {};
        transactionsFilter.map((item) => {
          if (!clientsFilter[item.client_id]) {
            clientsFilter[item.client_id] = item.client;
          }
        });
        setClientsBox(clientsFilter ? Object.values(clientsFilter) : []);
      } else {
        setClientsBox(box.clients);
      }
      setTransactions([...transactionsFilter]);
    }
  }, [box, methodsFilter]);

  return (
    <Container>
      <Title>
        <h2>
          {box?.closed
            ? box?.resumed
              ? "Resumo de Caixas Selecionados"
              : "Caixa Fechado"
            : "Caixa Atual"}
        </h2>
        {(!ids || box?.user_id == user.id) && (
          <div>
            {!box ? (
              <Button
                type="primary"
                onClick={() => {
                  setValorInicial(0);
                  setIsModalVisible(true);
                }}
              >
                <MdAccountBalance size={18} color="#fff" />
                Iniciar Caixa
              </Button>
            ) : (
              <>
                {!box.closed && (
                  <div>
                    <Button
                      type="primary"
                      onClick={() => {
                        setName("");
                        setValue(0);
                        setTypeNew("clube");
                        setOperation("entrada");
                        setClientsTransaction(clientsC);
                        setClientTransaction("");
                        setNameClientTransaction("");
                        setIsOpenNew(true);
                      }}
                    >
                      <MdAdd size="20" color="#fff" />
                      <span>Movimentação Financeira</span>
                    </Button>
                    <Button
                      danger
                      onClick={() => {
                        confirm({
                          title: "Deseja encerrar o caixa?",
                          icon: <ExclamationCircleFilled />,
                          content: `Após essa ação, o caixa será encerrado`,
                          onOk() {
                            endCaixa(box.id);
                          },
                          onCancel() {},
                        });
                      }}
                      icon={<PoweroffOutlined />}
                    >
                      Encerrar Caixa
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Title>
      {ids?.includes(",") && (
        <ViewInput style={{ maxWidth: 350, marginTop: -20, marginBottom: 15 }}>
          <p>Selecionar visualização</p>
          <Select
            value={selectBox}
            style={{ width: "100%", textAlign: "left" }}
            onChange={(value) => {
              setSelectBox(value);
            }}
          >
            <Select.Option value={ids}>Resumo dos caixas</Select.Option>
            {ids.split(",").map((item, idx) => {
              return (
                <Select.Option value={item}>Caixa {idx + 1}</Select.Option>
              );
            })}
          </Select>
        </ViewInput>
      )}
      {box && !box?.resumed && (
        <>
          <h4
            style={{
              width: "100%",
            }}
          >
            Caixa responsável: {box.user.name}
          </h4>
          <h4
            style={{
              width: "100%",
              marginTop: 5,
            }}
          >
            Caixa aberto em{" "}
            {format(new Date(box.date_initial), "dd/MM/yyyy HH:mm")}
          </h4>
          {box.closed && (
            <h4
              style={{
                width: "100%",
                marginTop: 5,
              }}
            >
              Caixa fechado em{" "}
              {format(new Date(box.date_end), "dd/MM/yyyy HH:mm")}
            </h4>
          )}
        </>
      )}
      <Modal
        title="Iniciar Caixa"
        open={isModalVisible}
        confirmLoading={isLoadingModal}
        onOk={() => {
          startCaixa();
        }}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        okText="Iniciar"
        cancelText="Fechar"
      >
        <ViewInput>
          <p>Valor inicial do caixa:</p>
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
            value={valorInicial}
            onChange={(event, value) => setValorInicial(value)}
          />
        </ViewInput>
      </Modal>

      {box && (
        <Content>
          <CardsContainer>
            <Card>
              <Statistic
                title="Valor Inicial"
                value={box.value_initial}
                precision={2}
                prefix="R$"
              />
            </Card>
            <Card>
              <Statistic
                title="Total Entradas"
                value={box.totalEntrie}
                precision={2}
                prefix="R$"
              />
            </Card>
            <Card>
              <Statistic
                title="Total Saídas"
                value={box.totalOut}
                precision={2}
                prefix="R$"
              />
            </Card>
            <Card>
              <Statistic
                title="Balanço Atual"
                value={box.totalBalance}
                precision={2}
                prefix="R$"
              />
            </Card>
            <Card>
              <Statistic
                title="Total Entradas Futuro"
                value={box.totalEntrieFuture}
                precision={2}
                prefix="R$"
              />
            </Card>
            <Card>
              <Statistic
                title="Total Saídas Futuro"
                value={box.totalOutFuture}
                precision={2}
                prefix="R$"
              />
            </Card>
            <Card>
              <Statistic
                title="Balanço Atual Futuro"
                value={box.totalBalanceFuture}
                precision={2}
                prefix="R$"
              />
            </Card>
          </CardsContainer>

          <h4>Saldos por Meio de Pagamento</h4>
          <CardsContainer>
            {box.methods_transaction.map((item) => (
              <Card
                key={item.id}
                className={
                  methodsFilter.find((data) => data == item.name)
                    ? "active"
                    : ""
                }
                onClick={() => {
                  if (methodsFilter.find((data) => data == item.name)) {
                    setMethodsFilter(
                      methodsFilter.filter((data) => data != item.name),
                    );
                  } else {
                    setMethodsFilter([...methodsFilter, item.name]);
                  }
                }}
              >
                <Statistic
                  title={item.name}
                  value={item.value_entrie - item.value_out || 0}
                  precision={2}
                  prefix="R$"
                  style={{
                    color:
                      item.value_entrie - item.value_out >= 0
                        ? "#00c281  !important"
                        : "#ff4d4f !important",
                  }}
                />
                <p>
                  Entradas:{" "}
                  <span style={{ color: "#00c281" }}>
                    R$ {(item.value_entrie || 0).toFixed(2)}
                  </span>
                </p>
                <p>
                  Saídas:{" "}
                  <span style={{ color: "#ff4d4f" }}>
                    R$ {(item.value_out || 0).toFixed(2)}
                  </span>
                </p>
              </Card>
            ))}
          </CardsContainer>
          <h4>Clientes</h4>
          {clientsBox.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td style={{ width: 50 }}></td>
                    <td>Nome</td>
                    <td>Crédito</td>
                    <td>À receber</td>
                    <td>À pagar</td>
                    <td style={{ width: 80 }}></td>
                  </tr>
                </thead>
                <tbody>
                  {clientsBox.map((client) => {
                    if (client) {
                      return (
                        <tr
                          key={client.id}
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            navigate(`/client/${client.id}`);
                          }}
                        >
                          <td style={{ width: 40 }}>
                            <img
                              style={{ width: 30, height: 30, borderRadius: 2 }}
                              src={
                                client.photo_url ||
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
                              }
                            />
                          </td>
                          <td>{client.name}</td>
                          <td>
                            {client.credit.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </td>
                          <td>
                            {client.receive.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </td>
                          <td>
                            {client.debt.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </td>
                          <td>
                            <MdVisibility
                              style={{ cursor: "pointer", marginLeft: 5 }}
                              size={22}
                              color={"#001B22"}
                            />
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </Table>
            </>
          ) : (
            <div className="error">
              <p>Nenhum cliente encontrado</p>
            </div>
          )}

          <h4>Transações</h4>
          {transactions.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td>Tipo</td>
                    <td>Valor</td>
                    <td>Status</td>
                    <td>Data</td>
                    <td>Cliente</td>
                    <td style={{ width: 50 }}></td>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.items_transaction.map((item, index) => {
                          return index == 0
                            ? types[item.name] || item.name
                            : " , " + types[item.name] || item.name;
                        })}
                      </td>
                      <td
                        style={{
                          color:
                            transaction.operation == "entrada"
                              ? "#1eb019"
                              : "#d63211",
                        }}
                      >
                        {getValue(transaction.value)}
                      </td>
                      <td>
                        {transaction.paid
                          ? "Pago"
                          : transaction.value_paid
                            ? `Falta pagar ${getValue(
                                transaction.value - transaction.value_paid,
                              )}`
                            : "Não Pago"}
                      </td>
                      <td>
                        {format(
                          new Date(transaction.create_at),
                          "dd/MM/yyyy HH:mm",
                        )}
                      </td>
                      <td>
                        {transaction.client
                          ? transaction.client.name
                          : "Interna do Clube"}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        {!transaction.paid && (
                          <MdMonetizationOn
                            onClick={() => {
                              setTransaction(transaction);
                              setIsOpenConfirm(true);
                              setObservation(transaction.observation);
                            }}
                            style={{ cursor: "pointer", marginLeft: 5 }}
                            size={18}
                            color={"#001B22"}
                          />
                        )}
                        {!transaction.value_paid && transaction.editable && (
                          <MdEdit
                            onClick={() => {
                              setTransaction(transaction);
                              setIsOpenEdit(true);
                              setValue(transaction.value);
                              setObservation(transaction.observation);
                            }}
                            style={{ cursor: "pointer", marginLeft: 5 }}
                            size={18}
                            color={"#001B22"}
                          />
                        )}
                        <MdVisibility
                          onClick={() => {
                            setTransaction(transaction);
                            setIsOpenTransaction(true);
                          }}
                          style={{ cursor: "pointer", marginLeft: 5 }}
                          size={18}
                          color={"#001B22"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <div className="error">
              <p>Nenhuma transação encontrada</p>
            </div>
          )}
        </Content>
      )}

      <Modal
        title="Confirmar Pagamento"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenConfirm}
        okText="CONFIRMAR PAGAMENTO"
        cancelText="FECHAR"
        onOk={() => {
          confirmTransaction();
        }}
        onCancel={() => {
          setIsOpenConfirm(false);
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
              value={transaction.value}
            />
          </ViewInput>
          {!!transaction.value_paid && (
            <h3>Já foi pago {getValue(transaction.value_paid)}</h3>
          )}
          <ViewInput style={{ textAlign: "left" }}>
            <p>Métodos de pagamento</p>
            <MethodsPayment
              getMethods={getMethods}
              operation={transaction.operation}
              debt={
                transaction.operation == "saida"
                  ? transaction.client
                    ? transaction.client.debt
                    : 0
                  : 0
              }
              receive={
                transaction.operation == "entrada"
                  ? transaction.client
                    ? transaction.client.receive
                    : 0
                  : 0
              }
              methodsPayment={methods_transaction}
              value={transaction.value - transaction.value_paid}
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
        title="Movimentação do Clube"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenNew}
        okText="CONFIRMAR PAGAMENTO"
        cancelText="FECHAR"
        onOk={() => {
          createTransaction();
        }}
        onCancel={() => {
          setIsOpenNew(false);
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
            <p>Tipo de Cobrança</p>
            <Select
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                borderWidth: 0,
                color: "#001B22",
                fontSize: 14,
                borderRadius: 2,
                fontWeight: "400",
              }}
              options={[
                { value: "entrada", label: "Entrada" },
                { value: "saida", label: "Saida" },
              ]}
              value={operation}
              onChange={(operationChange) => {
                if (operationChange == "transferencia") {
                  setTypeNew(null);
                  setTypeNewOut(null);
                  setValue("");
                  setObservation("");
                } else {
                  if (operation == "transferencia") {
                    setClientTransaction(null);
                    setTypeNew("clube");
                    setName("");
                    setObservation("");
                    setNameClientTransaction("");
                    setValue("");
                  }
                }
                setOperation(operationChange);
              }}
            />
          </ViewInput>
          {operation != "transferencia" && (
            <ViewInput>
              <p>Nome da Cobrança</p>
              <Input
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  borderWidth: 0,
                  color: "#001B22",
                  padding: "8px",
                  height: 35,
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderStyle: "solid",
                  borderRadius: 2,
                  fontWeight: "400",
                  paddingLeft: 12,
                }}
                placeholder="digite o nome da cobrança"
                value={name}
                onChange={(text) => {
                  setName(text.target.value);
                }}
              />
            </ViewInput>
          )}
          {operation != "transferencia" && (
            <ViewInput>
              <p>Selecionar Cliente</p>
              <AutoComplete
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  borderWidth: 0,
                  color: "#001B22",
                  fontSize: 14,
                  borderRadius: 2,
                  fontWeight: "400",
                }}
                options={clientsTransaction}
                value={
                  clientTransaction
                    ? clientTransaction.name
                    : nameClientTransaction
                }
                notFoundContent={<>Nenhum cliente encontrado</>}
                onSelect={(text, client) => {
                  setClientTransaction(client);
                  setTypeNew("clube");
                  setMethods_transaction([]);
                }}
                onSearch={(text) => {
                  if (clientTransaction) {
                    if (
                      text.toUpperCase() != clientTransaction.name.toUpperCase()
                    ) {
                      setClientTransaction("");
                      setMethods_transaction([]);
                    }
                  }
                  setNameClientTransaction(text);
                  setClientsTransaction(
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
              >
                <Input
                  style={{ width: "100%", borderRadius: 2, paddingLeft: 8 }}
                />
              </AutoComplete>
            </ViewInput>
          )}
          <ViewInput>
            <p>
              {operation == "transferencia" ? "Caixa para retirar" : "Caixa"}
            </p>
            <Select
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                borderWidth: 0,
                color: "#001B22",
                fontSize: 14,
                borderRadius: 2,
                fontWeight: "400",
              }}
              placeholder="selecionar caixa"
              options={[
                { value: "clube", label: "Clube" },
                { value: "dealer", label: "Dealer" },
                { value: "passport", label: "Passport" },
                { value: "jackpot", label: "Jackpot" },
                ...(operation == "transferencia" ? banks : []),
              ]}
              value={typeNew}
              onChange={(type) => setTypeNew(type)}
            />
          </ViewInput>
          {operation == "transferencia" && (
            <ViewInput>
              <p>Caixa para receber</p>
              <Select
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  borderWidth: 0,
                  color: "#001B22",
                  fontSize: 14,
                  borderRadius: 2,
                  fontWeight: "400",
                }}
                placeholder="selecionar caixa"
                options={[
                  { value: "clube", label: "Clube" },
                  { value: "dealer", label: "Dealer" },
                  { value: "passport", label: "Passport" },
                  { value: "jackpot", label: "Jackpot" },
                  ...(operation == "transferencia" ? banks : []),
                ]}
                value={typeNewOut}
                onChange={(type) => setTypeNewOut(type)}
              />
            </ViewInput>
          )}
          <ViewInput>
            <p>Valor da Transação</p>
            <IntlCurrencyInput
              onChange={(event, value) => {
                setValue(value);
              }}
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                borderWidth: 0,
                color: "#001B22",
                padding: "8px",
                height: 35,
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
            />
          </ViewInput>
          {operation != "transferencia" ||
          (operation == "transferencia" &&
            !!typesTransaction[typeNew] != !!typesTransaction[typeNewOut] &&
            typeNewOut &&
            typeNew) ? (
            <ViewInput style={{ textAlign: "left" }}>
              <p>Métodos de pagamento</p>
              <MethodsPayment
                getMethods={getMethods}
                operation={operation}
                debt={
                  operation == "saida"
                    ? clientTransaction
                      ? clientTransaction.debt
                      : 0
                    : 0
                }
                receive={
                  operation == "entrada"
                    ? clientTransaction
                      ? clientTransaction.receive
                      : 0
                    : 0
                }
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
          ) : (
            <ViewInput>
              <p>Observação</p>
              <Input.TextArea
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  borderWidth: 0,
                  color: "#001B22",
                  padding: "8px",
                  height: 35,
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderStyle: "solid",
                  borderRadius: 2,
                  fontWeight: "400",
                  paddingLeft: 12,
                }}
                autoSize={{ maxRows: 4 }}
                placeholder="deixe uma observação"
                value={observation}
                onChange={(text) => {
                  setObservation(text.target.value);
                }}
              />
            </ViewInput>
          )}
        </div>
      </Modal>
      <Modal
        title="Editar Transação"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenEdit}
        okText="EDITAR PAGAMENTO"
        cancelText="FECHAR"
        onOk={() => {
          editTransaction();
        }}
        onCancel={() => {
          setIsOpenEdit(false);
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
              onChange={(event, value) => {
                setValue(value);
              }}
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                borderWidth: 0,
                color: "#001B22",
                padding: "8px",
                height: 35,
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
            />
          </ViewInput>

          <ViewInput>
            <p>Observação*</p>
            <Input.TextArea
              placeholder="observação"
              value={observation}
              style={{ minHeight: 60 }}
              onChange={(event) => setObservation(event.target.value)}
            />
          </ViewInput>
        </div>
      </Modal>
      <Modal
        title="Dados Transação"
        width={500}
        open={isOpenTransaction}
        okButtonProps={
          transaction.paid
            ? {
                style: {
                  display: "none",
                },
              }
            : {}
        }
        cancelText="FECHAR"
        okText="PAGAR TRANSAÇÃO"
        onOk={() => {
          setIsOpenTransaction(false);
          setIsOpenConfirm(true);
          setObservation(transaction.observation);
        }}
        onCancel={() => {
          setIsOpenTransaction(false);
        }}
      >
        {transaction.id && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginBottom: 25,
            }}
          >
            {!!transaction.client && (
              <>
                <h3 style={{ marginBottom: 2 }}>Cliente</h3>

                <h4 style={{ marginBottom: 1 }}>
                  Nome: {transaction.client.name}
                </h4>
                <h4 style={{ marginBottom: 1 }}>
                  CPF:{" "}
                  {transaction.client.cpf
                    ? transaction.client.cpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4",
                      )
                    : "Não cadastrado"}
                </h4>
                <h4 style={{ marginBottom: 1 }}>
                  Telefone:{" "}
                  {transaction.client.phone_number
                    ? transaction.client.phone_number.replace(
                        /(\d{2})(\d{5})(\d{4})/,
                        "($1) $2-$3",
                      )
                    : "Não cadastrado"}
                </h4>
                <h4 style={{ marginBottom: 1 }}>
                  Endereço: {transaction.client.address || "Não cadastrado"}
                </h4>
                <h4
                  style={{ marginTop: 1, fontWeight: "bold", color: "#1eb019" }}
                >
                  Valor à receber:{" "}
                  {transaction.client.receive.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h4>
                <h4
                  style={{
                    marginTop: -5,
                    fontWeight: "bold",
                    color: "#d63211",
                  }}
                >
                  Valor à pagar:{" "}
                  {transaction.client.debt.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h4>
                <h4 style={{ marginTop: -5, fontWeight: "bold" }}>
                  Crédito:{" "}
                  {transaction.client.credit.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h4>
                <h4
                  style={{
                    marginTop: -5,
                    marginBottom: 7,
                    fontWeight: "bold",
                    color:
                      transaction.client.debt == transaction.client.receive
                        ? "#000"
                        : transaction.client.debt > transaction.client.receive
                          ? "#d63211"
                          : "#1eb019",
                  }}
                >
                  Saldo:{" "}
                  {(
                    transaction.client.receive - transaction.client.debt
                  ).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h4>

                <h3 style={{ marginBottom: 5 }}>Transação</h3>
              </>
            )}

            <h4 style={{ marginBottom: 1 }}>
              Valor Total: {getValue(transaction.value)}
            </h4>
            <h4 style={{ marginBottom: 1 }}>
              {transaction.paid
                ? "Totalmente pago"
                : transaction.value_paid
                  ? `Parcialmente pago ( ${getValue(transaction.value_paid)} )`
                  : "Não Pago"}
            </h4>
            <h4 style={{ marginBottom: 1 }}>
              {transaction.paid ? "Pago dia " : "Será paga dia"}{" "}
              {format(new Date(transaction.date_payment), "dd/MM/yyyy")}
            </h4>
            <h4>
              Observação: {transaction.observation || "Nenhum observação"}
            </h4>
            <h3>Métodos de pagamento</h3>
            {!transaction.paid && (
              <h4 style={{ marginBottom: 2 }}>
                Falta pagar o Crédito no valor de{" "}
                {getValue(transaction.value - transaction.value_paid)}
              </h4>
            )}
            {transaction.methods_transaction.map((item) => {
              return (
                <h4 style={{ marginBottom: 2 }}>
                  Pago por {item.name} o valor de {getValue(item.value)}
                </h4>
              );
            })}
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default Caixa;
