import React, { useEffect, useState } from "react";

import api from "../../services/api";
import {
  Container,
  Filters,
  Title,
  Table,
  SearchBar,
  DateInputBox,
} from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

import { addDays, format } from "date-fns";
import { getValue } from "../../services/functions";
import { Button, DatePicker, Modal, Select, TimePicker } from "antd";
import dayjs from "dayjs";

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(localeData);

import "moment/locale/pt-br";
import locale from "antd/es/date-picker/locale/pt_BR";

import { SearchOutlined } from "@ant-design/icons";
import { MdVisibility } from "react-icons/md";

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
  "torneio-add-on": "Torneio (ADD ON)",
  "torneio-super-add-on": "Torneio (Super ADD ON)",
};

const Relatorios = () => {
  const [club, setClub] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [report, setReport] = useState(null);
  const [type, setType] = useState("");
  const [method, setMethod] = useState("");
  const [setor, setSetor] = useState("");
  const [setor_id, setSetor_id] = useState("");
  const [dateInitial, setDateInitial] = useState(addDays(new Date(), -30));
  const [dateEnd, setDateEnd] = useState(new Date());
  const [transaction, setTransaction] = useState({});
  const [isOpenTransaction, setIsOpenTransaction] = useState(false);

  const [getMethods, setGetMethods] = useState([]);
  const [cashs, setCashs] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    loadCashs();
    loadTournaments();
    loadMethods();
  }, []);
  let value = 0;
  async function loadMethods() {
    await api
      .get("/methods?all=true")
      .then((response) => {
        let methods = response.data;
        methods.map((item) => {
          item.value = item.name;
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
    setIsLoading(false);
  }

  async function loadTournaments() {
    await api
      .get("/tournaments?all=true")
      .then((response) => {
        let tournaments = response.data.tournaments;
        tournaments.map((item) => {
          item.value = item.id;
          item.label = item.name;
        });
        setTournaments(tournaments);
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

  async function loadCashs() {
    await api
      .get("/cashs?all=true")
      .then((response) => {
        let cashs = response.data.cashs;
        cashs.map((item) => {
          item.value = item.id;
          item.label = item.name;
        });
        setCashs(cashs);
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

  async function getReports() {
    setIsLoadingReport(true);
    if (setor == "cash" || setor == "torneio") {
      if (!setor_id) {
        toast.warn(
          setor == "cash"
            ? "Selecione a sessão cash para continuar"
            : "Selecione o torneio para continuar"
        );
        setIsLoadingReport(false);
        return "";
      }
    }
    await api
      .post("/reports", {
        sector: setor,
        type: type,
        sector_id: setor_id,
        method: method,
        date_initial: dateInitial,
        date_end: dateEnd,
      })
      .then((response) => {
        let compras = {};
        response.data.transactions.map((item) => {
          if (compras[item.items_transaction[0].name]) {
            compras[item.items_transaction[0].name]++;
          } else {
            compras[item.items_transaction[0].name] = 1;
          }
        });
        console.log(compras);
        setReport(response.data);
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
    setIsLoadingReport(false);
  }

  function clearSearch() {
    setSetor("");
    setMethod("");
    setType("");
    setSetor_id("");
    setDateInitial(addDays(new Date(), -30));
    setDateEnd(new Date());
  }

  return (
    <Container>
      <Title>
        <h2>Relátorios</h2>
      </Title>
      {!isLoading && (
        <>
          <Filters>
            <SearchBar>
              <DateInputBox>
                <label>Setor</label>
                <Select
                  style={{
                    minWidth: 250,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                  placeholder="tipo de relatorio"
                  value={setor || null}
                  options={[
                    { label: "Cash", value: "cash" },
                    { label: "Torneio", value: "torneio" },
                    { label: "Bar", value: "bar" },
                    { label: "Financeiro", value: "financeiro" },
                  ]}
                  onChange={(setor) => {
                    setSetor(setor);
                    setSetor_id("");
                  }}
                />
              </DateInputBox>
              {(setor == "cash" || setor == "torneio") && (
                <DateInputBox>
                  <label>
                    Selecione {setor == "cash" ? "a sessão cash" : "o torneio"}
                  </label>
                  <Select
                    style={{
                      minWidth: 250,
                      height: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                    }}
                    placeholder="selecione"
                    options={setor == "cash" ? cashs : tournaments}
                    value={setor_id || null}
                    onChange={(setor_id) => setSetor_id(setor_id)}
                  />
                </DateInputBox>
              )}
              <DateInputBox>
                <label>Tipo de Transação</label>
                <Select
                  style={{
                    minWidth: 150,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                  options={[
                    { label: "Todas", value: "" },
                    { label: "Entrada", value: "entrada" },
                    { label: "Saida", value: "saida" },
                  ]}
                  value={type}
                  onChange={(type) => {
                    setType(type);
                    setMethod("");
                  }}
                />
              </DateInputBox>
              <DateInputBox>
                <label>Método de Pagamento</label>
                <Select
                  placeholder="meio de pagamento"
                  style={{
                    minWidth: 250,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                  options={[
                    { value: "", label: "Todos" },
                    { value: "nao-pago", label: "Não Pago" },
                    { value: "Saldo", label: "Saldo" },
                    {
                      value: "Pagamento de Dívida",
                      label: "Pagamento de Dívida",
                    },
                    ...getMethods,
                  ]}
                  value={method}
                  onChange={(method) => setMethod(method)}
                />
              </DateInputBox>
              {(setor == "bar" || setor == "financeiro") && (
                <>
                  <DateInputBox>
                    <label>Data Inicial</label>
                    <DatePicker
                      placeholder="data inicial"
                      format={"DD/MM/YYYY"}
                      value={dateInitial ? dayjs(dateInitial) : ""}
                      style={{
                        minWidth: 220,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 8,
                      }}
                      onChange={(date, d) => setDateInitial(date)}
                    />
                  </DateInputBox>
                  <DateInputBox>
                    <label>Horário Inicial</label>
                    <TimePicker
                      placeholder="horário inicial"
                      format={"HH:mm"}
                      value={dateInitial ? dayjs(dateInitial) : ""}
                      style={{
                        minWidth: 220,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 8,
                      }}
                      onChange={(date, d) => setDateInitial(date)}
                    />
                  </DateInputBox>
                  <DateInputBox>
                    <label>Data Final</label>
                    <DatePicker
                      locale={locale}
                      placeholder="data final"
                      format={"DD/MM/YYYY"}
                      minDate={dayjs(dateInitial)}
                      value={dateEnd ? dayjs(dateEnd) : ""}
                      style={{
                        minWidth: 220,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 8,
                      }}
                      onChange={(date, d) => setDateEnd(date)}
                    />
                  </DateInputBox>
                  <DateInputBox>
                    <label>Horário Final</label>
                    <TimePicker
                      placeholder="horário final"
                      format={"HH:mm"}
                      minDate={dayjs(dateInitial)}
                      value={dateEnd ? dayjs(dateEnd) : ""}
                      style={{
                        minWidth: 220,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 8,
                      }}
                      onChange={(date, d) => setDateEnd(date)}
                    />
                  </DateInputBox>
                </>
              )}
              <Button
                icon={<SearchOutlined />}
                style={{ margin: 4, marginLeft: 20, marginBottom: 12 }}
                type="primary"
                onClick={() => {
                  getReports();
                }}
              >
                Buscar
              </Button>

              <Button
                type="link"
                style={{ margin: 4, marginLeft: 20, marginBottom: 12 }}
                onClick={() => {
                  clearSearch();
                }}
              >
                Limpar Busca
              </Button>
            </SearchBar>
          </Filters>
          {report && (
            <>
              {report.transactions.length ? (
                <>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <p className="data">
                      Total em Transações:{" "}
                      {getValue(report.totalIn + report.totalOut)}
                    </p>
                    <p className="data">
                      Total Entradas: {getValue(report.totalIn)}
                    </p>
                    <p className="data">
                      Total Saidas: {getValue(report.totalOut)}
                    </p>
                    <p className="data">
                      Saldo: {getValue(report.totalIn - report.totalOut)}
                    </p>
                    {report.methodsIn.filter((item) => item.value).length !=
                      0 && <h4>Métodos de Pagamento Entradas</h4>}
                    {report.methodsIn.map((item) => {
                      if (item.value) {
                        return (
                          <p className="data">
                            {item.name}: {getValue(item.value)}
                          </p>
                        );
                      }
                    })}
                    {report.methodsOut.filter((item) => item.value).length !=
                      0 && <h4>Métodos de Pagamento Saidas</h4>}
                    {report.methodsOut.map((item) => {
                      if (item.value) {
                        return (
                          <p className="data">
                            {item.name}: {getValue(item.value)}
                          </p>
                        );
                      }
                    })}
                  </div>
                  <Table>
                    <thead>
                      <tr>
                        <td>Cliente</td>
                        <td>Tipo</td>
                        <td>Valor</td>
                        <td>Método de Pagamento</td>
                        <td>Data</td>
                        <td style={{ width: 50 }}></td>
                      </tr>
                    </thead>
                    <tbody>
                      {report.transactions.map((transaction) => {
                        return (
                          <tr key={transaction.id}>
                            <td>{transaction.client?.name}</td>
                            <td>
                              {transaction.items_transaction.map(
                                (item, index) => {
                                  return index == 0
                                    ? item.name || ""
                                    : item.name
                                    ? " , " + item.name
                                    : "";
                                }
                              )}
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
                            <td>
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
                        );
                      })}
                    </tbody>
                  </Table>
                </>
              ) : (
                <div className="error">
                  <p>Nenhuma transação encontrada nesse filtro</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {isLoading && <Loader />}

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
          // setIsOpenConfirm(true);
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
    </Container>
  );
};

export default Relatorios;
