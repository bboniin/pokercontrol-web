import React, { useEffect, useState } from "react";
import { MdAdd, MdCopyAll, MdVisibility } from "react-icons/md";
import { IoMdPodium } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import api from "../../services/api";
import { Container, Cards, Card, Table, Title, ViewInput } from "./styles";
import Loader from "../../components/Loader";
import { Button, Input, Modal, Pagination } from "antd";
import { format } from "date-fns";
import { toast } from "react-toastify";
import IntlCurrencyInput from "react-intl-currency-input";
import TextArea from "antd/es/input/TextArea";
import { getValue } from "../../services/functions";

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

const Rankings = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [rankingsTotal, setRankingsTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadRankings();
  }, [page]);

  const status = {
    criado: "Criado",
    andamento: "Em Andamento",
    encerrado: "Encerrado",
  };

  async function loadRankings() {
    await api
      .get(`/rankings?page=${page}`)
      .then((response) => {
        setRankings(response.data.rankings);
        setRankingsTotal(response.data.rankingsTotal);
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

  async function createRanking() {
    setIsLoadingModal(true);
    if (!name || !value || !description) {
      toast.warning("Preencha todos os campos");
    } else {
      await api
        .post(`/ranking`, {
          name: name,
          goal_value: value,
          description: description,
        })
        .then((response) => {
          toast.success("Ranking criado com sucesso");
          setIsOpen(false);
          loadRankings();
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
        <h2>Rankings</h2>
        <div>
          <Button
            type="primary"
            onClick={() => {
              setIsOpen(true);
              setName("");
              setDescription("");
              setValue("");
            }}
          >
            <MdAdd size="20" color="#fff" />
            <span>Novo Ranking</span>
          </Button>
        </div>
      </Title>
      <Cards>
        <Card>
          <div className="icon">
            <IoMdPodium color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={rankingsTotal} />
            <p>Rankigs</p>
          </div>
        </Card>
      </Cards>
      {!isLoading && (
        <>
          {rankings.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td>Ranking</td>
                    <td style={{ textAlign: "center" }}>Participantes</td>
                    <td style={{ textAlign: "center" }}>Status</td>
                    <td style={{ textAlign: "center" }}>Acumulado/Meta</td>
                    <td style={{ textAlign: "center" }}>Última atualização</td>
                    <td style={{ width: 40 }}></td>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking) => (
                    <tr key={ranking.id} style={{ cursor: "pointer" }}>
                      <td
                        onClick={() => {
                          navigate(`/ranking/${ranking.id}`);
                        }}
                      >
                        {ranking.name}
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/ranking/${ranking.id}`);
                        }}
                        style={{ textAlign: "center" }}
                      >
                        {
                          new Set(
                            ranking.clients_points.map((item) => item.client_id)
                          ).size
                        }
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/ranking/${ranking.id}`);
                        }}
                        style={{ textAlign: "center" }}
                      >
                        {status[ranking.status]}
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/ranking/${ranking.id}`);
                        }}
                        style={{ textAlign: "center" }}
                      >
                        {getValue(ranking.accumulated_value)} /{" "}
                        {getValue(ranking.goal_value)}
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/ranking/${ranking.id}`);
                        }}
                        style={{ textAlign: "center" }}
                      >
                        {format(
                          new Date(ranking.update_at),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdVisibility
                          onClick={() => {
                            navigate(`/ranking/${ranking.id}`);
                          }}
                          style={{ marginLeft: 5 }}
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
                  total={rankingsTotal}
                  pageSize={30}
                  showTotal={(total) => `${total} rankings`}
                />
              </center>
            </>
          ) : (
            <div className="error">
              <p>Nenhum ranking encontrado</p>
            </div>
          )}
        </>
      )}
      {isLoading && <Loader />}
      <Modal
        title="Novo Ranking"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpen}
        okText="CRIAR RANKING"
        cancelText="FECHAR"
        onOk={() => {
          createRanking();
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
              multiline={true}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Descrição*</p>
            <TextArea
              placeholder="descrição"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              autoSize={{ maxRows: 4 }}
              style={{
                minWidth: "100%",
                minHeight: 38,
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                paddingTop: 7,
              }}
            />
          </ViewInput>
          <ViewInput>
            <p>Meta*</p>
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
    </Container>
  );
};

export default Rankings;
