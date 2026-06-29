import React, { useEffect, useState } from "react";
import { MdAccountBalance, MdAdd, MdDelete, MdEdit } from "react-icons/md";

import IntlCurrencyInput from "react-intl-currency-input";

import api from "../../services/api";
import { Container, Cards, Card, Table, Title, ViewInput } from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Button, Modal, Input, Pagination } from "antd";
import { getValue } from "../../services/functions";
import { format } from "date-fns";
import { ExclamationCircleFilled } from "@ant-design/icons";

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

const Banks = () => {
  const [banks, setBanks] = useState([]);
  const [bank, setBank] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [page, setPage] = useState("");
  const [observation, setObservation] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  const [operation, setOperation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  useEffect(() => {
    loadBanks();
  }, []);

  useEffect(() => {
    if (bank.id) {
      loadTransactions(bank);
    }
  }, [bank]);

  async function loadTransactions(bank) {
    await api
      .get(`/bank/${bank.id}?page=${page}`)
      .then((response) => {
        setTransactions(response.data.transactions);
        setTransactionsTotal(response.data.transactionsTotal);
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

  async function loadBanks() {
    setIsLoading(true);
    await api
      .get("/banks")
      .then((response) => {
        setBanks(response.data);
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

  async function createBank() {
    setIsLoadingModal(true);
    if (!name) {
      toast.warning("Preencha o nome da conta");
    } else {
      await api
        .post(`/bank`, {
          name: name,
          balance: balance,
        })
        .then((response) => {
          toast.success("Conta bancária criada com sucesso");
          setIsOpen(false);
          loadBanks();
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

  async function editBank() {
    setIsLoadingModal(true);
    if (!name) {
      toast.warning("Preencha o nome da conta");
    } else {
      await api
        .put(`/bank/${bank.id}`, {
          name: name,
          balance: balance,
        })
        .then((response) => {
          toast.success("Conta bancária editada com sucesso");
          setIsOpen(false);
          loadBanks();
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

  async function deleteBank(bank) {
    await api
      .delete(`/bank/${bank.id}`)
      .then((response) => {
        toast.success("Conta bancária deletada com sucesso");
        loadBanks();
        setBank({});
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

  async function createTransaction() {
    setIsLoadingModal(true);
    if (!name || !value || !operation) {
      toast.warning("Preencha o nome, tipo e valor da transação");
    } else {
      await api
        .post(`/transaction/bank`, {
          name: name,
          value: value,
          operation: operation,
          bank_id: bank.id,
          observation: observation,
        })
        .then((response) => {
          toast.success("Conta bancária criada com sucesso");
          setIsOpenTransaction(false);
          loadBanks();
          loadTransactions(bank);
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
        <h2>Contas</h2>
        <div>
          <Button
            type="primary"
            onClick={() => {
              setBank({});
              setName("");
              setBalance("");
              setIsOpen(true);
            }}
          >
            <MdAdd size="20" color="#fff" />
            <span>Nova Conta</span>
          </Button>
          {bank.id && (
            <Button
              type="primary"
              onClick={() => {
                setValue("");
                setName("");
                setObservation("");
                setOperation("");
                setIsOpenTransaction(true);
              }}
            >
              <MdAdd size="20" color="#fff" />
              <span>Movimentação</span>
            </Button>
          )}
        </div>
      </Title>

      {!isLoading && (
        <>
          <Cards>
            {banks.map((item) => {
              return (
                <Card
                  select={bank.id == item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setBank(item);
                  }}
                >
                  <div className="icon">
                    <MdAccountBalance size={32} />
                  </div>
                  <div className="number">
                    <span>{getValue(item.balance)}</span>
                    <p>{item.name}</p>
                    <div
                      style={{
                        display: "flex",
                        marginTop: 5,
                      }}
                    >
                      <MdEdit
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setBalance(item.balance);
                          setName(item.name);
                          setIsOpen(true);
                        }}
                      />
                      <MdDelete
                        style={{ cursor: "pointer", marginLeft: 10 }}
                        type={operation == "saida" && "primary"}
                        onClick={() => {
                          confirm({
                            title: "Deseja excluir conta bancária?",
                            icon: <ExclamationCircleFilled />,
                            content: `Será excluido a conta de todas as transações dela`,
                            onOk() {
                              deleteBank(item);
                            },
                            onCancel() {},
                            cancelText: "Cancelar",
                          });
                        }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </Cards>
        </>
      )}
      {!banks.length && (
        <div className="error">
          <p>Nenhuma conta bancária encontrada</p>
        </div>
      )}
      {bank.id && (
        <>
          {!!transactions.length ? (
            <>
              <h3 style={{ marginTop: 15 }}>{transactionsTotal} transações</h3>
              <Table>
                <thead>
                  <tr>
                    <td>Tipo</td>
                    <td>Valor</td>
                    <td>Data</td>
                    <td>Observação</td>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td style={{ textTransform: "capitalize" }}>
                        {transaction.operation}
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
                        {format(
                          new Date(transaction.create_at),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </td>
                      <td>{transaction.observation || "Sem observação"}</td>
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
                  total={transactionsTotal}
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
        title="Conta Bancária"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpen}
        okText={bank.id ? "EDITAR CONTA" : "CADASTRAR CONTA"}
        cancelText="FECHAR"
        onOk={() => {
          if (bank.id) {
            editBank();
          } else {
            createBank();
          }
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
          <ViewInput>
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Balanço*</p>
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
              value={balance}
              onChange={(event, value) => setBalance(value)}
            />
          </ViewInput>
        </div>
      </Modal>

      <Modal
        title="Transação Conta Bancária"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenTransaction}
        okText={"CADASTRAR TRANSAÇÃO"}
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
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Tipo de Cobrança*</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                style={{ width: "49%" }}
                type={operation == "entrada" && "primary"}
                onClick={() => {
                  setOperation("entrada");
                }}
              >
                Entrada
              </Button>
              <Button
                style={{ width: "49%" }}
                type={operation == "saida" && "primary"}
                onClick={() => {
                  setOperation("saida");
                }}
              >
                Saida
              </Button>
            </div>
          </ViewInput>
          <ViewInput>
            <p>Valor*</p>
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
    </Container>
  );
};

export default Banks;
