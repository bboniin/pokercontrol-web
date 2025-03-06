import React, { useEffect, useState } from "react";
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
  MdStart,
  MdStop,
  MdEdit,
  MdPlayArrow,
} from "react-icons/md";
import { BiSolidMinusCircle, BiSolidPlusCircle } from "react-icons/bi";
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
  Amount,
  ViewAward,
  Table,
  Row,
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
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { getValue } from "../../services/functions";
import { differenceInSeconds, format } from "date-fns";
import IntlCurrencyInput from "react-intl-currency-input";
import MethodsPayment from "../../components/MethodsPayment";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TextArea from "antd/es/input/TextArea";

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

const Ranking = () => {
  const navigate = useNavigate();

  const { ranking_id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  const [ranking, setRanking] = useState({});

  useEffect(() => {
    loadRanking();
  }, []);

  async function loadRanking() {
    setIsLoading(true);
    await api
      .get(`/ranking/${ranking_id}`)
      .then((response) => {
        setRanking(response.data);
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

  async function editRanking() {
    setIsLoadingModal(true);
    if (!name || !value || !description) {
      toast.warning("Preencha todos os campos");
    } else {
      await api
        .put(`/ranking/${ranking_id}`, {
          name: name,
          goal_value: value,
          description: description,
        })
        .then((response) => {
          toast.success("Ranking editado com sucesso");
          setIsOpen(false);
          loadRanking();
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

  async function startRanking() {
    setIsLoadingModal(true);
    await api
      .put(`/start/ranking/${ranking_id}`)
      .then((response) => {
        toast.success("Ranking iniciado com sucesso");
        loadRanking();
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

  async function stopRanking() {
    setIsLoadingModal(true);
    await api
      .put(`/stop/ranking/${ranking_id}`)
      .then((response) => {
        toast.success("Ranking finalizado com sucesso");
        loadRanking();
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

  const status = {
    criado: "Criado",
    andamento: "Em Andamento",
    encerrado: "Encerrado",
  };

  return (
    <Container>
      <Title>
        <h2>Ranking</h2>
        <div>
          {ranking.status == "criado" && (
            <Button
              type="primary"
              onClick={() => {
                confirm({
                  title: "Deseja iniciar o ranking?",
                  content: `Após essa ação, o ranking será iniciado.`,
                  onOk() {
                    startRanking();
                  },
                  onCancel() {},
                  cancelText: "Cancelar",
                });
              }}
            >
              <MdPlayArrow size="20" color="#fff" />
              <span>Iniciar Ranking</span>
            </Button>
          )}
          {ranking.status == "andamento" && (
            <Button
              type="primary"
              onClick={() => {
                confirm({
                  title: "Deseja finalizar o ranking?",
                  content: `Após essa ação, o ranking será finalizado.`,
                  onOk() {
                    startRanking();
                  },
                  onCancel() {},
                  cancelText: "Cancelar",
                });
              }}
            >
              <MdStop size="20" color="#fff" />
              <span>Finalizar Ranking</span>
            </Button>
          )}
          {ranking.status != "final" && (
            <Button
              type="primary"
              onClick={() => {
                setName(ranking.name);
                setDescription(ranking.description);
                setValue(ranking.goal_value);
                setIsOpen(true);
              }}
            >
              <MdEdit size="20" color="#fff" />
              <span>Editar Ranking</span>
            </Button>
          )}
        </div>
      </Title>

      {!isLoading && ranking && (
        <>
          <InfosTournament>
            <h1>{ranking.name}</h1>
            <p>{ranking.description}</p>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
                marginTop: 15,
              }}
            >
              <p>Participantes: {ranking.clients_points?.length}</p>
              <p>Status: {status[ranking.status]}</p>
              <p>
                Andamento Premiação: {getValue(ranking.accumulated_value || 0)}{" "}
                / {getValue(ranking.goal_value || 0)}
              </p>
              <p>
                Última atualização: {format(new Date(), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          </InfosTournament>

          <>
            <h2>Jogadores</h2>

            {ranking.clients_points.length ? (
              <Table>
                <tbody>
                  {ranking.clients_points.map((client, index) => (
                    <tr key={client.id}>
                      <td>{index + 1}°</td>
                      <td>{client.client.name}</td>
                      <td>{client.points}</td>
                      <td>
                        {format(new Date(client.update_at), "dd/MM/yyyy HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {ranking.clients_points.length != 0 && (
                  <thead>
                    <tr>
                      <td>Posição</td>
                      <td>Cliente</td>
                      <td>Pontuação</td>
                      <td>Ultima pontuação</td>
                    </tr>
                  </thead>
                )}
              </Table>
            ) : (
              <div className="error">
                <p>Nenhuma jogador participando do ranking</p>
              </div>
            )}
          </>
        </>
      )}
      {isLoading && <Loader />}
      <Modal
        title="Editar Ranking"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpen}
        okText="EDITAR RANKING"
        cancelText="FECHAR"
        onOk={() => {
          editRanking();
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

export default Ranking;
