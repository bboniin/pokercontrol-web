import React, { useEffect, useState } from "react";
import {
  MdAccountBalance,
  MdAdd,
  MdMonetizationOn,
  MdVisibility,
} from "react-icons/md";

import api from "../../services/api";
import { Container, Cards, Card, Table, Title, ViewInput } from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  Input,
  Pagination,
  DatePicker,
  TimePicker,
  Select,
  Switch,
  AutoComplete,
} from "antd";
import IntlCurrencyInput from "react-intl-currency-input";

import { SearchOutlined } from "@ant-design/icons";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { getValue } from "../../services/functions";
import MethodsPayment from "../../components/MethodsPayment";
import { GiCardJackDiamonds, GiCoffeeCup } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa";
import { Filters, DateInputBox, SearchBar } from "./../Relatorios/styles";
import dayjs from "dayjs";

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(localeData);

import "moment/locale/pt-br";
import locale from "antd/es/date-picker/locale/pt_BR";

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

const Financeiro = () => {
  const [club, setClub] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [name, setName] = useState(false);
  const [value, setValue] = useState(0);
  const [observation, setObservation] = useState("");
  const [observationSearch, setObservationSearch] = useState("");
  const [typeNew, setTypeNew] = useState("clube");
  const [operation, setOperation] = useState("entrada");
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [page, setPage] = useState(0);
  const [operationFilter, setOperationFilter] = useState("");
  const [select, setSelect] = useState("club");
  const [filterSelect, setFilterSelect] = useState({});
  const [filter, setFilter] = useState({});
  const [dateInitial, setDateInitial] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [clients, setClients] = useState([]);
  const [clientsTransaction, setClientsTransaction] = useState([]);
  const [clientsC, setClientsC] = useState([]);
  const [client, setClient] = useState("");
  const [nameClient, setNameClient] = useState("");
  const [clientTransaction, setClientTransaction] = useState("");
  const [nameClientTransaction, setNameClientTransaction] = useState("");
  const [isOpenTransaction, setIsOpenTransaction] = useState(false);
  const [methods_transaction, setMethods_transaction] = useState([]);
  const [datePayment, setDatePayment] = useState("");
  const [getMethods, setGetMethods] = useState([]);

  useEffect(() => {
    loadMethods();
    loadClients();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadFinanceiro(filter);
  }, [page, filterSelect, filter]);

  useEffect(() => {
    setMethods_transaction([]);
    setDatePayment("");
    setObservation("");
  }, [transaction, isOpenNew]);

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

  async function loadFinanceiro(filter) {
    await api
      .post(`/finance`, { page, filter: { ...filter, ...filterSelect } })
      .then((response) => {
        setClub(response.data);
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

  async function confirmTransaction() {
    setIsLoadingModal(true);

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
        date_payment: datePayment,
        observation: observation,
      })
      .then(() => {
        loadFinanceiro();
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
          loadFinanceiro();
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
        <h2>Financeiro</h2>
        <div>
          {!isLoading && club && (
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
          )}
        </div>
      </Title>

      {!isLoading && club && (
        <>
          <Cards>
            <Card
              select={select == "club"}
              onClick={() => {
                setSelect("club");
                setFilterSelect({});
              }}
            >
              <div className="icon">
                <MdAccountBalance size={32} />
              </div>
              <div className="number">
                <span>{getValue(club.balance)}</span>
                <p>Caixa do Clube</p>
              </div>
            </Card>
            <Card
              select={select == "a receber"}
              onClick={() => {
                setSelect("a receber");
                setFilterSelect({
                  operation: "entrada",
                  paid: false,
                });
              }}
            >
              <div className="icon">
                <MdAccountBalance size={32} />
              </div>
              <div className="number">
                <span>{getValue(club.transactionsTotalReceive)}</span>
                <p>À Receber</p>
              </div>
            </Card>
            <Card
              select={select == "a pagar"}
              onClick={() => {
                setSelect("a pagar");
                setFilterSelect({
                  operation: "saida",
                  paid: false,
                });
              }}
            >
              <div className="icon">
                <MdAccountBalance size={32} />
              </div>
              <div className="number">
                <span>{getValue(club.transactionsTotalDebt)}</span>
                <p>À Pagar</p>
              </div>
            </Card>
            <Card
              select={select == "passport"}
              onClick={() => {
                setSelect("passport");
                setFilterSelect({
                  type: "passport",
                });
              }}
            >
              <div className="icon">
                <GiCoffeeCup size={32} />
              </div>
              <div className="number">
                <span>{getValue(club.passport)}</span>
                <p>Total Acumulado</p>
              </div>
            </Card>
            <Card
              select={select == "dealer"}
              onClick={() => {
                setSelect("dealer");
                setFilterSelect({
                  type: "dealer",
                });
              }}
            >
              <div className="icon">
                <FaUserTie size={32} />
              </div>
              <div className="number">
                <span>{getValue(club.dealer)}</span>
                <p>Total Acumulado</p>
              </div>
            </Card>
            <Card
              select={select == "jackpot"}
              onClick={() => {
                setSelect("jackpot");
                setFilterSelect({
                  type: "jackpot",
                });
              }}
            >
              <div className="icon">
                <GiCardJackDiamonds size={32} />
              </div>
              <div className="number">
                <span>{getValue(club.jackpot)}</span>
                <p>Total Acumulado</p>
              </div>
            </Card>
          </Cards>
          <Filters>
            <SearchBar>
              <DateInputBox>
                <label>Cliente</label>
                <AutoComplete
                  style={{
                    minWidth: 220,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    marginLeft: -5,
                  }}
                  options={clients}
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
                >
                  <Input
                    style={{ minWidth: 260, borderRadius: 8, paddingLeft: 8 }}
                  />
                </AutoComplete>
              </DateInputBox>
              <DateInputBox>
                <label>Observação</label>
                <Input
                  style={{
                    minWidth: 220,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    marginLeft: -5,
                  }}
                  value={observationSearch}
                  onChange={(text) => {
                    setObservationSearch(text.target.value);
                  }}
                  placeholder="procurar por observação"
                />
              </DateInputBox>
              <DateInputBox>
                <label>Tipo de Transação</label>
                <Select
                  style={{
                    minWidth: 150,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                  }}
                  options={[
                    { label: "Todas", value: "" },
                    { label: "Entrada", value: "entrada" },
                    { label: "Saida", value: "saida" },
                  ]}
                  value={operationFilter}
                  onChange={(operationFilter) => {
                    setOperationFilter(operationFilter);
                  }}
                ></Select>
              </DateInputBox>
              <DateInputBox>
                <label>Data Inicial</label>
                <DatePicker
                  locale={locale}
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
                  onChange={(date) => setDateInitial(date)}
                />
              </DateInputBox>

              {dateInitial && (
                <DateInputBox>
                  <label>Horário Inicial</label>
                  <TimePicker
                    locale={locale}
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
                    onChange={(date) => setDateInitial(date)}
                  />
                </DateInputBox>
              )}

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
              {dateEnd && (
                <DateInputBox>
                  <label>Horário Final</label>
                  <TimePicker
                    locale={locale}
                    placeholder="horário final"
                    format={"HH:mm"}
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
              )}
              <div>
                <Button
                  disabled={
                    !dateEnd &&
                    !observationSearch &&
                    !operationFilter &&
                    !dateInitial &&
                    !client.id
                  }
                  icon={<SearchOutlined />}
                  style={{
                    margin: 4,
                    marginLeft: 20,
                    marginBottom: 12,
                    height: 38,
                    borderRadius: 8,
                  }}
                  type="primary"
                  onClick={() => {
                    setIsLoading(true);
                    let filter = {};
                    if (client.id) {
                      filter["client_id"] = client.id;
                    }
                    if (operationFilter) {
                      filter["operation"] = operationFilter;
                    }
                    if (observationSearch) {
                      filter["observation"] = { contains: observationSearch };
                    }
                    filter["AND"] = [];
                    if (dateInitial) {
                      filter["AND"].push({
                        create_at: {
                          gte: dateInitial,
                        },
                      });
                    }
                    if (dateEnd) {
                      filter["AND"].push({
                        create_at: {
                          lte: dateEnd,
                        },
                      });
                    }
                    setFilter(filter);
                  }}
                >
                  Buscar
                </Button>

                {(dateEnd ||
                  observationSearch ||
                  operationFilter ||
                  dateInitial ||
                  client) && (
                  <Button
                    type="link"
                    style={{ margin: 4, marginLeft: 20, marginBottom: 12 }}
                    onClick={() => {
                      setFilter({});
                      setClient("");
                      setObservationSearch("");
                      setNameClient("");
                      setClients(clientsC);
                      setDateEnd("");
                      setDateInitial("");
                      setPage(0);
                    }}
                  >
                    Limpar Busca
                  </Button>
                )}
              </div>
            </SearchBar>
          </Filters>
          {club.transactions.length ? (
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
                  {club.transactions.map((transaction) => (
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
              <center style={{ marginTop: 15 }}>
                <Pagination
                  simple
                  defaultCurrent={page + 1}
                  onChange={(page) => {
                    setPage(page - 1);
                  }}
                  total={club.transactionsTotal}
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

      {isLoading && <Loader />}
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
                  })
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
              onChange={(operation) => {
                setOperation(operation);
              }}
            />
          </ViewInput>

          <ViewInput>
            <p>Selecionar Cliente</p>
            <AutoComplete
              style={{
                width: "100%",
                height: 38,
                borderRadius: 2,
              }}
              options={clientsTransaction}
              value={clientTransaction ? clientTransaction.name : nameClientTransaction}
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
                  })
                );
              }}
              placeholder="procurar por nome"
            >
              <Input
                style={{ width: "100%", borderRadius: 2, paddingLeft: 8 }}
              />
            </AutoComplete>
          </ViewInput>
          <ViewInput>
            <p>Caixa</p>
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
                { value: "clube", label: "Clube" },
                { value: "dealer", label: "Dealer" },
                { value: "passport", label: "Passport" },
                { value: "jackpot", label: "Jackpot" },
              ]}
              value={typeNew}
              onChange={(type) => setTypeNew(type)}
            />
          </ViewInput>
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
                  })
                );
              }}
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
                        "$1.$2.$3-$4"
                      )
                    : "Não cadastrado"}
                </h4>
                <h4 style={{ marginBottom: 1 }}>
                  Telefone:{" "}
                  {transaction.client.phone_number
                    ? transaction.client.phone_number.replace(
                        /(\d{2})(\d{5})(\d{4})/,
                        "($1) $2-$3"
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

export default Financeiro;
