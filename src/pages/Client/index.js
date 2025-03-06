import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  InputTel,
  Transaction,
  Table,
  Title,
  ViewInput,
} from "./styles";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import {
  MdAddPhotoAlternate,
  MdEdit,
  MdMonetizationOn,
  MdVisibility,
} from "react-icons/md";
import { toast } from "react-toastify";
import { Button, Checkbox, Input, Modal, Pagination } from "antd";
import IntlCurrencyInput from "react-intl-currency-input";
import api from "../../services/api";
import MethodsPayment from "../../components/MethodsPayment";
import { getValue } from "../../services/functions";

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
  vaga: "Vaga",
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

const Client = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [page, setPage] = useState(0);
  const [transaction, setTransaction] = useState({});
  const [transactions, setTransactions] = useState(0);
  const [transactionsPending, setTransactionsPending] = useState([]);
  const [valueTotal, setValueTotal] = useState(0);
  const [valueTotalComand, setValueTotalComand] = useState(0);
  const { id } = useParams();
  const [client, setClient] = useState({});
  const [methods_transaction, setMethods_transaction] = useState([]);
  const [observation, setObservation] = useState("");
  const [datePayment, setDatePayment] = useState("");
  const [getMethods, setGetMethods] = useState([]);
  const [visibleModalVacancy, setVisibleModalVacancy] = useState(false);
  const [vacancy, setVacancy] = useState({});
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [credit, setCredit] = useState(0);
  const [photo, setPhoto] = useState("");
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenPay, setIsOpenPay] = useState(false);
  const [isOpenPayComand, setIsOpenPayComand] = useState(false);
  const [transactionsComand, setTransactionsComand] = useState([]);
  const [isOpenTransaction, setIsOpenTransaction] = useState(false);

  async function loadClient() {
    await api
      .get(`/client/${id}?page=${page}`)
      .then((response) => {
        setClient(response.data.client);
        setTransactions(response.data.transactionsTotal);
        setIsLoading(false);
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
    await api
      .get(`/transactions-pending/${id}`)
      .then((response) => {
        let { transactions, total } = response.data;
        setValueTotal(total);
        setTransactionsPending(transactions);
      })
      .catch(({ response }) => {
        setValueTotal(0);
        setTransactionsPending([]);
        if (response) {
          if (response.data) {
            if (!response.data.message) {
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
    loadMethods();
    loadClient();
  }, []);

  useEffect(() => {
    setMethods_transaction([]);
    setDatePayment("");
    setObservation("");
  }, [transaction]);

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

  async function editClient() {
    setIsLoadingModal(true);
    if (!name) {
      toast.warning("Nome é obrigatório");
    } else {
      if (phone_number) {
        if (phone_number.length != 11) {
          toast.warn("Telefone inválido");
          setIsLoadingModal(false);
          return "";
        }
      }

      if (cpf) {
        if (cpf.length != 11) {
          toast.warn("CPF inválido");
          setIsLoadingModal(false);
          return "";
        }
      }
      const data = new FormData();
      data.append("name", name);
      data.append("address", address);
      data.append("cpf", cpf);
      data.append("credit", credit);
      data.append("observation", "");
      data.append("phone_number", phone_number);
      if (photo.name) {
        data.append("file", photo, photo.name);
      }
      await api
        .put(`/client/${id}`, data)
        .then((response) => {
          toast.success("Cliente editado com sucesso");
          setIsOpenEdit(false);
          loadClient();
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

  async function confirmTransaction() {
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
        observation: observation,
        date_payment: datePayment,
      })
      .then(() => {
        loadClient();
        toast.success("Pagamento realizado com sucesso");
        setIsOpenConfirm();
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

  async function payTransactions() {
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
        valueTotal <
        methods_transaction
          .map((method) => method["value"])
          .reduce((total, value) => total + value)
      ) {
        toast.warn("Valor restante não pode ser negativo");
        setIsLoadingModal(false);
        return "";
      }
    } else {
      toast.warn("Selecione o método de pagamento e o valor");
      setIsLoadingModal(false);
      return "";
    }

    await api
      .put(`/transactions-pending/${client.id}`, {
        methods_transaction: methods_transactionC,
        client_id: id,
        observation: observation,
        date_payment: datePayment,
      })
      .then(() => {
        loadClient();
        setIsOpenPay(false);
        toast.success("Pagamento realizado com sucesso");
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

  async function payTransactionsComand() {
    if (!transactionsComand.length) {
      toast.warn("Selecione pelo mentos uma transalçao");
      setIsLoadingModal(false);
      return "";
    }
    if (methods_transaction.length) {
      if (
        methods_transaction.filter((item) => !item.id || !item.value).length
      ) {
        toast.warn("Selecione o método de pagamento e o valor");
        setIsLoadingModal(false);
        return "";
      }
      if (
        transactionsComand.reduce(
          (acc, item) => acc + (item.value - item.value_paid),
          0
        ) <
        methods_transaction
          .map((method) => method["value"])
          .reduce((total, value) => total + value)
      ) {
        toast.warn("Valor restante não pode ser negativo");
        setIsLoadingModal(false);
        return "";
      } else {
        if (
          transactionsComand.reduce(
            (acc, item) => acc + (item.value - item.value_paid),
            0
          ) !=
          methods_transaction
            .map((method) => method["value"])
            .reduce((total, value) => total + value)
        ) {
          toast.warn("Valor de pagamento diferente do valor da divida");
          setIsLoadingModal(false);
          return "";
        }
      }
    } else {
      toast.warn("Selecione o método de pagamento e o valor");
      setIsLoadingModal(false);
      return "";
    }

    await api
      .put(`/transactions-comand/${client.id}`, {
        methods_transaction: methods_transaction,
        transactions: transactionsComand,
        client_id: id,
        observation: observation,
        date_payment: datePayment,
      })
      .then(() => {
        loadClient();
        setIsOpenPayComand(false);
        toast.success("Pagamento realizado com sucesso");
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

  async function rescueVacancy() {
    setIsLoadingModal(true);
    if (!vacancy?.id) {
      toast.warn("Selecione a vaga");
    } else {
      await api
        .put(`/rescue/vacancy/${vacancy.id}`, {
          client_id: vacancy.client_id,
        })
        .then((response) => {
          loadClient();
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
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Title>
            <h2>Dados do Cliente</h2>
            <div>
              {!!valueTotal && (
                <Button
                  type="primary"
                  onClick={() => {
                    setMethods_transaction([
                      {
                        name: "",
                        value: 0,
                        percentage: 0,
                      },
                    ]);
                    setTransactionsComand([]);
                    setIsOpenPayComand(true);
                  }}
                >
                  <MdMonetizationOn size="20" color="#fff" />
                  <span>Fechar Comanda</span>
                </Button>
              )}
              {!!valueTotal && (
                <Button
                  type="primary"
                  onClick={() => {
                    setMethods_transaction([
                      {
                        name: "",
                        value: 0,
                        percentage: 0,
                      },
                    ]);
                    setIsOpenPay(true);
                  }}
                >
                  <MdMonetizationOn size="20" color="#fff" />
                  <span>Pagar Dívida</span>
                </Button>
              )}
              <Button
                type="primary"
                onClick={() => {
                  setName(client.name);
                  setPhone_number(client.phone_number);
                  setCpf(client.cpf);
                  setAddress(client.address);
                  setCredit(client.credit);
                  setPhoto({ photo_url: client.photo });
                  setIsOpenEdit(true);
                }}
              >
                <MdEdit size="20" color="#fff" />
                <span>Editar Cliente</span>
              </Button>
            </div>
          </Title>
          <img
            style={{
              width: 120,
              height: 120,
              marginBottom: 15,
              borderRadius: 2,
            }}
            src={
              client.photo_url ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
            }
          />
          <div style={{ display: "flex" }}>
            <div style={{ width: 300 }}>
              <h3>Nome: {client.name}</h3>
              <h3>
                CPF:{" "}
                {client.cpf
                  ? client.cpf.replace(
                      /(\d{3})(\d{3})(\d{3})(\d{2})/,
                      "$1.$2.$3-$4"
                    )
                  : "Não cadastrado"}
              </h3>
              <h3>
                Telefone:{" "}
                {client.phone_number
                  ? client.phone_number.replace(
                      /(\d{2})(\d{5})(\d{4})/,
                      "($1) $2-$3"
                    )
                  : "Não cadastrado"}
              </h3>
              <h3>Endereço: {client.address || "Não cadastrado"}</h3>
              <h3
                style={{ marginTop: 12, fontWeight: "bold", color: "#1eb019" }}
              >
                Valor à receber:{" "}
                {client.receive.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
              <h3
                style={{ marginTop: 12, fontWeight: "bold", color: "#d63211" }}
              >
                Valor à pagar:{" "}
                {client.debt.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
              <h3 style={{ marginTop: 12, fontWeight: "bold" }}>
                Crédito:{" "}
                {client.credit.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>

              <h3
                style={{
                  marginTop: 12,
                  fontWeight: "bold",
                  color:
                    client.debt == client.receive
                      ? "#000"
                      : client.debt > client.receive
                      ? "#d63211"
                      : "#1eb019",
                }}
              >
                Saldo:{" "}
                {(client.receive - client.debt || 0).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </div>
            <div
              style={{
                width: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!!client?.vacancys.length && (
                <>
                  <p>{client?.vacancys.length} vagas</p>
                  {client?.vacancys.map((item, idx) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "center",
                          marginTop: 5,
                        }}
                      >
                        <p
                          style={{
                            width: item.rescue ? "auto" : "80px",
                            fontSize: item.rescue ? "12px" : "16px",
                          }}
                        >
                          Vaga {idx + 1}:{" "}
                          {item.rescue &&
                            `Resgatada dia ${format(
                              new Date(item.date_rescue),
                              "dd/MM/yyyy HH:mm"
                            )}`}
                        </p>
                        {!item.rescue && (
                          <Button
                            type="primary"
                            onClick={() => {
                              setVacancy(item);
                              setVisibleModalVacancy(true);
                            }}
                            style={{
                              width: 100,
                              height: 20,
                              margin: 0,
                              fontSize: 10,
                            }}
                          >
                            <span>Resgatar Vaga</span>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {client.transactions.length ? (
            <>
              <Table>
                <tbody>
                  {client.transactions.map((transaction) => (
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
                            transaction.operation != "entrada"
                              ? "#d63211"
                              : "#1eb019",
                        }}
                      >
                        {transaction.value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {transaction.paid
                          ? "Pago"
                          : transaction.value_paid
                          ? `Falta pagar ${getValue(
                              transaction.value - transaction.value_paid
                            )}`
                          : "Não Pago"}
                      </td>
                      <td>
                        {format(
                          new Date(transaction.create_at),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        {!transaction.paid && transaction.method != "clube" && (
                          <MdMonetizationOn
                            onClick={() => {
                              setTransaction(transaction);
                              setIsOpenConfirm(true);
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
                {client.transactions.length != 0 && (
                  <thead>
                    <tr>
                      <td>Tipo</td>
                      <td>Valor</td>
                      <td>Status</td>
                      <td>Data</td>
                      <td style={{ width: 50 }}></td>
                    </tr>
                  </thead>
                )}
              </Table>
              <center style={{ marginTop: 15 }}>
                <Pagination
                  simple
                  defaultCurrent={page + 1}
                  onChange={(page) => {
                    setPage(page - 1);
                  }}
                  total={transactions}
                  pageSize={30}
                  showTotal={(total) => `${total} transações`}
                />
              </center>
            </>
          ) : (
            <div className="error">
              <p>Nenhuma transação encontrada</p>
            </div>
          )}
        </>
      )}

      <Modal
        title="Confirmar Pagamento"
        width={500}
        open={isOpenConfirm}
        confirmLoading={isLoadingModal}
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
              debt={transaction.operation == "saida" ? client.debt : 0}
              receive={transaction.operation == "entrada" ? client.receive : 0}
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
                  })
                );
              }}
            />
          </ViewInput>
        </div>
      </Modal>
      <Modal
        title="Editar Cliente"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenEdit}
        okText="EDITAR CLIENTE"
        cancelText="FECHAR"
        onOk={() => {
          editClient();
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
          <div
            style={{
              marginTop: 0,
              display: "flex",
              width: "100%",
              alignItems: "end",
              height: 120,
              borderRadius: 10,
              marginBottom: 25,
              marginBottom: 20,
              justifyContent: "center",
            }}
          >
            <img
              style={{
                width: 120,
                marginLeft: 50,
                height: 120,
                borderRadius: 10,
                background: "#fff",
              }}
              src={
                photo.photo_url
                  ? photo.photo_url
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
              }
            />
            <button
              style={{
                width: 50,
                height: 50,
                background: "transparent",
              }}
            >
              <label
                for="avatar"
                style={{
                  display: "flex",
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <MdAddPhotoAlternate color="#001B22" size={25} />
                <input
                  id="avatar"
                  style={{ display: "none" }}
                  type="file"
                  accept="image/"
                  onChange={(file) => {
                    let photo = file.target.files[0];
                    photo.photo_url = URL.createObjectURL(file.target.files[0]);
                    setPhoto(photo);
                  }}
                />
              </label>
            </button>
          </div>
          <ViewInput>
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>CPF*</p>
            <InputTel
              mask="999.999.999-99"
              maskChar=""
              noSpaceBetweenChars={true}
              placeholder="cpf"
              value={cpf}
              onChange={(event) =>
                setCpf(event.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </ViewInput>
          <ViewInput>
            <p>Endereço*</p>
            <Input
              placeholder="endereço"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Telefone*</p>
            <InputTel
              mask="(99) 99999-9999"
              maskChar=""
              noSpaceBetweenChars={true}
              value={phone_number}
              placeholder={"telefone"}
              style={{}}
              onChange={(text) => {
                setPhone_number(text.target.value.replace(/[^0-9]/g, ""));
              }}
            />
          </ViewInput>
          <ViewInput>
            <p>Crédito ( Sugestão de R$ 500,00 )</p>
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
              value={credit}
              onChange={(event, value) => setCredit(value)}
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
            <h4 style={{ marginBottom: 2 }}>
              Valor Total: {getValue(transaction.value)}
            </h4>
            <h4 style={{ marginBottom: 2 }}>
              {transaction.paid
                ? "Totalmente pago"
                : transaction.value_paid
                ? `Parcialmente pago ( ${getValue(transaction.value_paid)} )`
                : "Não Pago"}
            </h4>
            <h4 style={{ marginBottom: 2 }}>
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
      <Modal
        title="Pagamento de Dívida"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenPay}
        okText="CONFIRMAR PAGAMENTO"
        cancelText="FECHAR"
        onOk={() => {
          payTransactions();
        }}
        onCancel={() => {
          setIsOpenPay(false);
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
            Divida atual do cliente:{" "}
            <h3
              style={{ fontWeight: "bold", color: "#d63211", marginBottom: 0 }}
            >
              {valueTotal &&
                valueTotal.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
            </h3>
          </p>
          <p>Total de {transactionsPending.length} pendentes de pagamento</p>
          <ViewInput style={{ textAlign: "left", marginTop: 10 }}>
            <p>Métodos de pagamento</p>
            <MethodsPayment
              getMethods={getMethods}
              operation={"entrada"}
              disableCredit={true}
              debt={0}
              receive={client.receive || 0}
              methodsPayment={methods_transaction}
              value={valueTotal}
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
        title={"Resgatar Vaga"}
        width={500}
        confirmLoading={isLoadingModal}
        open={visibleModalVacancy}
        okText={"CONFIRMAR"}
        cancelText="FECHAR"
        onOk={() => {
          rescueVacancy();
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
            <span>{`Após o resgate, esse valor ficará disponivel no seu saldo`}</span>
          </ViewInput>
        </div>
      </Modal>
      <Modal
        title="Fechar Comanda"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenPayComand}
        okText="CONFIRMAR PAGAMENTO"
        cancelText="FECHAR"
        onOk={() => {
          payTransactionsComand();
        }}
        onCancel={() => {
          setIsOpenPayComand(false);
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
            Divida total do cliente:{" "}
            <h3
              style={{ fontWeight: "bold", color: "#d63211", marginBottom: 0 }}
            >
              {valueTotal &&
                valueTotal.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
            </h3>
          </p>
          <p>Total de {transactionsPending.length} pendentes de pagamento</p>
          {transactionsPending?.length != 0 && (
            <Transaction style={{ marginTop: 10 }}>
              <p>Tipo</p>
              <p>Valor</p>
              <p>Status</p>
              <p>Data</p>
              <p style={{ maxWidth: 50 }}>Pagar?</p>
            </Transaction>
          )}
          {transactionsPending.map((transaction) => (
            <Transaction key={transaction.id}>
              <p>
                {transaction.items_transaction.map((item, index) => {
                  return index == 0
                    ? types[item.name] || item.name
                    : " , " + types[item.name] || item.name;
                })}
              </p>
              <p
                style={{
                  color:
                    transaction.operation != "entrada" ? "#d63211" : "#1eb019",
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
                      transaction.value - transaction.value_paid
                    )}`
                  : "Não Pago"}
              </p>
              <p style={{ fontSize: 10 }}>
                {format(new Date(transaction.create_at), "dd/MM/yyyy HH:mm")}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Checkbox
                  checked={transactionsComand.some(
                    (item) => item.id === transaction.id
                  )}
                  onChange={() => {
                    let transactionsComandC = [...transactionsComand];
                    if (
                      transactionsComand.some(
                        (item) => item.id === transaction.id
                      )
                    ) {
                      transactionsComandC = transactionsComandC.filter(
                        (item) => item.id !== transaction.id
                      );
                      setTransactionsComand(transactionsComandC);
                    } else {
                      transactionsComandC.push(transaction);
                      setTransactionsComand(transactionsComandC);
                    }
                  }}
                />
              </div>
            </Transaction>
          ))}
          Total a pagar:{" "}
          <h3 style={{ fontWeight: "bold", color: "#d63211", marginBottom: 0 }}>
            {(
              transactionsComand.reduce(
                (acc, item) => acc + (item.value - item.value_paid),
                0
              ) || 0
            ).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <ViewInput style={{ textAlign: "left", marginTop: 10 }}>
            <p>Métodos de pagamento</p>
            <MethodsPayment
              getMethods={getMethods}
              disableCredit={true}
              operation={"entrada"}
              debt={0}
              receive={client.receive || 0}
              methodsPayment={methods_transaction}
              value={
                transactionsComand.reduce(
                  (acc, item) => acc + (item.value - item.value_paid),
                  0
                ) || 0
              }
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

export default Client;
