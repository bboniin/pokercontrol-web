import React, { useEffect, useState } from "react";
import {
  MdLock,
  MdAdd,
  MdDelete,
  MdEdit,
  MdMonetizationOn,
  MdVisibility,
} from "react-icons/md";
import CountUp from "react-countup";
import { ExclamationCircleFilled } from "@ant-design/icons";

import api from "../../services/api";
import { Container, Cards, Card, Table, Title, ViewInput } from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Button, Modal, Input, Select, Pagination, DatePicker } from "antd";
import IntlCurrencyInput from "react-intl-currency-input";
import { Link } from "react-router-dom";
import { addDays, format } from "date-fns";
import dayjs, { locale } from "dayjs";

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

const Payable = () => {
  const [payables, setPayables] = useState([]);
  const [payablesTotal, setPayablesTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [value, setValue] = useState("");
  const [valueEstimated, setValueEstimated] = useState("");
  const [installments, setInstallments] = useState("");
  const [installmentsPaid, setInstallmentsPaid] = useState("");
  const [type, setType] = useState("");
  const [period, setPeriod] = useState("");
  const [page, setPage] = useState(0);
  const [id, setId] = useState("");
  const [dateCharge, setDateCharge] = useState(addDays(new Date(), 1));
  const [observation, setObservation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  useEffect(() => {
    loadPayables();
  }, []);

  async function loadPayables() {
    setIsLoading(true);
    await api
      .get(`/payables?page=${page}`)
      .then((response) => {
        setPayables(response.data.payables);
        setPayablesTotal(response.data.payablesTotal);
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

  async function createPayable() {
    setIsLoadingModal(true);
    if (
      !account ||
      !value ||
      !name ||
      !period ||
      !type ||
      !dateCharge ||
      !valueEstimated
    ) {
      toast.warning("Preencha os campos obrigatórios");
      setError(true);
    } else {
      await api
        .post(`/payable`, {
          name: name,
          account: account,
          value: value,
          period: period,
          value_estimated: valueEstimated == "estimated",
          recurrence: type == "recurrence",
          installments: installments,
          observation: observation,
          date_charge: dateCharge,
        })
        .then((response) => {
          toast.success("Despesa recorrente criada com sucesso");
          setIsOpen(false);
          loadPayables();
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

  async function editPayable() {
    setIsLoadingModal(true);
    if (!id || !account || !value || !name || !period || !type || !dateCharge) {
      toast.warning("Preencha os campos obrigatórios");
      setError(true);
    } else {
      await api
        .put(`/payable/${id}`, {
          name: name,
          account: account,
          value: value,
          period: period,
          value_estimated: valueEstimated == "estimated",
          recurrence: type == "recurrence",
          installments: installments,
          installmentsPaid: installmentsPaid,
          observation: observation,
          date_charge: dateCharge,
        })
        .then((response) => {
          toast.success("Despesa recorrente editada com sucesso");
          setIsOpen(false);
          loadPayables();
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

  async function deletePayable(payable) {
    await api
      .delete(`/payable/${payable.id}`)
      .then((response) => {
        toast.success("Despesa recorrente deletada com sucesso");
        loadPayables();
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
        <h2>Despesas Recorrentes</h2>
        <div>
          <Button
            type="primary"
            onClick={() => {
              setId("");
              setName("");
              setAccount("");
              setPeriod("");
              setValue("");
              setType("");
              setValueEstimated("");
              setInstallments("");
              setInstallmentsPaid("");
              setObservation("");
              setDateCharge(addDays(new Date(), 1));
              setError(false);
              setIsOpen(true);
            }}
          >
            <MdAdd size="20" color="#fff" />
            <span>Nova Despesa</span>
          </Button>
        </div>
      </Title>
      <Cards>
        <Card>
          <div className="icon">
            <MdMonetizationOn color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={payablesTotal} />
            <p>Total</p>
          </div>
        </Card>
      </Cards>
      {!isLoading && (
        <>
          {payables.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td style={{ textAlign: "left" }}>Nome</td>
                    <td>Tipo</td>
                    <td>Recorrencia</td>
                    <td>Conta</td>
                    <td>Valor</td>
                    <td>Próxima Cobrança</td>
                    <td style={{ width: 80 }}></td>
                  </tr>
                </thead>
                <tbody>
                  {payables.map((payable) => (
                    <tr key={payable.id}>
                      <td style={{ textAlign: "left" }}>{payable.name}</td>
                      <td>
                        {payable.recurrence
                          ? "Recorrente"
                          : `${payable.installmentsPaid}/${payable.installments} parcelas`}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {payable.period}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {payable.account}
                      </td>
                      <td
                        style={
                          payable.value_estimated ? { color: "#FFa500" } : {}
                        }
                      >
                        {payable.value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {format(new Date(payable.date_charge), "dd/MM/yyyy")}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdEdit
                          onClick={() => {
                            setId(payable.id);
                            setName(payable.name);
                            setAccount(payable.account);
                            setValue(payable.value);
                            setInstallments(payable.installments);
                            setInstallmentsPaid(payable.installmentsPaid);
                            setType(
                              payable.recurrence ? "recurrence" : "parceled"
                            );
                            setValueEstimated(
                              payable.valueEstimated ? "estimated" : "fixed"
                            );
                            setPeriod(payable.period);
                            setObservation(payable.observation);
                            setDateCharge(payable.date_charge);
                            setError(false);
                            setIsOpen(true);
                          }}
                          style={{ cursor: "pointer", marginLeft: 5 }}
                          size={22}
                          color={"#001B22"}
                        />
                        <MdDelete
                          onClick={() => {
                            confirm({
                              title: "Deseja excluir a Despesa Recorrente?",
                              icon: <ExclamationCircleFilled />,
                              content: `Após essa ação, a cobrança recorrente ${payable.name} será excluido e não vai criar novas cobranças`,
                              onOk() {
                                deletePayable(payable);
                              },
                              onCancel() {},
                              cancelText: "Cancelar",
                            });
                          }}
                          style={{ cursor: "pointer", marginLeft: 5 }}
                          size={22}
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
                  total={payablesTotal}
                  pageSize={30}
                  showTotal={(total) => `${total} despesas recorrentes`}
                />
              </center>
            </>
          ) : (
            <div className="error">
              <p>Nenhum payablee encontrado</p>
            </div>
          )}
        </>
      )}

      {isLoading && <Loader />}
      <Modal
        title="Despesa Recorrente"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpen}
        okText={id ? "EDITAR DESPESA" : "CADASTRAR DESPESA"}
        cancelText="FECHAR"
        onOk={() => {
          if (id) {
            editPayable();
          } else {
            createPayable();
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
              status={error && !name && "error"}
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>

          <ViewInput>
            <p>Recorrente ou Parcelado?*</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                style={{
                  width: "49%",
                  borderColor: error && !type ? "#ff4d4f" : "",
                }}
                type={type == "recurrence" && "primary"}
                onClick={() => {
                  setType("recurrence");
                }}
              >
                Recorrente
              </Button>
              <Button
                style={{
                  width: "49%",
                  borderColor: error && !type ? "#ff4d4f" : "",
                }}
                type={type == "parceled" && "primary"}
                onClick={() => {
                  setType("parceled");
                }}
              >
                Parcelado
              </Button>
            </div>
          </ViewInput>
          {type == "parceled" && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ViewInput style={{ width: id ? "49%" : "100%" }}>
                <p>Parcelas*</p>
                <Input
                  status={error && !installments && "error"}
                  placeholder="parcelas"
                  value={installments}
                  onChange={(event) =>
                    setInstallments(
                      parseInt(event.target.value.replace(/[^0-9]/g, ""))
                    )
                  }
                />
              </ViewInput>

              {id && (
                <ViewInput style={{ width: "49%" }}>
                  <p>Parcelas Pagas*</p>
                  <Input
                    status={error && !installmentsPaid && "error"}
                    placeholder="parcelas pagas"
                    value={installmentsPaid}
                    onChange={(event) =>
                      setInstallmentsPaid(
                        parseInt(event.target.value.replace(/[^0-9]/g, ""))
                      )
                    }
                  />
                </ViewInput>
              )}
            </div>
          )}
          <ViewInput>
            <p>Periodo de Cobrança*</p>
            <Select
              placeholder={"periodo de cobrança"}
              status={error && !period && "error"}
              value={period || null}
              style={{ width: "100%", fontSize: 14, textAlign: "left" }}
              onChange={(text, type) => {
                setPeriod(type.value);
              }}
              options={[
                { label: "Semanal", value: "semanal" },
                { label: "Quinzenal", value: "quinzenal" },
                { label: "Mensal", value: "mensal" },
                { label: "Bimestral", value: "bimestral" },
                { label: "Trimestral", value: "trimestral" },
                { label: "Semestral", value: "semestral" },
                { label: "Anual", value: "anual" },
              ]}
            />
          </ViewInput>
          <ViewInput>
            <p>Caixa do Clube*</p>
            <Select
              placeholder={"caixa do clube"}
              status={error && !account && "error"}
              value={account || null}
              style={{ width: "100%", fontSize: 14, textAlign: "left" }}
              onChange={(text, type) => {
                setAccount(type.value);
              }}
              options={[
                { value: "clube", label: "Clube" },
                { value: "dealer", label: "Dealer" },
                { value: "passport", label: "Passport" },
                { value: "jackpot", label: "Jackpot" },
              ]}
            />
          </ViewInput>

          <ViewInput>
            <p>Valor Fixo ou Estimado?*</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                style={{
                  width: "49%",
                  borderColor: error && !valueEstimated ? "#ff4d4f" : "",
                }}
                type={valueEstimated == "fixed" && "primary"}
                onClick={() => {
                  setValueEstimated("fixed");
                }}
              >
                Fixo
              </Button>
              <Button
                style={{
                  width: "49%",
                  borderColor: error && !valueEstimated ? "#ff4d4f" : "",
                }}
                type={valueEstimated == "estimated" && "primary"}
                onClick={() => {
                  setValueEstimated("estimated");
                }}
              >
                Estimado
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
                padding: "4px 12px",
                fontSize: 14,
                borderWidth: 1,
                borderColor: error && !value ? "#ff4d4f" : "#ccc",
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
            <p>
              {id ? "Data da Próxima Cobrança" : "Data de Primeira Cobrança"}*
            </p>
            <DatePicker
              placeholder={
                id ? "data da próxima cobrança" : "data de primeira cobrança"
              }
              status={error && !dateCharge && "error"}
              format={"DD/MM/YYYY"}
              locale={locale}
              minDate={dayjs(addDays(new Date(), 1))}
              value={dateCharge ? dayjs(dateCharge) : ""}
              style={{
                minWidth: "100%",
                height: 32,
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
              }}
              onChange={(date) => setDateCharge(date)}
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

export default Payable;
